import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Title } from '@patternfly/react-core';

export default function ShowSubscriptionReports() {
    let [subscriptionReports, setSubscriptionReports] = useState<OcmResource[]>([]);

	useEffect(() => {
        window.addEventListener("message", event => {
			if ('crsDistribution' in event.data.msg && 'SubscriptionReport' === event.data.msg.crsDistribution.kind) {
				setSubscriptionReports(JSON.parse(event.data.msg.crsDistribution.crs));
			}
        });
    },[])

    return (
        <section className="component-row">
            { subscriptionReports.length >0 &&
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Subscription Report</Title>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='SubscriptionReport' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Subscription Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Report Type</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Results</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {subscriptionReports.map(subscriptionReport => {
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1' >{subscriptionReport.kr.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2' >{subscriptionReport.kr.metadata.namespace}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{subscriptionReport.kr.reportType} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='4'>{subscriptionReport.kr.results.map( ( result:any )=> { return<p> - source: {result.source}, result: {result.result} </p>  })} </VSCodeDataGridCell>
                                    </VSCodeDataGridRow>
                        } )
                        }
                    </VSCodeDataGrid>
                    <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>
    );
}
