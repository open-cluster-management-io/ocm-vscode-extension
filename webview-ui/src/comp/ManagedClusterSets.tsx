import { OcmResource } from '../../../src/data/loader'
import { Gallery, Title } from '@patternfly/react-core';
import {  DateFormat } from '../common/common';
import GalleryTableComponent from '../common/ConditionTable';
import yaml from 'js-yaml';
type managedClusterSetsProps = {
    managedClusterSets: OcmResource[]
}


export default function ShowManagedClusterSets(Props: managedClusterSetsProps) {




    return (
        <section className="component-row">
            { Props.managedClusterSets.length > 0 &&
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Managed Cluster Sets</Title>
                    <Gallery className='ocm-gallery' hasGutter={true} >

                    {Props.managedClusterSets.map(managedClusterSet => {
                        console.log(`managedClusterSet`)
                        console.log(managedClusterSet)
                        const code = yaml.dump(managedClusterSet.kr.spec.clusterSelector)
                        const row = managedClusterSet.kr.status.conditions.map( (condition:any) => { 
                            return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                                    condition.message,
                                    condition.reason,
                                    condition.status
                                ]      
                            })
                        return  <GalleryTableComponent  
                                    title={`ClusterSet Name: ${managedClusterSet.kr.metadata.name}`}
                                    rows={row}
                                    id={`${managedClusterSet.kr.metadata.name}`}
                                    code={code}
                                />  
                        } 
                    )}
                    </Gallery>    
                    </>
            }
        </section>
    );
}
