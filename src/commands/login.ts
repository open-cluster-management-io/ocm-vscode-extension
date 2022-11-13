import * as connect from '../utils/connectToServer';
import KubeDataLoader from '../utils/kube';
import * as vscode from 'vscode';

async function requestLoginConfirmation(): Promise<string> {
	
	if (!await connect.requireLogin()) {
		const cluster = new KubeDataLoader().getCurrentServer();
		return await vscode.window.showInformationMessage(`You are already logged into ${cluster} cluster. Do you want to login to a different cluster?`, 'Yes', 'No') || 'No';
	}
	return 'Yes';
}

async function getUrl(): Promise<string | undefined> {
	
	const createUrl: vscode.QuickPickItem = { label: '$(plus) Provide new URL...'};
	const clusterItems = new KubeDataLoader().getServers();
	const choice = await vscode.window.showQuickPick(
		[createUrl, ...clusterItems],
		{
			title: 'Provide Cluster URL to connect',
			ignoreFocusOut: true,
		});
	if (!choice) return;
	return (choice.label === createUrl.label) ?
		vscode.window.showInputBox({
			title: 'Provide new Cluster URL to connect',
			ignoreFocusOut: true,
		}) || '' : choice.label;
}

async function credentialsLogin(clusterURL: string): Promise<void> {
	
	// get username
	const addUser: vscode.QuickPickItem = { label: '$(plus) Add new user...'};
	const users = new KubeDataLoader().getClusterUsers(clusterURL);
	const choice = await vscode.window.showQuickPick(
		[addUser, ...users],
		{
			title: 'Provide Username for basic authentication to the API server',
			ignoreFocusOut: true,
		});
	if (!choice) return;

	let username: string;
	if (choice.label === addUser.label) {
		username = await vscode.window.showInputBox({
			title: 'Provide new Username for basic authentication to the API server',
			ignoreFocusOut: true,
		}) || '';
	} else {
		username = choice.label;
	}

	if (!username) return;

	// get password
	let password = await vscode.window.showInputBox({
		title: 'Provide Password for basic authentication to the API server',
		ignoreFocusOut: true,
		password: true,
	}) || '';

	if (!password) return;

	// login to API server using credentials
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `Login to the cluster: ${clusterURL}`,
			cancellable: false,
		},
		async (progress) => {
			progress.report({
				increment: 100,
				message: `Logging in using credentials`,
			});
			await connect.connectWithCredentials(clusterURL, username, password)
			.then((msg: string) => vscode.window.showInformationMessage(msg))
			.catch((err: string | Error) =>
				vscode.window.showErrorMessage(err instanceof Error ? err.name : err));
		}
	);
}

async function tokenLogin(clusterURL: string): Promise<void> {
	
	// get bearer token
	let token = await vscode.window.showInputBox({
		title: 'Provide Bearer token for authentication to the API server',
		ignoreFocusOut: true,
		password: true,
	}) || '';

	if (!token) return;

	// login to API server using bearer token
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `Login to the cluster: ${clusterURL}`,
			cancellable: false,
		},
		async (progress) => {
			progress.report({
				increment: 100,
				message: `Logging in using bearer token`,
			});
			// Connect to API server using bearer token
			await connect.connectWithToken(clusterURL, token)
			.then((msg: string) => vscode.window.showInformationMessage(msg))
			.catch((err: string | Error) =>
				vscode.window.showErrorMessage(err instanceof Error ? err.name : err));
		});
}

export async function login(): Promise<void> {

	// check for an existing connection to an API server
	const response = await requestLoginConfirmation();
    if (response !== 'Yes') return;

	// get target cluster URL
	let clusterURL = await getUrl();
	if (!clusterURL) return;

	//define login actions
	const loginActions = [
		{
			label: 'Credentials',
			description: 'Log in to the given server using credentials',
		},
		{
			label: 'Token',
			description: 'Log in to the given server using bearer token',
		}
	];

	// select login action
	const selectedLoginAction = await vscode.window.showQuickPick(
		loginActions, 
		{
			title: 'Select a way to log in to the cluster', 
			ignoreFocusOut: true,
		});
	if (!selectedLoginAction) return;

	// login using action
	selectedLoginAction.label === 'Credentials' ? await credentialsLogin(clusterURL) : await tokenLogin(clusterURL);
}