import {  VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import AppStatus from "./comp/AppStatus"
import React from "react";
import ClusterDropDownList from "./comp/ClustersDropDown";
import { vscode } from "./utilities/vscode";
import ShowManagedClusters from "./comp/ManagedClustersDetails";
import ShowAppliedManifestWork from "./comp/AppliedManifestWork";
import ShowPlacements from "./comp/Placements";
import ShowPlacementDecisions from "./comp/PlacementDecisions";
import ShowManagedClusterSets from "./comp/ManagedClusterSets";
import ShowManagedClusterAddons from "./comp/ManagedClusterAddons";




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
           
          <section className="component-row">
            <ShowManagedClusters/>
          </section>
          
          <section className="component-row">
            <ShowAppliedManifestWork/>
          </section>

          <section className="component-row">
            <ShowPlacements/>
          </section>

          <section className="component-row">
            <ShowPlacementDecisions/>
          </section>

          <section className="component-row">
            <ShowManagedClusterSets/>
          </section>

          <section className="component-row">
            <ShowManagedClusterAddons/>
          </section>
        </main>
  )}
}

 export default App;
