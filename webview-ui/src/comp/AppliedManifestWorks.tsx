import { OcmResource } from '../../../src/data/loader'
import { Gallery, Title } from '@patternfly/react-core';
import GalleryTableComponent from '../common/ConditionTable';
import {DateFormat, kubeImage} from '../common/common'
import Graph from '../common/Graph';


type AppliedManifestWorksProps = {
    appliedManifestWorks: OcmResource[],
    kubeImages: kubeImage[]
}    

export default  function ShowAppliedManifestWorks(Props:AppliedManifestWorksProps) {


    const AppliedResourcesColumn:  Object[] = [    
        {title: "Resource Name",},
        {title: "Resource"},
        {title: "Group" , }, 
        {title: "Namespace" }
    ]
    return (
        <section className="component-row">
            { Props.appliedManifestWorks.length > 0 &&
                <> 
                    
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Applied ManifestWorks</Title>
                    <Gallery className='ocm-gallery' hasGutter={true} >
                        {Props.appliedManifestWorks.map(appliedManifestWork => {
                                console.log(`appliedManifestWork`)
                                console.log(appliedManifestWork)
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
                                    >
                                        <Graph data={{  name: appliedManifestWork.kr.spec.manifestWorkName,
                                                                namespace: appliedManifestWork.kr.metadata.namespace?appliedManifestWork.kr.metadata.namespace:'missing namespace',
                                                                children:  appliedManifestWork.kr.status.appliedResources.map( (appliedResources:any) => {

                                                                    return {
                                                                        group: appliedResources.group,
                                                                        name: appliedResources.name,
                                                                        namespace: appliedResources.namespace,
                                                                        kind: appliedResources.resource,
                                                                        version: appliedResources.version
                                                                    }
                                                                })
                                                } } images={Props.kubeImages}
                                        />    
                                    </GalleryTableComponent>                     
                                    }
                                )}   
                    </Gallery>
                <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>
    );
}
