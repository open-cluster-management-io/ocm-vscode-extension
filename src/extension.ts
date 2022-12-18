import * as createEnvironment from './commands/createEnvironment';
import * as newProject from './commands/newProject';
import * as verifyEnvironment from './commands/verifyEnvironment';
import * as vscode from 'vscode';
import { ClusterDetailsPanel } from './view/ClusterDetailsPanel';
import { ConnectedContextsProvider } from './providers/connectedContexts';

export function activate(context: vscode.ExtensionContext): void {
	let connectedContextsProvider = new ConnectedContextsProvider();
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'ocm-vscode-extension.ocmNewProject', () => newProject.create()),
		vscode.commands.registerCommand(
			'ocm-vscode-extension.verifyTools', () => verifyEnvironment.verifyTools()),
		vscode.commands.registerCommand(
			'ocm-vscode-extension.createLocalEnvironment', () => createEnvironment.createLocalEnvironment()),
		vscode.window.registerTreeDataProvider(
			'ocm-vscode-extension.connectedContextsView', connectedContextsProvider),
		vscode.commands.registerCommand(
			'ocm-vscode-extension.connectedContextsView.refresh', () => connectedContextsProvider.refresh()),
			vscode.commands.registerCommand(
			'ocm-vscode-extension.showClusterDetails', () => ClusterDetailsPanel.render(context.extensionUri))
	);
}
