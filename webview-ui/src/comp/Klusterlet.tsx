import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,  } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ShowKlusterlet() {
    const [klusterlet, setKlusterlet] = useState([]);
    useEffect(() => {
        window.addEventListener("message", event => {
            const klusterletList = JSON.parse(event.data.klusterlet)
            setKlusterlet(klusterletList)

         } );
    },[])

    return (
        <section className="component-row">
            { klusterlet.length >0 &&
                <>
                    <h2 style={{ marginTop: '40px' }}>Klusterlet</h2>
                    <VSCodeDataGrid gridTemplateColumns="1fr 1fr" aria-label='Klusterlet' >
                        <VSCodeDataGridRow rowType="sticky-header">
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='1'>Klusterlet Name</VSCodeDataGridCell>
                                <VSCodeDataGridCell cellType='columnheader' gridColumn='2'>Conditions</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {klusterlet.map((kluster:any) => {
                            console.log(kluster)
                            return <VSCodeDataGridRow>
                                        <VSCodeDataGridCell gridColumn='1'>{kluster.metadata.name}</VSCodeDataGridCell>
                                        <VSCodeDataGridCell gridColumn='2'>{kluster.status.conditions.map( ( condition:any )=> { return<p> - lastTransitionTime: {condition.lastTransitionTime}, message: {condition.message}, reason: {condition.reason}, status: {condition.status}, type: {condition.type} </p>  })} </VSCodeDataGridCell>
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

export default ShowKlusterlet
