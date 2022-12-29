import * as builder from './builder';
import * as k8s from '@kubernetes/client-node';

const OCM_GROUP = 'open-cluster-management';

export class OcmResource {
	readonly crd: OcmResourceDefinition;
	readonly name: string;
	readonly namespace?: string;

	constructor(crd: OcmResourceDefinition, name: string, namespace?: string) {
		this.crd = crd;
		this.name = name;
		this.namespace = namespace;
	}
}

export class OcmResourceDefinition {
	readonly krd: k8s.V1CustomResourceDefinition;
	readonly name: string;
	readonly plural: string;
	readonly namespaced: boolean;
	readonly kind: string;
	readonly version: string;
	readonly group: string;

	constructor(krd: k8s.V1CustomResourceDefinition) {
		this.krd = krd;
		this.name = krd.metadata?.name as string;
		this.plural = krd.spec.names.plural;
		this.namespaced = krd.spec.scope === 'Namespaced';
		this.kind = krd.spec.names.kind;
		this.version = krd.status?.storedVersions?.at(0) as string;
		this.group = krd.spec.group;
	}
}

export class Load {
	private static loader: Load;
	private config: k8s.KubeConfig;
	private build: builder.Build;
	private extApi?: k8s.ApiextensionsV1Api;
	private objApi?: k8s.CustomObjectsApi;
	private coreApi?: k8s.CoreV1Api;

	static getLoader(): Load {
		if (!Load.loader) {
			let config = new k8s.KubeConfig();
			let build = new builder.Build(config);
			Load.loader = new Load(config, build);
		}
		return Load.loader;
	}

	private constructor(config: k8s.KubeConfig, build: builder.Build) {
		this.config = config;
		this.build = build;
		this.refresh();
	}

	refresh(): void {
		this.config.loadFromDefault();
		this.refreshClients();
	}

	private refreshClients(): void {
		this.extApi = this.config.makeApiClient(k8s.ApiextensionsV1Api);
		this.objApi = this.config.makeApiClient(k8s.CustomObjectsApi);
		this.coreApi = this.config.makeApiClient(k8s.CoreV1Api);
	}

	setContext(context: string | builder.ConnectedContext): void {
		this.config.setCurrentContext(typeof context === 'string' ? context : context.name);
		this.refreshClients();
	}

	getContext(): builder.ConnectedContext | undefined {
		return this.build.context(this.config.currentContext);
	}

	getContexts(): builder.ConnectedContext[] {
		return this.config.contexts
			.map(kontext => this.build.context(kontext))
			.filter((context): context is builder.ConnectedContext => !!context);
	}

	getCluster(name: string): builder.ConnectedCluster | undefined {
		return this.build.cluster(name);
	}

	getClusters(): builder.ConnectedCluster[] {
		return this.config.clusters
			.map(kluster => this.build.cluster(kluster))
			.filter((cluster): cluster is builder.ConnectedCluster => !!cluster);
	}

	getUser(name: string): builder.ConnectedUser | undefined {
		return this.build.user(name);
	}

	getUsers(): builder.ConnectedUser[] {
		return this.config.users
			.map(kuser => this.build.user(kuser))
			.filter((user): user is builder.ConnectedUser => !!user);
	}

	async getCrd(kind: string): Promise<OcmResourceDefinition | undefined> {
		return (await this.getCrds()).filter(c => c.kind === kind)[0];
	}

	async getCrds(): Promise<OcmResourceDefinition[]> {
		let retCrds: OcmResourceDefinition[] = [];
		let response = await this.extApi?.listCustomResourceDefinition();
		if (response && response.response.statusCode === 200) {
			retCrds.push(...response.body.items.filter(item => item.spec.group.includes(OCM_GROUP)).map(crd => new OcmResourceDefinition(crd)));
		}
		return retCrds;
	}

	async getCrs(item: string | OcmResourceDefinition): Promise<OcmResource[]> {
		let retRes: OcmResource[] = [];
		let crd = typeof item === 'string' ? await this.getCrd(item) : item;
		if (crd) {
			let crs = crd.namespaced ? await this.getNamespacedCrs(crd) : await this.getClusterCrs(crd);
			retRes.push(...crs);
		}
		return retRes;
	}

	private async getClusterCrs(crd: OcmResourceDefinition): Promise<OcmResource[]> {
		let retRes: OcmResource[] = [];
		let response = await this.objApi?.listClusterCustomObject(crd.group, crd.version, crd.plural);
		if (response && response.response.statusCode === 200) {
			// @ts-ignore
			retRes.push(...response.body.items.map(item => new OcmResource(crd, item.metadata.name)));
		}
		return retRes;
	}

	private async getNamespacedCrs(crd: OcmResourceDefinition): Promise<OcmResource[]> {
		let retRes: OcmResource[] = [];
		let nsResponse = await this.coreApi?.listNamespace();
		if (nsResponse && nsResponse.response.statusCode === 200) {
			nsResponse.body.items.forEach(async nsitem => {
				let namespace = nsitem.metadata?.name as string;
				let objResponse = await this.objApi?.listNamespacedCustomObject(crd.group, crd.version, namespace, crd.plural);
				if (objResponse && objResponse.response.statusCode === 200) {
					// @ts-ignore
					retRes.push(...objResponse.body.items.map(item => new OcmResource(crd, item.metadata.name, namespace)));
				}
			});
		}
		return retRes;
	}
}
