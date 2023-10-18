import React from "react";
import ShowSelectedContext from "./comp/SelectedContext";

import OcmHeader from "./comp/Header";
import { Page, PageSection } from "@patternfly/react-core";
import ClusterManagerPage from "./parent/clusterManagerParent";
import ManagedClusterPage from "./parent/managedClusterParent";



export default class App extends React.Component {
	


	render(): JSX.Element {
		return (
		<Page
			mainContainerId='primary-app-container'
			header= { <OcmHeader /> } >
			<PageSection style={{ color: "black" }}>
				<ShowSelectedContext/>
				<ClusterManagerPage/>
				<ManagedClusterPage/>				
			</PageSection>	
		</Page>	
		)
	}
}
