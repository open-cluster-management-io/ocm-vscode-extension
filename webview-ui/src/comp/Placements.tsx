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
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='Placement' >
            { placements.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Placement Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Number of Selected Clusters</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Conditions</VSCodeDataGridCell>                
                              </VSCodeDataGridRow>
            } 

            {placements.map((placement:any) => {
                console.log(placement)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{placement.metadata.name}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{placement.metadata.namespace} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='3'>{placement.status.numberOfSelectedClusters} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='4'>{placement.status.conditions.map( ( condition:any )=> { return<p> {condition.message} - {condition.lastTransitionTime} - {condition.type}: {condition.status} </p>  })} </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )

}

export default ShowPlacements