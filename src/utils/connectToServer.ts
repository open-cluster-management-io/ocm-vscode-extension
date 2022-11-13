import * as shell from './shell';

// connect to API server using credentials
export function connectWithCredentials(clusterURL: String, username: String, password: String):  Promise<string> {
	console.debug(`Connect to API server using credentials`);
	return shell.executeShellCommand(`oc login -u ${username} -p ${password} --server=${clusterURL}`);
}

// connect to API server using bearer token
export function connectWithToken(clusterURL: String, token: String):  Promise<string> {
	console.debug(`Connect to API server using bearer token`);
	return shell.executeShellCommand(`oc login --token=${token} --server=${clusterURL}`);
}

// check if a connection to an API server already exists
export async function requireLogin(): Promise<boolean> {
	return await shell.executeShellCommand('oc whoami')
	.then(() => false).catch(() => true);
}