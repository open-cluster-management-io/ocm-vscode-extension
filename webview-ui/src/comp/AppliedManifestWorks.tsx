import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Gallery, Title } from '@patternfly/react-core';
import GalleryTableComponent from '../common/ConditionTable';
import {DateFormat} from '../common/common'
export default  function ShowAppliedManifestWorks() {
    let [appliedManifestWorks, setAppliedManifestWorks] = useState<OcmResource[]>([]);

	useEffect(() => {
		window.addEventListener("message", event => {
			if ('crsDistribution' in event.data.msg && 'AppliedManifestWork' === event.data.msg.crsDistribution.kind) {
				setAppliedManifestWorks(JSON.parse(event.data.msg.crsDistribution.crs));
			}
        });
    });

    const AppliedResourcesColumn:  Object[] = [     
        
        {title: "Resource Name",},
        {title: "Resource"},
        {title: "Group" , }, 
        {title: "Namespace" }
    ]
    return (
        <section className="component-row">
            { appliedManifestWorks.length > 0 &&
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Applied ManifestWorks</Title>
                    <Gallery className='ocm-gallery' hasGutter={true} >
                        {appliedManifestWorks.map(appliedManifestWork => {
                                const row = appliedManifestWork.kr.status.appliedResources.map( (resource:any) => { 
                                        return [ resource.name, resource.resource, resource.group, resource.namespace]      
                                        })
                                          
                        return  <GalleryTableComponent  
                                        title={`ManifestWork Name: ${appliedManifestWork.kr.spec.manifestWorkName}`}
                                        subtitle={`Creation TimeStamp: ${new Date(appliedManifestWork.kr.metadata.creationTimestamp).toLocaleString("en-US",DateFormat)}`}
                                        rows={row}
                                        cells={AppliedResourcesColumn}
                                        sort={{index: 1, direction:"asc"}}
                                        id={`${appliedManifestWork.kr.spec.manifestWorkName}`}
                                    />                      
                                    }
                                )}   
                    </Gallery>
                <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>
    );
}
