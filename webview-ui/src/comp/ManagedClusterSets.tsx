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
        <section className="component-row"> 
            { managedClusterSets.length >0 &&  
                <>
                    <h2 style={{ marginTop: '40px' }}>Managed Cluster Sets</h2>            
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr" aria-label='ManagedClusterSets' >
                        <VSCodeDataGridRow rowType="sticky-header"> 
                        <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Managed Cluster Set Name</VSCodeDataGridCell>
                        <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Api Version</VSCodeDataGridCell>
                        <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Conditions</VSCodeDataGridCell>
                    </VSCodeDataGridRow>

                    {managedClusterSets.map((set:any) => {
                        console.log(set)
                        return <VSCodeDataGridRow> 
                                    <VSCodeDataGridCell gridColumn='1' >{set.metadata.name}</VSCodeDataGridCell>
                                    <VSCodeDataGridCell gridColumn='2' >{set.apiVersion.split('/')[1]}</VSCodeDataGridCell>
                                    <VSCodeDataGridCell gridColumn='3'>{set.status.conditions.map( ( condition:any )=> { return<p> {condition.message} - {condition.lastTransitionTime} - {condition.type}: {condition.status} </p>  })} </VSCodeDataGridCell>
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

export default ShowManagedClusterSets