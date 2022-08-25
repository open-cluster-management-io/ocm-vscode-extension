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
        <section className="component-row"> 
            { managedClusterAddons.length >0 &&  
                <>
                    <h2 style={{ marginTop: '40px' }}>Managed Cluster Addons</h2>             
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr" aria-label='ManagedClusterAddons' >
                        <VSCodeDataGridRow rowType="sticky-header"> 
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Managed Cluster Addon Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>                
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Conditions</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

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
                    <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>
    )

}

export default ShowManagedClusterAddons