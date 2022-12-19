import * as createEnvironment from './commands/createEnvironment';
import * as newProject from './commands/newProject';
import * as verifyEnvironment from './commands/verifyEnvironment';
import * as vscode from 'vscode';
import { ConnectedContextsProvider } from './providers/connectedContexts';
import { ContextDetailsPanel } from './view/ContextDetailsPanel';

export function activate(extensionContext: vscode.ExtensionContext): void {
	let connectedContextsProvider = new ConnectedContextsProvider();
	extensionContext.subscriptions.push(
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
			'ocm-vscode-extension.showContextDetails',
			(selectedContext: string) => ContextDetailsPanel.render(extensionContext.extensionUri, selectedContext))
	);
}
