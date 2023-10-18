/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as distributor from '../data/distributor';
import * as loader from '../data/loader';
import { Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { ConnectedContext } from '../data/builder';
import { getKubeImagesFileList } from '../utils/filesystem';
import path = require('path');

// class used for management and encapsulation of the webview panel
export class ConnectedContextWebProvider {
	public static currentPanel?: ConnectedContextWebProvider;
	private readonly panel: WebviewPanel;
	private disposables: Disposable[] = [];

	// static function used for rendering a web view
	public static async render(extensionUri: Uri, context: ConnectedContext | undefined  ): Promise<void> {
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
		ConnectedContextWebProvider.currentPanel = new ConnectedContextWebProvider(panel, extensionUri, selectedContext);
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
	private constructor(panel: WebviewPanel, extensionUri: Uri, selectedContext: ConnectedContext) {
		this.panel = panel;

		// eslint-disable-next-line @typescript-eslint/unbound-method
		this.panel.onDidDispose(this.dispose, null, this.disposables);
		this.panel.webview.html = this.generateHtml(this.panel.webview, extensionUri);

		//add images to postMessage
		let images: Object[] = []; 

		let ocmLogo = this.panel.webview.asWebviewUri( Uri.joinPath(extensionUri, 'styles', 'ocm.png'));
		let ocmLogoUri = this.transformToURI(ocmLogo);
				images.push({
			name: "ocmLogo",
			uri: ocmLogoUri
		});
		
        this.getKubeResourcesIcons(extensionUri, images).then(res => {
			images = res;			
		});

		distributor.distributeMessages(selectedContext, (msg: any) => this.panel.webview.postMessage( {	msg:msg , 
																										images: images
																									}));
	}

	private transformToURI(uri:Uri): String {
		return `${uri.scheme}://${uri.authority}${uri.path}`;
	}

	private async getKubeResourcesIcons(extensionUri: Uri, images: Object[]): Promise<Object[]> {

		let kubeImages = await getKubeImagesFileList(`../../../styles/kube-resources/svg/resources/labeled`);
		kubeImages.map ( image => { 
			let imageTmp = this.panel.webview.asWebviewUri( Uri.joinPath(extensionUri, image.uri));
			image.uri = `${imageTmp.scheme}://${imageTmp.authority}${image.uri}`; 
		});
		return [...kubeImages, ...images];
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
		// PatternFly css  
		let cssUri = webview.asWebviewUri(
			Uri.joinPath(extensionUri, "node_modules", "@patternfly", "patternfly", "patternfly.css"));

		let reactCoreUri = webview.asWebviewUri(
			Uri.joinPath(extensionUri,  "node_modules", "@patternfly", "react-core", "dist" , "styles" ,"base.css"));
		
		let customCssUri = webview.asWebviewUri(
			Uri.joinPath(extensionUri,  "styles", "custom.css"));

		return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<link rel="stylesheet" href="${cssUri}">
			<link rel="stylesheet" href="${customCssUri}">
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
}
