import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowClusterManager() {
    const [clusterManager, setClusterManager] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
			if ('clusterManager' in event.data) {
				const clusterManagerList = JSON.parse(event.data.clusterManager)
				setClusterManager(clusterManagerList)
			}

		});
    },[])

    return (
        <section className="component-row">
            { clusterManager.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Cluster Manager</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr" aria-label='ClusterManager' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Cluster Manager Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Conditions</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {clusterManager.map((manager:any) => {
                            console.log(manager)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{manager.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{manager.status.conditions.map( ( condition:any )=> { return<p> - lastTransitionTime: {condition.lastTransitionTime}, message: {condition.message}, reason: {condition.reason}, status: {condition.status}, type: {condition.type} </p>  })} </VSCodeDataGridCell>
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

export default ShowClusterManager
