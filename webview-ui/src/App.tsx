import {  VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import ContextDropDownList from "./comp/ContextsDropDown";
import { vscode } from "./utilities/vscode";
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
	selectedContext(value:any){
    console.log(value.target.innerText)
    vscode.postMessage( { 'command':'selectedContext' , 'text':value.target.innerText} )
  }

  render(): JSX.Element {


    return (
        <main>
          <h1>Context Details</h1>
          <VSCodeDropdown onClick={this.selectedContext} >
            <ContextDropDownList/>
          </VSCodeDropdown>

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
