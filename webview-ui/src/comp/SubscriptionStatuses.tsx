import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';
import { OcmResource } from '../../../src/data/loader'
import { Title } from '@patternfly/react-core';

export default function ShowSubscriptionStatuses() {
    let [subscriptionStatuses, setSubscriptionStatuses] = useState<OcmResource[]>([]);

	useEffect(() => {
        window.addEventListener("message", event => {
			if ('crsDistribution' in event.data.msg && 'SubscriptionStatus' === event.data.msg.crsDistribution.kind) {
				setSubscriptionStatuses(JSON.parse(event.data.msg.crsDistribution.crs));
			}
        });
    });

    return (
        <section className="component-row">
            { subscriptionStatuses.length >0 &&
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Subscription Status</Title>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr" aria-label='SubscriptionStatus' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Subscription Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Report Type</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {subscriptionStatuses.map(subscriptionStatus => {
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1' >{subscriptionStatus.kr.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{subscriptionStatus.kr.statuses.packages.map( ( pkg:any )=> { return<p> - kind: {pkg.kind}, lastUpdateTime: {pkg.lastUpdateTime}, name: {pkg.name}, namespace: {pkg.namespace}, phase: {pkg.phase} </p>  })} </VSCodeDataGridCell>
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
