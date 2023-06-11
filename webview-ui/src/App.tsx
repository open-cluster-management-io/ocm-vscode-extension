import React from "react";
import ShowSelectedContext from "./comp/SelectedContext";
import ShowKlusterlets from "./comp/Klusterlets";
import ShowAppliedManifestWorks from "./comp/AppliedManifestWorks";
import ShowSubscriptionStatuses from "./comp/SubscriptionStatuses";
import OcmHeader from "./comp/Header";
import { Page, PageSection } from "@patternfly/react-core";
import ClusterManagerPage from "./parent/clusterManagerParent";



export default class App extends React.Component {
	


	render(): JSX.Element {
		return (
		<Page
			mainContainerId='primary-app-container'
			header= { <OcmHeader /> } >
			<PageSection style={{ color: "black" }}>
				<ShowSelectedContext/>
				<ClusterManagerPage/>				

				<ShowKlusterlets/>
				<ShowAppliedManifestWorks/>
				<ShowSubscriptionStatuses/>	
			</PageSection>	
		</Page>	
		)
	}
}
