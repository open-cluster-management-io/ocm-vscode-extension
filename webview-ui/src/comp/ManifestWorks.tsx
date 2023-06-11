import { OcmResource } from '../../../src/data/loader'
import { Card, CardBody, CardHeader, Gallery, GalleryItem, Title } from '@patternfly/react-core';
import {Graph, Node, KubeResource } from '../common/Graph';
import { kubeImage } from '../common/common';

type manifestWorksProps = {
    manifestWorks: OcmResource[] , 
    kubeImages: kubeImage[]
}



export default function ShowManifestWorks( Props: manifestWorksProps ) {


    const manifestWorksResource: Node[] = Props.manifestWorks.map(manifestWork => {
        const kubeResources: KubeResource[] =  manifestWork.kr.status.resourceStatus.manifests.map( ( mf:any )=> {
            return mf.resourceMeta
        })
        return {    name: manifestWork.kr.metadata.name ,
                    namespace: manifestWork.kr.metadata.namespace ,
                    children: kubeResources 
            }
        
    })
    return (
        <section className="component-row">
            <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>ManifestWorks</Title>
            <Gallery className='ocm-gallery' hasGutter={true} >
            {manifestWorksResource.map( manifestwork => {   
                return <GalleryItem>
                        <Card>
                            <CardHeader>   
                            <Title headingLevel='h3' size='md'>Cluster Name: {manifestwork.namespace}</Title>   
                            <Title headingLevel='h3' size='md'>Name: {manifestwork.name}</Title>                
                            </CardHeader>
                            <CardBody>
                                    <Graph data={manifestwork} images={Props.kubeImages}/>
                            </CardBody>
                            </Card>
                        </GalleryItem>   
            })}
            </Gallery>
        </section>
    );
}
