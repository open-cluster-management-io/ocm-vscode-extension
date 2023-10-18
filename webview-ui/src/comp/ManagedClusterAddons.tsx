import { OcmResource } from '../../../src/data/loader'
import { Gallery, Title } from '@patternfly/react-core';
import { DateFormat } from '../common/common';
import GalleryTableComponent from '../common/ConditionTable';

type ManagedClusterAddonsProps = {
    managedClusterAddons: OcmResource[]
}

export default function ShowManagedClusterAddons(Props: ManagedClusterAddonsProps) {

    return (        
        <section className="component-row">
            { Props.managedClusterAddons.length > 0 &&
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Managed Cluster Addons</Title>
                    <Gallery className='ocm-gallery' hasGutter={true} >
                    {Props.managedClusterAddons.map(managedClusterAddon => {

                                const row = managedClusterAddon.kr.status.conditions.map( (condition:any) => { 
                                    return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                                            condition.message,
                                            condition.reason,
                                            condition.status
                                        ]      
                                    })
                                return  <GalleryTableComponent  
                                            title={`Name: ${managedClusterAddon.kr.metadata.name}`}
                                            rows={row}
                                            id={`${managedClusterAddon.kr.metadata.name}`}
                                        >  
                                        <p>Managed Cluster: {managedClusterAddon.namespace}</p>
                                        <p>Install Namespace: {managedClusterAddon.kr.spec.installNamespace}</p>
                                        </GalleryTableComponent>
                                    })
                                }   
                    </Gallery>    
                    </>
            }
        </section>
    );
}
