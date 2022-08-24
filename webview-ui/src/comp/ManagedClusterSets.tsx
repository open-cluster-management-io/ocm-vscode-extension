import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowManagedClusterSets() {
    const [managedClusterSets, setManagedClusterSets] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const managedClusterSetsList = JSON.parse(event.data.managedClusterSets) 
            setManagedClusterSets(managedClusterSetsList) 
                
         } );          
    },[])

    return (          
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr" aria-label='ManagedClusterSets' >
            { managedClusterSets.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Managed Cluster Set Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Conditions</VSCodeDataGridCell>
                              </VSCodeDataGridRow>
            } 

            {managedClusterSets.map((set:any) => {
                console.log(set)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{set.metadata.name}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{set.status.conditions.map( ( condition:any )=> { return<p> {condition.message} - {condition.lastTransitionTime} - {condition.type}: {condition.status} </p>  })} </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )

}

export default ShowManagedClusterSets