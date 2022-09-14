import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowSubscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
            const subscriptionsList = JSON.parse(event.data.subscriptions)
            setSubscriptions(subscriptionsList)

         } );
    },[])

    return (
        <section className="component-row">
            { subscriptions.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Subscriptions</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr" aria-label='Subscription' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Subscription Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Status</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {subscriptions.map((subscription:any) => {
                            console.log(subscription)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{subscription.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{subscription.metadata.namespace} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{subscription.status.phase} </VSCodeDataGridCell>
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

export default ShowSubscriptions
