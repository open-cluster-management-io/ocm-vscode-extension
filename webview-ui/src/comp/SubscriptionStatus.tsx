import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowSubscriptionStatus() {
    const [subscriptionStatus, setSubscriptionStatus] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
			if ('subscriptionStatus' in event.data) {
				const subscriptionStatusList = JSON.parse(event.data.subscriptionStatus)
				setSubscriptionStatus(subscriptionStatusList)
			}
        });
    },[])

    return (
        <section className="component-row">
            { subscriptionStatus.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Subscription Status</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr" aria-label='SubscriptionStatus' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Subscription Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Report Type</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {subscriptionStatus.map((status:any) => {
                            console.log(status)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1' >{status.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{status.statuses.packages.map( ( pkg:any )=> { return<p> - kind: {pkg.kind}, lastUpdateTime: {pkg.lastUpdateTime}, name: {pkg.name}, namespace: {pkg.namespace}, phase: {pkg.phase} </p>  })} </VSCodeDataGridCell>
                                    </VSCodeDataGridRow>
                        } )
                        }
                    </VSCodeDataGrid>
                    <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                </>
            }
        </section>
    )

}

export default ShowSubscriptionStatus
