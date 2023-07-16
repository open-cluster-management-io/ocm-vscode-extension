import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Card, CardBody, CardHeader, Gallery, GalleryItem, Title } from '@patternfly/react-core';
import {Graph, Node, KubeResource } from '../common/Graph';
import { kubeImage } from '../common/common';

export default function ShowManifestWorks() {
    let [manifestWorks, setManifestWorks] = useState<OcmResource[]>([]);
    let [showMore, setShowMore] = useState<Map<any, boolean>>(new Map());
    let [kubeImages, setKubeImages] = useState<kubeImage[]>([]);

	const updateShowMore = (k: any, v: boolean) => {
        setShowMore(new Map(showMore.set(k, v)));
    }

	useEffect(() => {
        window.addEventListener("message", event => {

			if ('crsDistribution' in event.data.msg && 'ManifestWork' === event.data.msg.crsDistribution.kind) {
                //TODO move this logic to Graph 
                setKubeImages(event.data.images)

				let manifestWorks = JSON.parse(event.data.msg.crsDistribution.crs);
				manifestWorks.forEach((manifestWork: OcmResource) => updateShowMore(manifestWork.name, false));
				setManifestWorks(manifestWorks);
			}
        });
    });


    const manifestWorksResource: Node[] = manifestWorks.map(manifestWork => {
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
                            </CardHeader>
                            <CardBody>
                                    <Graph data={manifestwork} images={kubeImages}/>
                            </CardBody>
                            </Card>
                        </GalleryItem>   
            })}
            </Gallery>
        </section>
    );
}
