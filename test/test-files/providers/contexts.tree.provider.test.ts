/* eslint-disable @typescript-eslint/unbound-method */
import * as builder from '../../../src/data/builder';
import * as contextsTreeProvider from '../../../src/providers/contextsTreeProvider';
import * as loader from '../../../src/data/loader';
import * as sinon from 'sinon';
import { expect, use } from 'chai';
import { beforeEach } from 'mocha';
import chaiExclude from 'chai-exclude';

use(chaiExclude);

suite('Load the tree provider', () => {
	let loadStub: loader.Load;
	let providerSut: contextsTreeProvider.ConnectedContextsTreeProvider;
	let fakeContext1: builder.ConnectedContext;
	let fakeContext2: builder.ConnectedContext;
	let fakeCrd1: loader.OcmResourceDefinition;
	let fakeCrd2: loader.OcmResourceDefinition;
	let fakeCr1: loader.OcmResource;
	let fakeCr2: loader.OcmResource;

	beforeEach(() => {
		// inject fake connectedContext objects
		fakeContext1 = new builder.ConnectedContext(
			// @ts-ignore
			{ name: 'fake-context1'},
			{ name: 'fake-cluster1', server: 'http://my-fake-first-server:443'},
			{ name: 'fake-user1'}
		);
		fakeContext2 = new builder.ConnectedContext(
			// @ts-ignore
			{ name: 'fake-context2'},
			{ name: 'fake-cluster2', server: 'http://my-fake-second-server:443'},
			{ name: 'fake-user2'}
		);
		// inject fake ocmCrd objects
		fakeCrd1 = new loader.OcmResourceDefinition({
			metadata: {
				name: 'fake-crd1'
			},
			spec: {
				names: {
					kind: 'fake-crd1-kind',
					plural: 'fake-crd1s'
				},
				scope: 'Namespaced',
				group: 'fake-crd1-grp',
				versions: []
			},
			status: {
				storedVersions: [
					'1.1.1'
				]
			}
		});
		fakeCrd2 = new loader.OcmResourceDefinition({
			metadata: {
				name: 'fake-crd2'
			},
			spec: {
				names: {
					kind: 'fake-crd2-kind',
					plural: 'fake-crd2s'
				},
				scope: 'Clustered',
				group: 'fake-crd2-grp',
				versions: []
			},
			status: {
				storedVersions: [
					'2.2.2'
				]
			}
		});
		// inject fake ocmCr objects
		fakeCr1 = new loader.OcmResource(fakeCrd1,'fake-cr1', 'fake-namespace');
		fakeCr2 = new loader.OcmResource(fakeCrd2,'fake-cr2');
		// mock the loader and override the various methods with fakes and stubs
		loadStub = sinon.createStubInstance(loader.Load, {
			getContexts: [fakeContext1, fakeContext2],
			getCrds: Promise.resolve([fakeCrd1, fakeCrd2]),
			getCrs: Promise.resolve([fakeCr1, fakeCr2])
		});
		// instantiate the provider subject under test
		providerSut = new contextsTreeProvider.ConnectedContextsTreeProvider(loadStub);
	});

	test('Instantiation of the provider should refresh the load', () => {
		expect(loadStub.refresh).to.have.been.calledOnce;
	});

	test('Hitting refresh on the provider should refresh the load', () => {
		providerSut.refresh();
		// twice bc the first call was for instantiation
		expect(loadStub.refresh).to.have.been.calledTwice;
	});

	test('Retrieving a specific element should return itself unmodified', () => {
		let fakeElement = sinon.fake();
		// @ts-ignore
		expect(providerSut.getTreeItem(fakeElement)).to.equal(fakeElement);
	});

	test('Retrieving top level children elements should return the contexts', async () => {
		let treeContexts = await providerSut.getChildren();
		expect(treeContexts).to.have.lengthOf(2);
		expect(treeContexts[0]).excluding('iconPath').to.deep.equal({
			collapsibleState: 1,
			label: 'fake-context1',
			context: {
				kontext: {
					name: 'fake-context1'
				},
				name: 'fake-context1',
				cluster: {
					name: 'fake-cluster1',
					server: 'http://my-fake-first-server:443'
				},
				user: {
					name: 'fake-user1'
				}
			},
			tooltip: 'fake-cluster1',
			command: {
				title: 'Context Info',
				command: 'ocm-vscode-extension.showContextDetails',
				arguments: [{
					name: 'fake-context1',
					cluster: 'fake-cluster1',
					user: 'fake-user1'
				}]
			}
		});
		expect(treeContexts[1]).excluding('iconPath').to.deep.equal({
			collapsibleState: 1,
			label: 'fake-context2',
			context: {
				kontext: { name: 'fake-context2' },
				name: 'fake-context2',
				cluster: {
					name: 'fake-cluster2',
					server: 'http://my-fake-second-server:443'
				},
				user: {
					name: 'fake-user2'
				}
			},
			tooltip: 'fake-cluster2',
			command: {
				title: 'Context Info',
				command: 'ocm-vscode-extension.showContextDetails',
				arguments: [{
					name: 'fake-context2',
					cluster: 'fake-cluster2',
					user: 'fake-user2'
				}]
			}
		});
	});

	test('Retrieving children for a context element should return the crds', async () => {
		let treeCrds = await providerSut.getChildren(new contextsTreeProvider.TreeContext(fakeContext1));
		expect(loadStub.setContext).to.have.been.calledOnceWith(fakeContext1);
		expect(loadStub.getCrds).to.have.been.calledOnceWith();
		expect(treeCrds).to.have.lengthOf(2);
		expect(treeCrds[0]).excluding('iconPath').excludingEvery('krd').to.deep.equal({
			collapsibleState: 1,
			label: 'fake-crd1-kind',
			crd: {
				name: 'fake-crd1',
				plural: 'fake-crd1s',
				namespaced: true,
				kind: 'fake-crd1-kind',
				version: '1.1.1',
				group: 'fake-crd1-grp'
			},
			tooltip: 'fake-crd1-grp'
		});
		expect(treeCrds[1]).excluding('iconPath').excludingEvery('krd').to.deep.equal({
			collapsibleState: 1,
			label: 'fake-crd2-kind',
			crd: {
				name: 'fake-crd2',
				plural: 'fake-crd2s',
				namespaced: false,
				kind: 'fake-crd2-kind',
				version: '2.2.2',
				group: 'fake-crd2-grp'
			},
			tooltip: 'fake-crd2-grp'
		});
	});

	test('Retrieving children for a crd element should return the crs', async () => {
		let treeCrs = await providerSut.getChildren(new contextsTreeProvider.TreeCrd(fakeCrd1));
		expect(loadStub.getCrs).to.have.been.calledOnceWith(fakeCrd1);
		expect(treeCrs).to.have.lengthOf(2);
		expect(treeCrs[0]).excludingEvery('krd').to.deep.equal({
			collapsibleState: 0,
			label: 'fake-cr1',
			cr: {
				crd: {
					name: 'fake-crd1',
					plural: 'fake-crd1s',
					namespaced: true,
					kind: 'fake-crd1-kind',
					version: '1.1.1',
					group: 'fake-crd1-grp'
				},
				name: 'fake-cr1',
				namespace: 'fake-namespace'
			},
			tooltip: '1.1.1'
		});
		expect(treeCrs[1]).excludingEvery('krd').to.deep.equal({
			collapsibleState: 0,
			label: 'fake-cr2',
			cr: {
				crd: {
					name: 'fake-crd2',
					plural: 'fake-crd2s',
					namespaced: false,
					kind: 'fake-crd2-kind',
					version: '2.2.2',
					group: 'fake-crd2-grp'
				},
				name: 'fake-cr2',
				namespace: undefined
			},
			tooltip: '2.2.2'
		});
	});
});
