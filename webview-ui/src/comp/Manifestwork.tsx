import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowManifestWorks() {
    const [manifestWorks, setManifestWorks] = useState([]);
    const [showMore, setShowMore] = useState(new Map());
    const updateShowMore = (k:any,v:boolean) => {
        setShowMore(new Map(showMore.set(k,v)));
    }
    useEffect(() => {
        window.addEventListener("message", event => {
            const manifestWorksList = JSON.parse(event.data.manifestWorks)
            manifestWorksList.map((cluster:any) => updateShowMore(cluster.metadata.name, false))
            setManifestWorks(manifestWorksList)

         } );
    })

    return (
        <section className="component-row">
            { manifestWorks.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>ManifestWorks</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr 1fr" aria-label='ManifestWorks' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>ManifestWork Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Owner References</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Conditions</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='5'>Resource Status</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {manifestWorks.map((manifest:any) => {
                            console.log(manifest)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{manifest.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{manifest.metadata.namespace} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>
                                            {manifest.metadata.ownerReferences !== undefined && manifest.metadata.ownerReferences !== null 
                                                ? 
                                                    manifest.metadata.ownerReferences.map( ( owner:any )=> { return<p> - apiVersion: {owner.apiVersion}, blockOwnerDeletion: {owner.blockOwnerDeletion.toString()}, controller: {owner.controller.toString()}, kind: {owner.kind}, name: {owner.name} </p>  })
                                                : 
                                                    ""
                                            } 
                                        </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='4'>{manifest.status.conditions.map( ( condition:any )=> { return<p> - lastTransitionTime: {condition.lastTransitionTime}, message: {condition.message}, observedGeneration: {condition.observedGeneration}, reason: {condition.reason}, status: {condition.status}, type: {condition.type} </p>  })} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='5'>
                                            <VSCodeButton onClick={() => updateShowMore(manifest.metadata.name, !showMore.get(manifest.metadata.name))}> {showMore.get(manifest.metadata.name) ? "Less" : "More"} </VSCodeButton>
                                            {showMore.get(manifest.metadata.name) 
                                                ?
                                                    manifest.status.resourceStatus.manifests.map( ( mf:any )=> { return<p> - group: {mf.resourceMeta.group}, kind: {mf.resourceMeta.kind}, name: {mf.resourceMeta.name}, namespace: {mf.resourceMeta.namespace}, ordinal: {mf.resourceMeta.ordinal}, resource: {mf.resourceMeta.resource}, version: {mf.resourceMeta.version}
                                                        <ul>{mf.conditions.map( ( cond:any )=> { return<li> lastTransitionTime: {cond.lastTransitionTime}, message: {cond.message}, reason: {cond.reason}, status: {cond.status}, type: {cond.type} </li>  })}</ul>
                                                    </p>  })
                                                : 
                                                    ''
                                            }
                                        </VSCodeDataGridCell>
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

export default ShowManifestWorks
