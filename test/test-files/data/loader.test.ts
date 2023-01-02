/* eslint-disable @typescript-eslint/unbound-method */
import * as builder from '../../../src/data/builder';
import * as chaiAsPromised from 'chai-as-promised';
import * as k8s from '@kubernetes/client-node';
import * as loader from '../../../src/data/loader';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { expect, use } from 'chai';
import { beforeEach } from 'mocha';

use(chaiAsPromised);
use(sinonChai);

suite('Load data using the data loader', () => {
	let configMock: k8s.KubeConfig;
	let buildMock: builder.Build;
	let loadSut: loader.Load;

	let fakeConnectedUser: builder.ConnectedUser = {
		kuser: {
			name: 'fakeUser'
		},
		name: 'fakeUser',
	};

	let fakeConnectedCluster: builder.ConnectedCluster = {
		kluster: {
			name: 'fakeCluster',
			server: 'https://my-fake-server:6443',
			skipTLSVerify: false
		},
		name: 'fakeCluster',
		server: 'https://my-fake-server:6443',
	};

	let fakeConnectedContext: builder.ConnectedContext = {
		kontext: {
			name: 'fakeContext',
			cluster: ' fakeCluster',
			user: 'fakeUser'
		},
		name: 'fakeContext',
		cluster: fakeConnectedCluster,
		user: fakeConnectedUser
	};

	let fakeK8SNamespacedCrd: k8s.V1CustomResourceDefinition = {
		metadata: {
			name: 'fake-crd1'
		},
		spec: {
			names: {
				kind: 'fake-crd1-kind',
				plural: 'fake-crd1s'
			},
			scope: 'Namespaced',
			group: 'open-cluster-management',
			versions: []
		},
		status: {
			storedVersions: [
				'1.1.1'
			]
		}
	};

	let fakeK8SNamespacedCr = {
		metadata: {
			name: 'fake-crd1'
		}
	};

	let fakeK8SClusteredCrd: k8s.V1CustomResourceDefinition = {
		metadata: {
			name: 'fake-crd2'
		},
		spec: {
			names: {
				kind: 'fake-crd2-kind',
				plural: 'fake-crd2s'
			},
			scope: 'Clustered',
			group: 'open-cluster-management',
			versions: []
		},
		status: {
			storedVersions: [
				'2.2.2'
			]
		}
	};

	let fakeK8SClusteredCr = {
		metadata: {
			name: 'fake-crd2'
		}
	};

	let fakeOcmClusteredCrd: loader.OcmResourceDefinition = {
		krd: fakeK8SClusteredCrd,
		name: 'fake-crd2',
		plural: 'fake-crd2s',
		namespaced: false,
		kind: 'fake-crd2-kind',
		version: '2.2.2',
		group: 'open-cluster-management'
	};

	let fakeOcmNamespacedCrd: loader.OcmResourceDefinition = {
		krd: fakeK8SNamespacedCrd,
		name: 'fake-crd1',
		plural: 'fake-crd1s',
		namespaced: true,
		kind: 'fake-crd1-kind',
		version: '1.1.1',
		group: 'open-cluster-management'
	};

	let fakeOcmClusteredCr = new loader.OcmResource(
		fakeK8SClusteredCr,
		fakeOcmClusteredCrd,
		undefined
	);

	let fakeNamespace: k8s.V1Namespace = {
		metadata: {
			name: 'my-fake-app-namespace'
		}
	};

	let fakeOcmNamespacedCr = new loader.OcmResource(
		fakeK8SNamespacedCr,
		fakeOcmNamespacedCrd,
		fakeNamespace.metadata?.name
	);

	beforeEach(() => {
		// inject values to the stubbed k8s config
		configMock = sinon.createStubInstance(k8s.KubeConfig, {
			makeApiClient: sinon.stub()
		});
		configMock.currentContext = fakeConnectedContext.name;
		configMock.contexts = [fakeConnectedContext.kontext];
		configMock.clusters = [fakeConnectedCluster.kluster];
		configMock.users = [fakeConnectedUser.kuser];
		// mock our builder short-circuiting the building methods
		buildMock = sinon.createStubInstance(builder.Build, {
			context: fakeConnectedContext,
			cluster: fakeConnectedCluster,
			user: fakeConnectedUser,
		});
		// @ts-ignore
		loadSut = new loader.Load(configMock, buildMock);
	});

	test('Instantiating the loader should load the default config and refresh the apis', () => {
		verifyApiRefresh(true);
	});

	test('Hitting the refresh on the loader should load the default config and refresh the apis', () => {
		// @ts-ignore
		configMock.loadFromDefault.reset();
		// @ts-ignore
		configMock.makeApiClient.reset();
		loadSut.refresh();
		verifyApiRefresh(true);
	});

	[
		{
			title: 'Setting a connected context should invoke k8s config and refresh the apis',
			argument: fakeConnectedContext
		},
		{
			title: 'Setting a string context should invoke k8s config and refresh the apis',
			argument: fakeConnectedContext.name
		}
	].forEach(value => {
		test(value.title, () => {
			// @ts-ignore
			configMock.loadFromDefault.reset();
			// @ts-ignore
			configMock.makeApiClient.reset();
			loadSut.setContext(value.argument);
			expect(configMock.setCurrentContext).to.have.been.calledOnceWith('fakeContext');
			// @ts-ignore
			configMock.setCurrentContext.reset();
			verifyApiRefresh();
		});
	});

	test('Successfully retrieving the current connected context', () => {
		expect(loadSut.getContext()).to.deep.equal(fakeConnectedContext);
	});

	test('Successfully retrieving all connected contexts', () => {
		let contexts = loadSut.getContexts();
		expect(contexts).to.have.lengthOf(1);
		expect(contexts[0]).to.deep.equal(fakeConnectedContext);
	});

	test('Successfully retrieving a connected user', () => {
		expect(loadSut.getUser(fakeConnectedUser.name)).to.deep.equal(fakeConnectedUser);
	});

	test('Successfully retrieving all connected users', () => {
		let users = loadSut.getUsers();
		expect(users).to.have.lengthOf(1);
		expect(users[0]).to.deep.equal(fakeConnectedUser);
	});

	test('Successfully retrieving a connected cluster', () => {
		expect(loadSut.getCluster(fakeConnectedCluster.name)).to.deep.equal(fakeConnectedCluster);
	});

	test('Successfully retrieving all connected clusters', () => {
		let clusters = loadSut.getClusters();
		expect(clusters).to.have.lengthOf(1);
		expect(clusters[0]).to.deep.equal(fakeConnectedCluster);
	});

	test('Successfully verify cluster reachability', () => {
		// @ts-ignore
		loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
			// @ts-ignore
			listNode: Promise.resolve({
				response: {
					statusCode: 200
				}
			})
		});
		return expect(loadSut.verifyReachability()).to.eventually.be.fulfilled;
	});

	[
		{
			prefix: 'Failed response',
			stub: Promise.resolve({
				response: {
					statusCode: 500
				}
			}),
			message: 'Cluster is not accessible, 500'
		},
		{
			prefix: 'No response',
			stub: Promise.resolve(undefined),
			message: 'Cluster is not accessible'
		},
		{
			prefix: 'Error thrown',
			stub: sinon.stub().throwsException('fake reason'),
			message: 'Cluster is not accessible, fake reason'
		}
	].forEach(testCase => {
		test(`${testCase.prefix} from the api should fail reachability verification`, () => {
			// @ts-ignore
			loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
				// @ts-ignore
				listNode: testCase.stub
			});
			return expect(loadSut.verifyReachability()).to.eventually.be.rejectedWith(testCase.message);
		});
	});

	function verifyApiRefresh(includeLoad = false): void {
		if (includeLoad) {
			expect(configMock.loadFromDefault).to.be.calledOnce;
		}
		// @ts-ignore
		expect(configMock.makeApiClient.callCount).to.equal(3);
		expect(configMock.makeApiClient).to.be.calledWith(k8s.ApiextensionsV1Api);
		expect(configMock.makeApiClient).to.be.calledWith(k8s.CustomObjectsApi);
		expect(configMock.makeApiClient).to.be.calledWith(k8s.CoreV1Api);
	}

	suite("Load crds", () => {
		test('Successfully retrieving all existing ocm crds', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: [
							fakeK8SClusteredCrd,
							fakeK8SNamespacedCrd
						]
					}
				})
			});

			let crds = await loadSut.getCrds();
			expect(crds).to.have.lengthOf(2);
			expect(crds[0]).to.deep.equal(fakeOcmClusteredCrd);
			expect(crds[1]).to.deep.equal(fakeOcmNamespacedCrd);
		});

		test('When retrieving with no ocm crds available should return an empty array', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				// @ts-ignore
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: [
							{...fakeK8SClusteredCrd, spec: { group: 'non-ocm-group'}},
						]
					}
				})
			});

			expect(await loadSut.getCrds()).to.be.empty;
		});

		test('Failed cluster access when retrieving all crds should not fail, but return an empty array', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				// @ts-ignore
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 500
					}
				})
			});
			expect(await loadSut.getCrds()).to.be.empty;
		});

		test('Successfully retrieving a single existing ocm crd', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: [
							fakeK8SClusteredCrd
						]
					}
				})
			});
			expect(await loadSut.getCrd(fakeK8SClusteredCrd.spec.names.kind)).to.be.deep.equal(fakeOcmClusteredCrd);
		});

		test('Retrieving a non-existing single ocm crd should return undefined', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: []
					}
				})
			});
			expect(await loadSut.getCrd(fakeK8SClusteredCrd.spec.names.kind)).to.be.undefined;
		});

		test('Failed cluster access while retrieving a single crd should not fail, but return undefined', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				// @ts-ignore
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 500
					}
				})
			});
			expect(await loadSut.getCrd(fakeK8SClusteredCrd.spec.names.kind)).to.be.undefined;
		});
	});

	suite('Load crs', () => {
		[
			{
				title: 'Successfully retrieving existing ocm crs for a clustered ocm crd',
				argument: fakeOcmClusteredCrd
			},
			{
				title: 'Successfully retrieving existing ocm crs a clustered kind name',
				argument: fakeOcmClusteredCrd.kind
			}
		].forEach(value => {
			test(value.title, async () => {
				// @ts-ignore
				loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
					listCustomResourceDefinition: Promise.resolve({
						response: {
							statusCode: 200
						},
						body: {
							items: [
								fakeK8SClusteredCrd
							]
						}
					})
				});

				// @ts-ignore
				loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
					listClusterCustomObject: Promise.resolve({
						response: {
							statusCode: 200
						},
						body: {
							items: [
								fakeK8SClusteredCr
							]
						}
					})
				});

				let crs = await loadSut.getCrs(value.argument);
				expect(crs).to.be.lengthOf(1);
				expect(crs[0]).to.deep.equal(fakeOcmClusteredCr);
			});
		});

		[
			{
				title: 'Successfully retrieving existing ocm crs for a namespaced ocm crd',
				argument: fakeOcmNamespacedCrd
			},
			{
				title: 'Successfully retrieving existing ocm crs a namespaced kind name',
				argument: fakeOcmNamespacedCrd.kind
			}
		].forEach(value => {
			test(value.title, async () => {
				// @ts-ignore
				loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
					listCustomResourceDefinition: Promise.resolve({
						response: {
							statusCode: 200
						},
						body: {
							items: [
								fakeK8SNamespacedCrd
							]
						}
					})
				});

				// @ts-ignore
				loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
					listNamespace: Promise.resolve({
						response: {
							statusCode: 200
						},
						body: {
							items: [
								fakeNamespace
							]
						}
					})
				});

				// @ts-ignore
				loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
					listNamespacedCustomObject: Promise.resolve({
						response: {
							statusCode: 200
						},
						body: {
							items: [
								fakeK8SNamespacedCr
							]
						}
					})
				});

				let crs = await loadSut.getCrs(value.argument);
				expect(crs).to.be.lengthOf(1);
				expect(crs[0]).to.deep.equal(fakeOcmNamespacedCr);
			});
		});

		test('Retrieving crs for non-existing kind name should return an empty array', async () => {
			// @ts-ignore
			loadSut.extApi = sinon.createStubInstance(k8s.ApiextensionsV1Api, {
				listCustomResourceDefinition: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: []
					}
				})
			});

			expect(await loadSut.getCrs('non-existing-kind')).to.be.empty;
		});

		test('Retrieving crs for clustered crd when no crs available should return an empty array', async () => {
			// @ts-ignore
			loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
				listClusterCustomObject: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: []
					}
				})
			});

			expect(await loadSut.getCrs(fakeOcmClusteredCrd)).to.be.empty;
		});

		test('Failed cluster access while retrieving crs for clustered crd should not fail, but return an empty array', async () => {
			// @ts-ignore
			loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
				// @ts-ignore
				listClusterCustomObject: Promise.resolve({
					response: {
						statusCode: 500
					}
				})
			});

			expect(await loadSut.getCrs(fakeOcmClusteredCrd)).to.be.empty;
		});

		test('Retrieving crs for namespaced crd when no crs available should return an empty array', async () => {
			// @ts-ignore
			loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
				listNamespace: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: [
							fakeNamespace
						]
					}
				})
			});

			// @ts-ignore
			loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
				listNamespacedCustomObject: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: []
					}
				})
			});

			expect(await loadSut.getCrs(fakeOcmNamespacedCrd)).to.be.empty;
		});

		test('Failed cluster access while fetching namespaces for retrieving crs for namespaced crd should not fail, but return an empty array', async () => {
			// @ts-ignore
			loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
				// @ts-ignore
				listNamespace: Promise.resolve({
					response: {
						statusCode: 500
					}
				})
			});

			expect(await loadSut.getCrs(fakeOcmNamespacedCrd)).to.be.empty;
		});

		test('Failed cluster while retrieving crs for namespaced crd should not fail, but return an empty array', async () => {
			// @ts-ignore
			loadSut.coreApi = sinon.createStubInstance(k8s.CoreV1Api, {
				listNamespace: Promise.resolve({
					response: {
						statusCode: 200
					},
					body: {
						items: [
							fakeNamespace
						]
					}
				})
			});

			// @ts-ignore
			loadSut.objApi = sinon.createStubInstance(k8s.CustomObjectsApi, {
				// @ts-ignore
				listNamespacedCustomObject: Promise.resolve({
					response: {
						statusCode: 500
					}
				})
			});

			expect(await loadSut.getCrs(fakeOcmNamespacedCrd)).to.be.empty;
		});

	});
});
