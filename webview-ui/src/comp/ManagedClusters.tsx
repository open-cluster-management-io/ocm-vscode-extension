import { OcmResource } from '../../../src/data/loader'
import {  Gallery, Title } from '@patternfly/react-core';
import { DateFormat } from '../common/common';
import GalleryTableComponent from '../common/ConditionTable';
import { OcmLabels } from '../common/Labels';
 

type ManagedClusterProps = {
    managedClusters: OcmResource[]
}

export default function ShowManagedClusters(Props: ManagedClusterProps ){

    return (
        <section className="component-row">
            { Props.managedClusters.length > 0 &&
                <>
                <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Managed Clusters</Title>  
                <Gallery className='ocm-gallery' hasGutter={true} >
                {Props.managedClusters.map(managedCluster => {
                        const row = managedCluster.kr.status.conditions.map( (condition:any) => { 
                                return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                                        condition.message,
                                        condition.reason,
                                        condition.status
                                    ]      
                                })                            
                return  <>
                <GalleryTableComponent  
                                title={`Cluster Name: ${managedCluster.kr.metadata.name}`}
                                subtitle={`Kube Version: ${managedCluster.kr.status.version.kubernetes}`}
                                rows={row}
                                id={`${managedCluster.kr.metadata.name}`}
                            >
                    {managedCluster.kr.metadata.labels?<OcmLabels labels={managedCluster.kr.metadata.labels}/>:null }  
                </GalleryTableComponent>            
                        </>                              
                            }
                        )}  
            </Gallery>
            </>
            }
        </section>
    );
}
