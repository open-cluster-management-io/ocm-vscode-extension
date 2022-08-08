import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow} from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';


function ShowManagedClusters(){
    const [managedClusters, setManagedClusters] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const managedClustersList = JSON.parse(event.data.managedClusters) 
            setManagedClusters(managedClustersList) 
            console.log(managedClustersList.length)                
         } ); 


         
    },[])

    return (          
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='Managed Clusters' >
            { managedClusters.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Cluster Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Kube Version</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Conditions</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Actions</VSCodeDataGridCell>
                              </VSCodeDataGridRow>
            } 

            {managedClusters.map((cluster:any) => {
                console.log(cluster)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{cluster.metadata.name}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{cluster.status.version.kubernetes} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='3'>{cluster.status.conditions.map( ( condition:any )=> { return<p> {condition.message} - {condition.lastTransitionTime}  - {condition.status} </p>  })} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='4'><VSCodeButton> More </VSCodeButton> </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )
}

export default ShowManagedClusters