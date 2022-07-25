import {  VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import AppStatus from "./comp/AppStatus"
import React from "react";
import ClusterDropDownList from "./comp/ClustersDropDown";
import { vscode } from "./utilities/vscode";




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
          <AppStatus activeApps={"1"} errorApps={"2"}/>
        </main>
  )}
}

 export default App;
