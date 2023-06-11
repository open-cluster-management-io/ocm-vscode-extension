import React from "react";
import ShowSelectedContext from "./comp/SelectedContext";
import ShowManagedClusters from "./comp/ManagedClusters";
import ShowManifestWorks from "./comp/ManifestWorks";
import ShowPlacements from "./comp/Placements";
import ShowManagedClusterSets from "./comp/ManagedClusterSets";
import ShowManagedClusterAddons from "./comp/ManagedClusterAddons";
import ShowClusterManagers from "./comp/ClusterManagers";
import ShowSubscriptionReports from "./comp/SubscriptionReports";
import ShowKlusterlets from "./comp/Klusterlets";
import ShowAppliedManifestWorks from "./comp/AppliedManifestWorks";
import ShowSubscriptionStatuses from "./comp/SubscriptionStatuses";
import OcmHeader from "./comp/Header";
import { Page, PageSection } from "@patternfly/react-core";



export default class App extends React.Component {
	


	render(): JSX.Element {
		return (
		<Page
			mainContainerId='primary-app-container'
			header= { <OcmHeader /> } >
			<PageSection style={{ color: "black" }}>
				<ShowSelectedContext/>
				<ShowClusterManagers/>
				<ShowManagedClusters/>
				<ShowManifestWorks/>
				<ShowSubscriptionReports/>
				<ShowPlacements/>
				<ShowManagedClusterSets/>
				<ShowManagedClusterAddons/>
				<ShowKlusterlets/>
				<ShowAppliedManifestWorks/>
				<ShowSubscriptionStatuses/>	
			</PageSection>	
		</Page>	
		)
	}
}
