import * as k8s from '@kubernetes/client-node/dist/';
import { V1CustomResourceDefinition } from '@kubernetes/client-node/dist/';

class ConnectedContext {
	readonly context: k8s.Context;

	constructor(context: k8s.Context) {
		this.context = context;
	}
}

export class OcmResource {
	readonly name: string;
	readonly namespace: string;
	readonly version: string;

	constructor(name: string, namespace: string, version: string) {
		this.name = name;
		this.namespace = namespace;
		this.version = version;
	}
}

export class ContextInfo {
    readonly name: string;
    readonly cluster: string;
    readonly user: string;

    constructor(name: string, cluster: string, user: string) {
        this.name = name;
        this.cluster = cluster;
        this.user = user;
    }
}

class KubeDataLoader {
	private kubeConfig = new k8s.KubeConfig();

	constructor() {
		this.updateK8SConfig();
	}

	private updateK8SConfig(): void {
		this.kubeConfig.loadFromDefault();
	}

	public loadConnectedContexts(): ConnectedContext[] {
		const kubeConfig = new k8s.KubeConfig();
		kubeConfig.loadFromDefault();
		return kubeConfig.contexts.map(context => new ConnectedContext(context));
    }

	public loadContextInfos(): ContextInfo[] {
        const kubeConfig = new k8s.KubeConfig();
        kubeConfig.loadFromDefault();
        return kubeConfig.contexts.map(context => { return {name: context.name, cluster: context.cluster, user: context.user};});
    }

	async loadManagedCluster(selectedContext: string): Promise<OcmResource[]> {
		let context = this.kubeConfig.getContextObject(selectedContext);
		if (context !== null) {
			let managedClusterCrd =  (await this.getOcmResourceDefinitions(context))
				.filter(crd => crd.spec.names.kind === "ManagedCluster")[0];
			if (managedClusterCrd !== undefined) {
				return this.getOcmResources(managedClusterCrd);
			}
		}
		return [];
	}

	public async getOcmResourceDefinitions(context: k8s.Context): Promise<V1CustomResourceDefinition[]> {
		this.kubeConfig.setCurrentContext(context.name);
		let k8sExtApi = this.kubeConfig.makeApiClient(k8s.ApiextensionsV1Api);
		let apiResponse = await k8sExtApi.listCustomResourceDefinition();
		if (apiResponse.response.statusCode !== 200) {
			return Promise.resolve([]);
		}
		return apiResponse.body.items.filter(item => item.spec.group.includes('open-cluster-management'));
	}

	async getResources(selectedContext: string, kind: string): Promise<OcmResource[]>{
		let k8sCustomObjApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);
		let listResourcesPromises: Promise<void>[] = [];
		let customResources: OcmResource[] = [];

		let context = this.kubeConfig.getContextObject(selectedContext);
		if (context !== null) {
			let resourceCrd =  (await this.getOcmResourceDefinitions(context))
				.filter(crd => crd.spec.names.kind === kind)[0];
			if (resourceCrd !== undefined) {
				await this.getClusterResourceLists(resourceCrd, k8sCustomObjApi, listResourcesPromises, customResources);
				await Promise.all(listResourcesPromises);
				return customResources;
			}
		}
		return [];
	}

	public async getOcmResources(crd: k8s.V1CustomResourceDefinition): Promise<OcmResource[]> {
		let k8sCustomObjApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);

		let listResourcesPromises: Promise<void>[] = [];
		let customResources: OcmResource[] = [];

		if (crd.spec.scope === 'Namespaced') {
			await this.getNamespacedResourceLists(crd, k8sCustomObjApi, listResourcesPromises, customResources);
		} else {
			await this.getClusterResourceLists(crd, k8sCustomObjApi, listResourcesPromises, customResources);
		}

		await Promise.all(listResourcesPromises);
		return customResources;
	}

	public async getNamespacedResourceLists(
		crd: k8s.V1CustomResourceDefinition,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: any[]): Promise<void> {

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
								crApiResponse.body.items.forEach(item => customResources.push(item));
							}
						}));
				}
			});
		}
	}

	public async getClusterResourceLists(
		crd: k8s.V1CustomResourceDefinition,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: any[]): Promise<void> {

		let storedVersion = crd.status?.storedVersions?.at(0);
		listResourcesPromises.push(
			// @ts-ignore
			k8sCustomObjApi.listClusterCustomObject(crd.spec.group, storedVersion, crd.spec.names.plural)
			.then(crApiResponse => {
				if (crApiResponse.response.statusCode === 200) {
					// @ts-ignore
					crApiResponse.body.items.forEach(item => customResources.push(item));
				}
			}));
	}
}

export default KubeDataLoader;
