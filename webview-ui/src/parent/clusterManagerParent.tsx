import { useState, useEffect, useRef} from 'react';
import { OcmResource } from '../../../src/data/loader'
import { kubeImage } from '../common/common';


import ShowClusterManagers from '../comp/ClusterManagers';
import ShowManagedClusters from '../comp/ManagedClusters';
import ShowManifestWorks from '../comp/ManifestWorks';
import ShowSubscriptionReports from '../comp/SubscriptionReports';
import ShowPlacements from '../comp/Placements';
import ShowManagedClusterSets from '../comp/ManagedClusterSets';
import ShowManagedClusterAddons from '../comp/ManagedClusterAddons';
import ClusterManagerDashboard,{ClusterManagerData} from '../comp/ClusterManagerDashboard';
import { Spinner } from '@patternfly/react-core';

export default function ClusterManagerPage(){
    let [kubeImages, setKubeImages] = useState<kubeImage[]>([]);


    let dataRequests = useRef(0);
    let clusterManagersRef = useRef<OcmResource[]>([]);
    let managedClustersRef= useRef<OcmResource[]>([]);
    let manifestWorksRef = useRef<OcmResource[]>([]);
    let managedClusterSetsRef = useRef<OcmResource[]>([]);
    let placementsRef = useRef<OcmResource[]>([]);
    let kubeImagesRef = useRef<kubeImage[]>([]);
    let subscriptionReportsRef = useRef<OcmResource[]>([]);
    let clusterManagersDataRef = useRef<ClusterManagerData>(Object());
    let managedClusterAddOnRef = useRef<OcmResource[]>([]);

    useEffect(() => {
        dataRequests.current += 1

        window.addEventListener("message", event => { 
            if ('crsDistribution' in event.data.msg) { 
                dataRequests.current += 1
                let crsData =   JSON.parse(event.data.msg.crsDistribution.crs)     
                switch (event.data.msg.crsDistribution.kind) { 
                    case 'ClusterManager' :
                        clusterManagersRef.current = crsData;
                        break;
                    case 'ManagedCluster':
                        if (managedClustersRef.current.length !== crsData.length) {
                            managedClustersRef.current = crsData;
                        }
                        break;
                    case 'ManagedClusterSet':
                        if (managedClusterSetsRef.current.length !== crsData.length) {
                            managedClusterSetsRef.current = crsData ;
                        }
                        break;    
                    case 'ManifestWork':
                        if (manifestWorksRef.current !== crsData.length) {
                            manifestWorksRef.current = crsData;                        
                        }
                        break;
                    case 'Placement':
                        if (placementsRef.current !== crsData.length) {
                            placementsRef.current = crsData;                       
                        }
                        break;    
                    case 'SubscriptionReport' :
                        if (subscriptionReportsRef.current !== crsData.length) {
                            subscriptionReportsRef.current = crsData;                     
                        }
                        break;
                    case 'ManagedClusterAddOn' :
                        if (managedClusterAddOnRef.current !== crsData.length) {
                            managedClusterAddOnRef.current = crsData;                     
                        }
                        break;           
                }

                if (event.data.images) { 
                    if (event.data.images) {
                    //TODO move this logic to Graph 
                    kubeImagesRef.current = event.data.images
                    //setting the image state re-renders the component 
                    setKubeImages(kubeImagesRef.current)                                
                    }   
                }
            }
		});

        let newClusterManagersData: ClusterManagerData ={
            clusterManagers : clusterManagersRef.current,
            managedClusters : managedClustersRef.current,
            placements : placementsRef.current,
            manifestWorks : manifestWorksRef.current,
            managedClusterSets : managedClusterSetsRef.current,
            subscriptionReports : subscriptionReportsRef.current,
            kubeImages : kubeImagesRef.current
        }
        clusterManagersDataRef.current = newClusterManagersData
    },[kubeImages]);

    if(dataRequests.current > 15 ){    
            return (<>  {console.log(dataRequests)}
                        <ClusterManagerDashboard data={clusterManagersDataRef.current}/> 
                        <ShowClusterManagers clusterManagers={clusterManagersRef.current} />
                        <ShowManagedClusters managedClusters={managedClustersRef.current} />
                        <ShowManifestWorks manifestWorks={manifestWorksRef.current} kubeImages={kubeImagesRef.current}/> 
                        <ShowSubscriptionReports subscriptionReports={subscriptionReportsRef.current}  kubeImages={kubeImagesRef.current}/>
                        <ShowPlacements placements={placementsRef.current}/>
                        <ShowManagedClusterSets managedClusterSets={managedClusterSetsRef.current}/>
                        <ShowManagedClusterAddons managedClusterAddons={managedClusterAddOnRef.current}/>
            </>
            )
        }

        else { 
            return(
            <Spinner isSVG size='xl'/>
        )
    }
    
}