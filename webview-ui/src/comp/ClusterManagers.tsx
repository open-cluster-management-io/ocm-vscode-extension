import { OcmResource } from '../../../src/data/loader'
import { PageSection, Panel, PanelMain, PanelMainBody} from '@patternfly/react-core';
import { DateFormat } from '../common/common';
import { ConditionTableComponent } from '../common/ConditionTable';
 

type clusterManagerProps = {
    clusterManagers: OcmResource[]
}

export default function ShowClusterManagers( Props: clusterManagerProps) {

    const row = Props.clusterManagers.map(clusterManager => {            
        return clusterManager.kr.status.conditions.map( (condition:any) => { 
            return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                    condition.message,
                    condition.reason,
                    condition.status
                ]      
            })
        })
            
    return (
        <PageSection>
        <section className="component-row">
            { Props.clusterManagers.length > 0 &&
                <Panel>
                    <PanelMain>
                    <PanelMainBody>
                        <ConditionTableComponent id='' title={"Cluster Manager"} rows={row[0]}   />
                        <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                    </PanelMainBody>
                    </PanelMain>
                </Panel>
            }
        </section>
        </PageSection>
    );
}
