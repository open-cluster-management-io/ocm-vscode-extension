import React from "react";
import ShowContextInfo from "./comp/ContextInfo";
import ShowManagedClusters from "./comp/ManagedClustersDetails";
import ShowAppliedManifestWork from "./comp/AppliedManifestWork";
import ShowPlacements from "./comp/Placements";
import ShowPlacementDecisions from "./comp/PlacementDecisions";
import ShowManagedClusterSets from "./comp/ManagedClusterSets";
import ShowManagedClusterAddons from "./comp/ManagedClusterAddons";
import ShowClusterManager from "./comp/ClusterManager";
import ShowKlusterlet from "./comp/Klusterlet";
import ShowSubscriptionReport from "./comp/SubscriptionReport";
import ShowSubscriptionStatus from "./comp/SubscriptionStatus";
import ShowManifestWorks from "./comp/Manifestwork";




class App extends React.Component {
  render(): JSX.Element {
    return (
        <main>
		  <ShowContextInfo/>

          <ShowClusterManager/>

          <ShowManagedClusters/>

          <ShowManifestWorks/>

          <ShowSubscriptionReport/>

          <ShowPlacements/>

          <ShowPlacementDecisions/>

          <ShowManagedClusterSets/>

          <ShowManagedClusterAddons/>

          <ShowKlusterlet/>

          <ShowAppliedManifestWork/>

          <ShowSubscriptionStatus/>

        </main>
  )}
}

 export default App;
