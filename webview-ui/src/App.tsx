import {  VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import ClusterDropDownList from "./comp/ClustersDropDown";
import { vscode } from "./utilities/vscode";
import ShowManagedClusters from "./comp/ManagedClustersDetails";
import ShowAppliedManifestWork from "./comp/AppliedManifestWork";
import ShowPlacements from "./comp/Placements";
import ShowPlacementDecisions from "./comp/PlacementDecisions";
import ShowManagedClusterSets from "./comp/ManagedClusterSets";
import ShowManagedClusterAddons from "./comp/ManagedClusterAddons";
import ShowSubscriptions from "./comp/Subscriptions";
import ShowClusterManager from "./comp/ClusterManager";
import ShowKlusterlet from "./comp/Klusterlet";




class App extends React.Component {  
  selectedCluster(value:any){
    console.log(value.target.innerText)
    vscode.postMessage( { 'command':'selectedCluster' , 'text':value.target.innerText} )
  } 
  
  render(): JSX.Element {


    return (
        <main>
          <h1>Cluster Details</h1>
          <VSCodeDropdown onClick={this.selectedCluster} >  
            <ClusterDropDownList/>
          </VSCodeDropdown>  
          
          <ShowClusterManager/>
           
          <ShowManagedClusters/>

          <ShowKlusterlet/>

          <ShowAppliedManifestWork/>

          <ShowSubscriptions/>

          <ShowPlacements/>

          <ShowPlacementDecisions/>

          <ShowManagedClusterSets/>

          <ShowManagedClusterAddons/>
          
        </main>
  )}
}

 export default App;
