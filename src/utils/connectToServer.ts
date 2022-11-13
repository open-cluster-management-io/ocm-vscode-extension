import * as shell from './shell';

// Connect to API server
export function connectWithCredentials(clusterURL: String, username: String, password: String):  Promise<string> {
	console.debug(`Connect to API server using credentials`);
	return shell.executeShellCommand(`oc login -u ${username} -p ${password} --server=${clusterURL}`);
}

export function connectWithToken(clusterURL: String, token: String):  Promise<string> {
	console.debug(`Connect to API server using bearer token`);
	return shell.executeShellCommand(`oc login --token=${token} --server=${clusterURL}`);
}

export async function requireLogin(): Promise<boolean> {
	return await shell.executeShellCommand('oc whoami')
	.then(() => false).catch(() => true);
}