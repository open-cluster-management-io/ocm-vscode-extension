import { OcmResource } from '../../../src/data/loader'
import { ConditionTableComponent } from '../common/ConditionTable';
import { DateFormat } from '../common/common';
import { OcmLabels } from '../common/Labels';

type klusterletProps = {
    klusterlets: OcmResource[]
}

export default function ShowKlusterlets(Props: klusterletProps) {



    const row = Props.klusterlets.map(klusterlet => {            
        return klusterlet.kr.status.conditions.map( (condition:any) => { 
            return [new Date(condition.lastTransitionTime).toLocaleString("en-US",DateFormat),
                    condition.message,
                    condition.reason,
                    condition.status
                ]      
            })
        })
    return (
        //TODO-Add panel 
        //TODO-add clusterlet dashboard 
        <section className="component-row">
            { Props.klusterlets.length > 0 &&
                <>
                        {Props.klusterlets.map(klusterlet => {
                            return  <>               
                                    <ConditionTableComponent id='' title={`${klusterlet.kr.metadata.name}` } rows={ row[0]}  /> 
                                    {klusterlet.kr.metadata.labels?<OcmLabels labels={klusterlet.kr.metadata.labels} />:null }
                                    </>
                        } )
                        }
                    <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>

    );
}
