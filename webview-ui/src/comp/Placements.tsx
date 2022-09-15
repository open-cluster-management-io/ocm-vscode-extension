import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowPlacements() {
    const [placements, setPlacements] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
            const placementsList = JSON.parse(event.data.placements)
            setPlacements(placementsList)

         } );
    },[])

    return (
        <section className="component-row">
            { placements.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Placements</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='Placement' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Placement Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Number of Selected Clusters</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Conditions</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {placements.map((placement:any) => {
                            console.log(placement)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{placement.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{placement.metadata.namespace} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{placement.status.numberOfSelectedClusters} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='4'>{placement.status.conditions.map( ( condition:any )=> { return<p> - lastTransitionTime: {condition.lastTransitionTime}, message: {condition.message}, reason: {condition.reason}, status: {condition.status}, type: {condition.type} </p>  })} </VSCodeDataGridCell>
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

export default ShowPlacements
