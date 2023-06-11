import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Accordion, AccordionContent, AccordionItem, AccordionToggle, Gallery, Title } from '@patternfly/react-core';
import GalleryTableComponent from '../common/ConditionTable';
import { DateFormat } from '../common/common';
import  PlacementDecision from './PlacementDecision'
import yaml from 'js-yaml';
import { OcmLabels } from '../common/Labels';


export default function ShowPlacements() {
    let [placements, setPlacements] = useState<OcmResource[]>([]);
    const [expanded, setExpanded] =  useState('');

    

	useEffect(() => {
        window.addEventListener("message", event => {
			if ('crsDistribution' in event.data.msg && 'Placement' === event.data.msg.crsDistribution.kind) {
				setPlacements(JSON.parse(event.data.msg.crsDistribution.crs));
			}
        });
        });

        const onToggle = (id: string) => {
          if (id === expanded) {
            setExpanded('');
          } else {
            setExpanded(id);
          }
        };

    return (
        <section className="component-row">
            { placements.length > 0 &&
                <>

                <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Placements</Title>
                <Gallery className='ocm-gallery' hasGutter={true} >
                { placements.map( (placement) => { 
                            console.log(placement)
                            const codeJson = placement.kr.spec 
                            const code =yaml.dump(codeJson);
                            const row = placement.kr.status.conditions.map( (condition:any) => { 
                                return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                                        condition.message,
                                        condition.reason,
                                        condition.status
                                    ]      
                                })  
                            const placementName =  placement.kr.metadata.name;    
                            const labels = placement.kr.metadata.labels? <OcmLabels labels={placement.kr.metadata.labels} />:null     
                    return <>
                            <GalleryTableComponent
                                title={`Name: ${placementName}`}
                                subtitle={`Namespace: ${placement.kr.metadata.namespace}`}
                                rows={row}
                                code={code}
                                id={`${placementName}`} > 
                                <Accordion> 
                                    <AccordionItem>
                                        <AccordionToggle  onClick={() => {
                                                                            onToggle(`def-list-${placementName}`);
                                                                        }}
                                                                        isExpanded={expanded === `def-list-${placementName}`}
                                                                        id={`def-list-${placementName}`}>
                                            Number of selected clusters: {placement.kr.status.numberOfSelectedClusters} 
                                        </AccordionToggle>
                                    <AccordionContent id={`def-expanded-${placementName}`} isHidden={expanded !== `def-list-${placementName}`}>
                                        <PlacementDecision placementName={placementName}/>
                                    </AccordionContent>    
                                    </AccordionItem>
                                </Accordion>
                            {labels}     
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
