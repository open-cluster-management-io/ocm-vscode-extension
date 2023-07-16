import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Title } from '@patternfly/react-core';


type PlacementDecisionsProps = {
    placementName: string, 
    placementNamespace?: string,
}

export default function PlacementDecision(Props: PlacementDecisionsProps ) {
    let [placementDecisions, setPlacementDecisions] = useState<OcmResource[]>([]);

	useEffect(() => {
        window.addEventListener("message", event => {
			if ('crsDistribution' in event.data.msg && 'PlacementDecision' === event.data.msg.crsDistribution.kind) {
				setPlacementDecisions(JSON.parse(event.data.msg.crsDistribution.crs));
			}
		});
    });

    return (<>
    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Placement Decisions</Title>
    <p>Selected Clusters</p>
    {placementDecisions.map( (placementDecision:any) => {
                            let res                           
                            placementDecision.kr.metadata.ownerReferences.forEach( (ref:any) => { 
                                if(placementDecision.kr.status  !== undefined && placementDecision.kr.status.decisions  !== undefined){
                                    if (ref.kind.toLowerCase() === "placement" && ref.name.toLowerCase() === Props.placementName.toLowerCase() ) {
                                        placementDecision.kr.status.decisions.forEach((decision:any) => {
                                                res = <>                                    
                                                        <p>Cluster: {decision.clusterName} </p>
                                                    </>                                                    
                                            })                                            
                                        }                                      
                                    }                                                                                                      
                                })
                            return res      
                            })
    }    
    </>
    )
}

