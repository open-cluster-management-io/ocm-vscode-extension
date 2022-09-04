import * as k8s from '@kubernetes/client-node';
import * as path  from 'path';
import * as vscode from 'vscode';

type CustomViewType = ConnectedCluster | OcmResourceDefinition| OcmResource;

export class ConnectedCluster extends vscode.TreeItem {
	readonly cluster: k8s.Cluster;

	constructor(cluster: k8s.Cluster) {
		super(cluster.name, vscode.TreeItemCollapsibleState.Collapsed);
		this.cluster = cluster;
		this.tooltip = cluster.server;
		this.command = {
			"title": "details",
			"command": "ocm-vscode-extension.showClusterDetails",
			"arguments": [cluster.name]
		};

	}

	iconPath = {
		light: path.join(__dirname, '..', '..', '..', 'images', 'light', 'k8s.svg'),
		dark: path.join(__dirname, '..', '..', '..', 'images', 'dark', 'k8s.svg'),
	};
}

export class OcmResourceDefinition extends vscode.TreeItem {
	readonly crd: k8s.V1CustomResourceDefinition;

	constructor(crd: k8s.V1CustomResourceDefinition) {
		super(crd.spec.names.kind, vscode.TreeItemCollapsibleState.Collapsed);
		this.crd = crd;
		this.tooltip = crd.spec.group;
	}

	iconPath = {
		light: path.join(__dirname, '..', '..', '..', 'images', 'light', 'ocm.svg'),
		dark: path.join(__dirname, '..', '..', '..', 'images', 'dark', 'ocm.svg'),
	};
}

export class OcmResource extends vscode.TreeItem {
	constructor(name: string, namespace: string, version: string) {
		super(name, vscode.TreeItemCollapsibleState.None);
		this.tooltip = version;
		this.description = namespace;
	}
}

export class ConnectedClustersProvider implements vscode.TreeDataProvider<CustomViewType> {
	private kubeConfig = new k8s.KubeConfig();
	private connectedClusters: ConnectedCluster[] = [];
	private configRefreshedEmitter: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	readonly onDidChangeTreeData: vscode.Event<void> = this.configRefreshedEmitter.event;

	constructor() {
		this.updateK8SConfig();
	}

	refresh(): void {
		this.updateK8SConfig();
		this.configRefreshedEmitter.fire();
	}

	getTreeItem(element: CustomViewType): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: CustomViewType): vscode.ProviderResult<CustomViewType[]> {
		if (element) {
			if (element instanceof ConnectedCluster) {
				// children of a connected clusters are ocm's api resources
				return this.getOcmResourceDefinitions(element.cluster);
			}
			if (element instanceof OcmResourceDefinition) {
				// children of an ocm resource definition are ocm resources
				return this.getOcmResources(element.crd);
			}
		}
		// top level children are the connected clusters
		return this.connectedClusters;
	}

	private updateK8SConfig(): void {
		this.kubeConfig.loadFromDefault();
		this.connectedClusters = this.kubeConfig.clusters.map(cluster => new ConnectedCluster(cluster));
	}

	private async getOcmResourceDefinitions(cluster: k8s.Cluster): Promise<OcmResourceDefinition[]> {
		this.kubeConfig.setCurrentContext(cluster.name);
		let k8sExtApi = this.kubeConfig.makeApiClient(k8s.ApiextensionsV1Api);
		let apiResponse = await k8sExtApi.listCustomResourceDefinition();
		if (apiResponse.response.statusCode !== 200) {
			return [];
		}
		return apiResponse.body.items
			.filter(item => item.spec.group.includes('open-cluster-management'))
			.map(item => new OcmResourceDefinition(item));
	}

	private async getOcmResources(crd: k8s.V1CustomResourceDefinition): Promise<OcmResource[]> {
		let k8sCustomObjApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);

		let listResourcesPromises: Promise<void>[] = [];
		let customResources: OcmResource[] = [];

		if (crd.spec.scope === 'Namespaced') {
			await this.getNamespacedResourceLists(crd, k8sCustomObjApi, listResourcesPromises, customResources);
		} else {
			await this.getClusterResourceLists(crd, k8sCustomObjApi, listResourcesPromises, customResources);
		}

		await Promise.allSettled(listResourcesPromises);
		return customResources;
	}

	private async getNamespacedResourceLists(
		crd: k8s.V1CustomResourceDefinition,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: OcmResource[]): Promise<void> {

		let k8sCoreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
		let namespacesApiResponse = await k8sCoreApi.listNamespace();
		if (namespacesApiResponse.response.statusCode === 200) {
			namespacesApiResponse.body.items.forEach(ns => {
				if (ns.metadata && ns.metadata.name) {
					let namespace = ns.metadata.name;
					let storedVersion = crd.status?.storedVersions?.at(0);
					listResourcesPromises.push(
						// @ts-ignore
						k8sCustomObjApi.listNamespacedCustomObject(crd.spec.group, storedVersion, namespace, crd.spec.names.plural)
						.then(crApiResponse => {
							if (crApiResponse.response.statusCode === 200) {
								// @ts-ignore
								crApiResponse.body.items.forEach(item =>
									customResources.push(new OcmResource(item.metadata.name, namespace, item.apiVersion.split('/').at(-1))));
							}
						}));
				}
			});
		}
	}

	private async getClusterResourceLists(
		crd: k8s.V1CustomResourceDefinition,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: OcmResource[]): Promise<void> {

		let storedVersion = crd.status?.storedVersions?.at(0);
		listResourcesPromises.push(
			// @ts-ignore
			k8sCustomObjApi.listClusterCustomObject(crd.spec.group, storedVersion, crd.spec.names.plural)
			.then(crApiResponse => {
				if (crApiResponse.response.statusCode === 200) {
					// @ts-ignore
					crApiResponse.body.items.forEach(item =>
						customResources.push(new OcmResource(item.metadata.name, '', item.apiVersion.split('/').at(-1))));
				}
			}));
	}
}
