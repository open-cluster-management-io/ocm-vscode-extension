import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowAppliedManifestWork() {
    const [appliedManifestWork, setAppliedManifestWork] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
			if ('appliedManifestWork' in event.data) {
				const appliedManifestWorksList = JSON.parse(event.data.appliedManifestWork)
				setAppliedManifestWork(appliedManifestWorksList)
			}
        });
    },[])

    return (
        <section className="component-row">
            { appliedManifestWork.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Applied Manifest Works</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 2fr" aria-label='AppliedManifestWork' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Manifest Work Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Creation TimeStamp</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Applied Resources</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {appliedManifestWork.map((appliedManifest:any) => {
                            console.log(appliedManifest)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{appliedManifest.spec.manifestWorkName}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{appliedManifest.metadata.creationTimestamp} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{appliedManifest.status.appliedResources.map( ( resource:any )=> { return<p>  - group: {resource.group}, name: {resource.name}, namespace: {resource.namespace}, resource: {resource.resource} </p>  })} </VSCodeDataGridCell>
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

export default ShowAppliedManifestWork
