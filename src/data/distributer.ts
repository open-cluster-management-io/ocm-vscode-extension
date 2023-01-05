import * as loader from '../data/loader';
import { ConnectedContext } from '../data/builder';

const hubManagedClusterKind = 'ManagedCluster';
const hubKinds = ['ManifestWork', 'Placement', 'PlacementDecision', 'ManagedClusterSet', 'ManagedClusterAddOn', 'ClusterManager', 'SubscriptionReport'];
const spokeKlusterletKind = 'Klusterlet';
const spokeKinds = ['AppliedManifestWork', 'SubscriptionStatus'];

// listeners for messages posted here resides in the components package in the react module
export async function distributeMessages(selectedContext: ConnectedContext, consumer: CallableFunction): Promise<void> {
	// get the loader instance
	let load = loader.Load.getLoader();

	// retrieve all managedclusters and klusterlets resources
	let managedClusters = await load.getCrs(hubManagedClusterKind);
	let klusterlets = await load.getCrs(spokeKlusterletKind);

	// populate the SelectedContext ui component
	consumer({selectedContext: JSON.stringify(selectedContext)});

	let crsDistributions: Promise<void>[] = [];

	// a cluster with ManagedCluster resources, acts as a hub cluster
	if (managedClusters.length > 0 ){
		// populate the ManagedClusters ui component
		crsDistributions.push(distributeCrs(hubManagedClusterKind, consumer, managedClusters));
		// populate common crs used by the hub cluster
		hubKinds.forEach(kind => crsDistributions.push(distributeCrsForKind(kind, load, consumer)));
	}

	// a cluster with Klusterlet resources, acts as a spoke cluster
	if (klusterlets.length > 0 ){
		// populate the Klusterlets ui component
		crsDistributions.push(distributeCrs(spokeKlusterletKind, consumer, klusterlets));
		// populate common crs used by the spoke cluster
		spokeKinds.forEach(kind => crsDistributions.push(distributeCrsForKind(kind, load, consumer)));
	}

	await Promise.allSettled(crsDistributions);
}

async function distributeCrsForKind(kind: string, load: loader.Load, consumer: CallableFunction): Promise<void> {
	let crs = await load.getCrs(kind);
	await distributeCrs(kind, consumer, crs);
}

async function distributeCrs(kind: string, consumer: CallableFunction, crs: loader.OcmResource[]): Promise<void> {
	if (crs.length > 0) {
		consumer({ crsDistribution: { kind: kind, crs: JSON.stringify(crs)}});
	}
}
