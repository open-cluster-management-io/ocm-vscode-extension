import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowAppliedManifestWork() {
    const [appliedManifestWork, setAppliedManifestWork] = useState([]);
    useEffect(() => {       
        window.addEventListener("message", event => {
            const appliedManifestWorksList = JSON.parse(event.data.appliedManifestWork) 
            setAppliedManifestWork(appliedManifestWorksList) 
                
         } );          
    },[])

    return (          
        <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='Applied Manifest Work' >
            { appliedManifestWork.length >0 &&
                 <VSCodeDataGridRow rowType="sticky-header"> 
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Manifest Work Name</VSCodeDataGridCell>
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Creation TimeStamp</VSCodeDataGridCell>                
                                    <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Applied Resources</VSCodeDataGridCell>
                              </VSCodeDataGridRow>
            } 

            {appliedManifestWork.map((appliedManifest:any) => {
                console.log(appliedManifest)
                return <VSCodeDataGridRow> 
                            <VSCodeDataGridCell gridColumn='1' >{appliedManifest.spec.manifestWorkName}</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='2'>{appliedManifest.metadata.creationTimestamp} </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn='3'>{appliedManifest.status.appliedResources.map( ( resource:any )=> { return<div>  Group: {resource.group} {"\n"}, Name: {resource.name}  {"\n"} ,Namespace: {resource.namespace}  {"\n"} ,Resource: {resource.resource} {"\n"} </div>  })} </VSCodeDataGridCell>
                       </VSCodeDataGridRow>
            } )
            }
        </VSCodeDataGrid>
    )

}

export default ShowAppliedManifestWork