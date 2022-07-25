import * as k8s from '@kubernetes/client-node/dist/';

class ConnectedCluster {
	readonly cluster: k8s.Cluster;

	constructor(cluster: k8s.Cluster) {
		this.cluster = cluster;

	}
}

class KubeDataLoader {

   public loadConnectedClusters(): ConnectedCluster[] {
    const kubeConfig = new k8s.KubeConfig();
	kubeConfig.loadFromDefault();
	const connectedClusters = kubeConfig.clusters.map(cluster => new ConnectedCluster(cluster));     
	return connectedClusters;        
    }
}

export default KubeDataLoader;