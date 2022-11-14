import * as connect from '../utils/connectToServer';
import * as vscode from 'vscode';
import { login } from './login';

export async function logout(): Promise<void> {

	const action = await vscode.window.showWarningMessage('Do you want to logout of cluster?', 'Logout', 'Cancel');
	if (action === 'Logout') {
		await connect.disconnect()
		.catch((err: string | Error) =>
			vscode.window.showErrorMessage(err instanceof Error ? err.name : err))
		.then(async (msg) => {
				await vscode.commands.executeCommand('setContext', 'isLoggedIn', false);
				const logoutInfo = await vscode.window.showInformationMessage(`${msg}. Do you want to login to a new cluster?`, 'Yes', 'No');
				if (logoutInfo === 'Yes') {
					return login();
				}
				return;
		});
	}
}
