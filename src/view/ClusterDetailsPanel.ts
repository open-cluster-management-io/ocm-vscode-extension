/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/unbound-method */

import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import KubeDataLoader  from '../../src/utils/kube';
import { getUri } from "../utils/getUri";



/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class ClusterDetailsPanel {
  public static currentPanel: ClusterDetailsPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private _kubeDataLoader:KubeDataLoader;
  /**
   * The ClusterDetailsPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(this.dispose, null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Load cluster details 
    this._kubeDataLoader = new KubeDataLoader();
    const _clusters =  this._kubeDataLoader.loadConnectedClusters();
    this._panel.webview.postMessage({"clusters":JSON.stringify(_clusters)}); 

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);

  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri):void {
    if (ClusterDetailsPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ClusterDetailsPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "clusterDetails",
        // Panel title
        "Cluster Details",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
        }
      );

      ClusterDetailsPanel.currentPanel = new ClusterDetailsPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose():void {
    ClusterDetailsPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri):string {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "static",
      "css",
      "main.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "static",
      "js",
      "main.js",
    ]);

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Cluster Details</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
   _setWebviewMessageListener(webview: Webview):void {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const text = message.text;
        let managedClusters,manifestWorks;

        switch (command) {
          
          // user selected a cluster 
          case "selectedCluster": {
            let selectedCluster = message.text;
            //reset 
            this._panel.webview.postMessage({"managedClusters":JSON.stringify([])});
            managedClusters = await this._kubeDataLoader.loadManagedCluster(selectedCluster);
            // if this is hub cluster - show managed clusters
            if (managedClusters.length !== 0 ){
                  this._panel.webview.postMessage({"managedClusters":JSON.stringify(managedClusters)}); 
                  // get manifest work 
                  manifestWorks = this._kubeDataLoader.getManifestWork(selectedCluster,managedClusters);
                  this._panel.webview.postMessage({"manifestWorks":JSON.stringify(manifestWorks)});
            } else {
                console.log("in else");
                let appliedManifestWork = this._kubeDataLoader.getAppliedManifestWork(selectedCluster);
                console.log(appliedManifestWork);

            }
              
          }
        }
      },
      undefined,
      this._disposables
    );
  }
}
