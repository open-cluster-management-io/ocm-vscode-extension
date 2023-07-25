import { OcmResource } from '../../../src/data/loader'
import { Gallery,GalleryItem,Card,CardHeader, Title,CardBody } from '@patternfly/react-core';
import Graph from '../common/Graph';
import { kubeImage } from '../common/common';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';


type SubscriptionReportsProps = {
    subscriptionReports: OcmResource[],
    kubeImages: kubeImage[]
}

const SubscriptionReportsSummeryColumns: Object[] = [     
    {title: "Clusters" ,}, 
    {title: "Deployed",  },
    {title: "Failed" },
    {title: "InProgress" },
    {title: "PropagationFailed" }
]

export default function ShowSubscriptionReports(Props: SubscriptionReportsProps) {

    return (
        <section className="component-row">
            { Props.subscriptionReports.length >0 &&
                
                <>
                    <Title headingLevel='h2' size='md' style={{ marginTop: '40px' }}>Subscription Report</Title>
                    <Gallery className='ocm-gallery' hasGutter={true} >

                    {Props.subscriptionReports.map( subscriptionReport => { 
                            const rows = [[subscriptionReport.kr.summary.clusters,
                                            subscriptionReport.kr.summary.deployed,
                                            subscriptionReport.kr.summary.failed,
                                            subscriptionReport.kr.summary.inProgress,
                                            subscriptionReport.kr.summary.propagationFailed
                                        ]]
                                        
                            return <GalleryItem>
                                    <Card>
                                        <CardHeader>   
                                        <Title headingLevel='h3' size='md'>Subscription Name: {subscriptionReport.kr.metadata.name}</Title> 
                                        <Title headingLevel='h3' size='md'>Namespace: {subscriptionReport.kr.metadata.namespace?subscriptionReport.kr.metadata.namespace:'missing namespace'}</Title>                   
                                        </CardHeader>
                                        <CardBody>
                                            <p> Report Type:  {subscriptionReport.kr.reportType}</p>
                                                <Graph data={{  name: subscriptionReport.kr.metadata.name,
                                                                namespace: subscriptionReport.kr.metadata.namespace?subscriptionReport.kr.metadata.namespace:'missing namespace',
                                                                children:  subscriptionReport.kr.resources
                                                } } images={Props.kubeImages}/>
                                            <div style={{ borderTop: "1px solid #fff ", marginLeft: 10, marginRight: 10 }}></div>
                                            <Table gridBreakPoint= 'grid-md'  rows={rows} cells={SubscriptionReportsSummeryColumns} >
                                            <TableHeader/>
                                            <TableBody />   
                                            </Table>

                                        </CardBody>

                                        

                                    </Card>
                                    </GalleryItem>   
                                    })}
                    </Gallery>

                </>
            }
        </section>
    );
}
