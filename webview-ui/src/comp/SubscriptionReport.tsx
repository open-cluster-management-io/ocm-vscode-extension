import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowSubscriptionReport() {
    const [subscriptionReport, setSubscriptionReport] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
			if ('subscriptionReport' in event.data) {
				const subscriptionReportList = JSON.parse(event.data.subscriptionReport)
				setSubscriptionReport(subscriptionReportList)
			}
        });
    },[])

    return (
        <section className="component-row">
            { subscriptionReport.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Subscription Report</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr 1fr 1fr" aria-label='SubscriptionReport' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Subscription Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Namespace</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='3'>Report Type</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='4'>Results</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {subscriptionReport.map((report:any) => {
                            console.log(report)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1' >{report.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2' >{report.metadata.namespace}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='3'>{report.reportType} </VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='4'>{report.results.map( ( result:any )=> { return<p> - source: {result.source}, result: {result.result} </p>  })} </VSCodeDataGridCell>
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

export default ShowSubscriptionReport
