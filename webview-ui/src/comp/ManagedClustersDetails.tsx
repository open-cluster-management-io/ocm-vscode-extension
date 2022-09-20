import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow} from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';


function ShowManagedClusters(){
    const [managedClusters, setManagedClusters] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
            const managedClustersList = JSON.parse(event.data.managedClusters)
            setManagedClusters(managedClustersList)

         } );
    },[])

    return (
        <section className="component-row">
            { managedClusters.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Managed Clusters</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr" aria-label='Managed Clusters' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Cluster Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Kube Version</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Conditions</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {managedClusters.map((cluster:any) => {
                            console.log(cluster)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{cluster.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{cluster.status.version.kubernetes} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{cluster.status.conditions.map( ( condition:any )=> { return<p> - lastTransitionTime: {condition.lastTransitionTime}, message: {condition.message}, reason: {condition.reason}, status: {condition.status}, type: {condition.type} </p>  })} </VSCodeDataGridCell>
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

export default ShowManagedClusters
