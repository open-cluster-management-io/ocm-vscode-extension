import * as k8s from '@kubernetes/client-node/dist/';
import { OcmResource} from '../providers/connectedClusters';
import { V1CustomResourceDefinition } from '@kubernetes/client-node/dist/';


// interface clusterDetails {

// }

class ConnectedCluster {
	readonly cluster: k8s.Cluster;
	constructor(cluster: k8s.Cluster) {
		this.cluster = cluster;

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

   public loadConnectedClusters(): ConnectedCluster[] {
		const kubeConfig = new k8s.KubeConfig();
		kubeConfig.loadFromDefault();
		const connectedClusters = kubeConfig.clusters.map(cluster => new ConnectedCluster(cluster));     
		return connectedClusters;        
    }
	
	async loadManagedCluster(selectCluster:string): Promise<OcmResource[]> {
		const selectClusterlist = this.kubeConfig.clusters.filter(cluster => cluster !== undefined && cluster.name === selectCluster);     
		let managedClusterCrd =  (await this.getOcmResourceDefinitions(selectClusterlist[0])).filter(
			crd => crd.spec.names.kind === "ManagedCluster")[0] ;
		let managedClusters  = this.getOcmResources(managedClusterCrd);
		return managedClusters;
	}

	public async getOcmResourceDefinitions(cluster: k8s.Cluster): Promise<V1CustomResourceDefinition[]> {
		this.kubeConfig.setCurrentContext(cluster.name);
		let k8sExtApi = this.kubeConfig.makeApiClient(k8s.ApiextensionsV1Api);
		let apiResponse = await k8sExtApi.listCustomResourceDefinition();
		if (apiResponse.response.statusCode !== 200) {
			return Promise.resolve([]);
		}
		return Promise.resolve(
			apiResponse.body.items
			.filter(item => item.spec.group.includes('open-cluster-management')));
	}

	public async getOcmResources(crd: k8s.V1CustomResourceDefinition): Promise<OcmResource[]> {
		let k8sCustomObjApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);

		var listResourcesPromises: Promise<void>[] = [];
		var customResources: OcmResource[] = [];

		if (crd.spec.scope === 'Namespaced') {
			await this.getNamespacedResourceLists(crd.spec, k8sCustomObjApi, listResourcesPromises, customResources);
		} else {
			await this.getClusterResourceLists(crd.spec, k8sCustomObjApi, listResourcesPromises, customResources);
		}

		await Promise.all(listResourcesPromises);
		return Promise.resolve(customResources);
	}

	public async getNamespacedResourceLists(
		spec: k8s.V1CustomResourceDefinitionSpec,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: any[]): Promise<void> {

		let k8sCoreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
		let namespacesApiResponse = await k8sCoreApi.listNamespace();
		if (namespacesApiResponse.response.statusCode === 200) {
			namespacesApiResponse.body.items.forEach(ns => {
				if (ns.metadata && ns.metadata.name) {
					let namespace = ns.metadata.name;
					spec.versions.forEach(async ver => {
						listResourcesPromises.push(
							k8sCustomObjApi.listNamespacedCustomObject(spec.group, ver.name, namespace, spec.names.plural)
							.then(crApiResponse => {
								if (crApiResponse.response.statusCode === 200) {
									// @ts-ignore
									crApiResponse.body.items.forEach(item =>
										customResources.push(item));
								}
							}));
					});
				}
			});
		}
	}

	public async getClusterResourceLists(
		spec: k8s.V1CustomResourceDefinitionSpec,
		k8sCustomObjApi: k8s.CustomObjectsApi,
		listResourcesPromises: Promise<void>[],
		customResources: any[]): Promise<void> {

		spec.versions.forEach(async ver => {
			listResourcesPromises.push(
				k8sCustomObjApi.listClusterCustomObject(spec.group, ver.name, spec.names.plural)
				.then(crApiResponse => {
					if (crApiResponse.response.statusCode === 200) {
						// @ts-ignore
						crApiResponse.body.items.forEach(item =>
							customResources.push( item ));
					}
				}));
		});
	}

}

export default KubeDataLoader;