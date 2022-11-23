import * as shell from './shell';

// connect to API server using credentials
export async function connectWithCredentials(clusterURL: string, username: string, password: string):  Promise<string> {
	console.debug('Connect to API server using credentials');
	return shell.executeShellCommand(`oc login -u ${username} -p ${password} --server=${clusterURL} --insecure-skip-tls-verify=true`);
}

// connect to API server using bearer token
export async function connectWithToken(clusterURL: string, token: string):  Promise<string> {
	console.debug('Connect to API server using bearer token');
	return shell.executeShellCommand(`oc login --token=${token} --server=${clusterURL} --insecure-skip-tls-verify=true`);
}

// disconnect from API server
export async function disconnect():  Promise<string> {
	console.debug('Disconnecting from API server');
	return shell.executeShellCommand('oc logout');
}

// check if a connection to an API server already exists
export async function requireLogin(): Promise<boolean> {
	return await shell.executeShellCommand('oc whoami')
	.then(() => false).catch(() => true);
}