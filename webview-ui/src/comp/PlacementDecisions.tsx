import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowPlacementDecisions() {
    const [placementDecisions, setPlacementDecisions] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const placementDecisionsList = JSON.parse(event.data.placementDecisions) 
            setPlacementDecisions(placementDecisionsList) 
                
         } );          
    },[])

    return (          
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr" aria-label='PlacementDecisions' >
            { placementDecisions.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Placement Decision Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Decisions</VSCodeDataGridCell>
                              </VSCodeDataGridRow>
            } 

            {placementDecisions.map((decision:any) => {
                console.log(decision)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{decision.metadata.name}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{decision.metadata.namespace} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='3'>{decision.status.decisions.map( ( dec:any )=> { return<p> {dec.clusterName} - {dec.reason} </p>  })} </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )

}

export default ShowPlacementDecisions