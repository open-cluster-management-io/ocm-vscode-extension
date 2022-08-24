import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowManagedClusterAddons() {
    const [managedClusterAddons, setManagedClusterAddons] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const managedClusterAddonsList = JSON.parse(event.data.managedClusterAddons) 
            setManagedClusterAddons(managedClusterAddonsList) 
                
         } );          
    },[])

    return (          
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='ManagedClusterAddons' >
            { managedClusterAddons.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Managed Cluster Addon Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Conditions</VSCodeDataGridCell>
                              </VSCodeDataGridRow>
            } 

            {managedClusterAddons.map((addon:any) => {
                console.log(addon)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{addon.metadata.name}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{addon.metadata.namespace} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='3'>{addon.status.conditions.map( ( condition:any )=> { return<p> {condition.message} - {condition.lastTransitionTime} - {condition.type}: {condition.status} </p>  })} </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )

}

export default ShowManagedClusterAddons