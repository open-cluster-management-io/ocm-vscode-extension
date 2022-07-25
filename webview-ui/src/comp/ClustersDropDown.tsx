import { VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';

function ClusterDropDownList() {
    const [clustersDropDown, setClustersDropDown] = useState([]);
        
    useEffect(() => {
        const clusterOptions:any= []
        window.addEventListener("message", event => {
            const clusters = JSON.parse(event.data.clusters)            
            clusters.forEach((cluster:any) => {             
              clusterOptions.push( cluster.cluster.name)             
            });
            setClustersDropDown(clusterOptions)
            console.log(clustersDropDown)
        }); 
    },[])
    
    return ( 
        <>
        {clustersDropDown.map(option =>  {
            return <VSCodeOption label={option} value={option}> {option} </VSCodeOption>
            }
          )
        }  
        </> 
    );
}

export default ClusterDropDownList