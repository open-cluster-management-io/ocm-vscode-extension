/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/unbound-method */
import * as loader from '../data/loader';
import { Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { ConnectedContext } from '../data/builder';

const hubManagedClusterKind = 'ManagedCluster';
const hubKinds = ['ManifestWork', 'Placement', 'PlacementDecision', 'ManagedClusterSet', 'ManagedClusterAddOn', 'ClusterManager', 'SubscriptionReport'];
const spokeKlusterletKind = 'Klusterlet';
const spokeKinds = ['AppliedManifestWork', 'SubscriptionStatus'];

export class ConnectedContextWebProvider {
	public static currentPanel?: ConnectedContextWebProvider;
	private readonly panel: WebviewPanel;
	private disposables: Disposable[] = [];
	private load: loader.Load;

	public static async render(extensionUri: Uri, context: ConnectedContext | undefined): Promise<void> {
		// get the loader instance
		let load = loader.Load.getLoader();

		// when invoked from the tree view, the connectedContext will be provided
		// when invoked from the command palette we need to ask the user for the context
		let selectedContext = context ? context : await this.selectContext(load.getContexts());
		if (!selectedContext) {
			return;
		}

		// set the context to work with
		load.setContext(selectedContext);

		// verify the context's cluster is reachable
		try {
			await load.verifyReachability();
		} catch (e: any) {
			window.showErrorMessage(e);
			return;
		}

		// if a webview panel already exists dispose of it
		if (ConnectedContextWebProvider.currentPanel) {
			ConnectedContextWebProvider.currentPanel.panel.dispose();
		}

		// create and show a new web view panel
		let panel = window.createWebviewPanel(
			"contextDetails",
			"Context Details",
			ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			}
		);

		// instantiate the provider and set it as the current one for future disposing
		ConnectedContextWebProvider.currentPanel = new ConnectedContextWebProvider(panel, extensionUri, load, selectedContext);
	}

	// collect context from the user
	private static async selectContext(knownContexts: ConnectedContext[]): Promise<ConnectedContext | undefined> {
		let selectedContext = await window.showQuickPick(
			knownContexts.map(context => context.name),
			{
				title: 'Choose a context',
				ignoreFocusOut: true
			}
		) || undefined;

		if (selectedContext) {
			return knownContexts.filter(context => context.name === selectedContext)[0];
		}
		return undefined;
	}

	// generate the html and distribute message for the react module
	private constructor(panel: WebviewPanel, extensionUri: Uri, load: loader.Load, selectedContext: ConnectedContext) {
		this.panel = panel;
		this.panel.onDidDispose(this.dispose, null, this.disposables);
		this.panel.webview.html = this.generateHtml(this.panel.webview, extensionUri);
		this.load = load;
		this.distributeMessages(selectedContext);
	}

	public dispose():void {
		ConnectedContextWebProvider.currentPanel = undefined;
		this.panel.dispose();
		while (this.disposables.length) {
			let disposable = this.disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	private generateHtml(webview: Webview, extensionUri: Uri):string {
		// js from the react build output
		let scriptUri = webview.asWebviewUri(
			Uri.joinPath(extensionUri, "webview-ui", "build", "static", "js", "main.js"));

		return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<title>Context Details</title>
		</head>
		<body>
			<noscript>You need to enable JavaScript to run this app.</noscript>
			<div id="root"></div>
			<script src="${scriptUri}"></script>
		</body>
		</html>
		`;
	}

	// listeners for messages posted here resides in the components package in the react module
	private async distributeMessages(selectedContext: ConnectedContext): Promise<void> {
		// retrieve all managedclusters and klusterlets resources
		let managedClusters = await this.load.getCrs(hubManagedClusterKind);
		let klusterlets = await this.load.getCrs(spokeKlusterletKind);

		// populate the SelectedContext ui component
		this.panel.webview.postMessage({selectedContext: JSON.stringify(selectedContext)});

		let crsDistributions: Promise<void>[] = [];

		// a cluster with ManagedCluster resources, acts as a hub cluster
		if (managedClusters.length > 0 ){
			// populate the ManagedClusters ui component
			crsDistributions.push(this.distributeCrs(hubManagedClusterKind, managedClusters));
			// populate common crs used by the hub cluster
			hubKinds.forEach(kind => crsDistributions.push(this.distributeCrsForKind(kind)));
		}

		// a cluster with Klusterlet resources, acts as a spoke cluster
		if (klusterlets.length > 0 ){
			// populate the Klusterlets ui component
			crsDistributions.push(this.distributeCrs(spokeKlusterletKind, klusterlets));
			// populate common crs used by the spoke cluster
			spokeKinds.forEach(kind => crsDistributions.push(this.distributeCrsForKind(kind)));
		}

		await Promise.allSettled(crsDistributions);
	}

	private async distributeCrsForKind(kind: string): Promise<void> {
		let crs = await this.load.getCrs(kind);
		await this.distributeCrs(kind, crs);
	}

	private async distributeCrs(kind: string, crs: loader.OcmResource[]): Promise<void> {
		if (crs.length > 0) {
			this.panel.webview.postMessage({ crsDistribution: { kind: kind, crs: JSON.stringify(crs)}});
		}
	}
}
