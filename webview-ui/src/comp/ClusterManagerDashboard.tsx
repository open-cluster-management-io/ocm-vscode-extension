import { Panel, PanelMain, PanelMainBody } from "@patternfly/react-core"
import { OcmResource } from "../../../src/data/loader"
import { kubeImage } from "../common/common"


export type ClusterManagerData = {
    clusterManagers: OcmResource[],
    kubeImages: kubeImage[],
    placements:OcmResource[],
    managedClusterSets: OcmResource[],
    manifestWorks:OcmResource[],
    managedClusters:OcmResource[],
    subscriptionReports:OcmResource[],
}


type ClusterManagerDashboardProps = {
    data:ClusterManagerData
}

export default function ClusterManagerDashboard( Props: ClusterManagerDashboardProps) {

    return(  
        <Panel>
            { (Props.data.clusterManagers && Props.data.clusterManagers.length > 0) &&
        <PanelMain>
        <PanelMainBody>
            { Props.data.clusterManagers?<p> Hub Clusters: {Props.data.clusterManagers.length} </p>:null}
            { Props.data.managedClusters?<p> Managed Clusters: {Props.data.managedClusters.length} </p>:null}
            { Props.data.managedClusterSets?<p> managedClusterSets: {Props.data.managedClusterSets.length} </p>:null}   
            { Props.data.placements?<p> Placements: {Props.data.placements.length} </p>:null} 
        </PanelMainBody>
        </PanelMain>
    }
    </Panel>
    )
}