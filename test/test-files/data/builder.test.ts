import * as builder from '../../../src/data/builder';
import * as k8s from '@kubernetes/client-node';
import * as sinon from 'sinon';
import { beforeEach } from 'mocha';
import { expect } from 'chai';

suite('Build using the data builder', () => {
	let fakeKUser: k8s.User = {
		name: 'fakeUser'
	};
	let fakeKCluster: k8s.Cluster = {
		name: 'fakeCluster',
		server: 'https://my-fake-server:6443',
		skipTLSVerify: false
	};
	let fakeKContext: k8s.Context = {
		name: 'fakeContext',
		cluster: 'fakeCluster',
		user: 'fakeUser'
	};

	let buildSut: builder.Build;

	beforeEach(() => {
		// stub and inject the various getX methods
		let getUserStub = sinon.stub();
		getUserStub.withArgs(fakeKUser.name).returns(fakeKUser);
		let getClusterStub = sinon.stub();
		getClusterStub.withArgs(fakeKCluster.name).returns(fakeKCluster);
		let getContextStub = sinon.stub();
		getContextStub.withArgs(fakeKContext.name).returns(fakeKContext);

		let configMock = sinon.createStubInstance(k8s.KubeConfig, {
			getUser: getUserStub,
			// @ts-ignore
			getCluster: getClusterStub,
			// @ts-ignore
			getContextObject: getContextStub
		});
		buildSut = new builder.Build(configMock);
	});

	[
		{
			title: 'Successfully build a user from a k8s user',
			argument: fakeKUser
		},
		{
			title: 'Successfully build a user from a user name',
			argument: fakeKUser.name
		}
	].forEach(value => {
		test(value.title, () => {
			expect(buildSut.user(value.argument)).to.deep.equal({
				kuser: {
					name: 'fakeUser'
				},
				name: 'fakeUser'
			});
		});
	});

	test('Build a user from an wrong k8s user name should return undefined', () => {
		expect(buildSut.user('unknownUser')).to.be.undefined;
	});

	[
		{
			title: 'Successfully build a cluster from a k8s cluster',
			argument: fakeKCluster

		},
		{
			title: 'Successfully build a cluster from a cluster name',
			argument: fakeKCluster.name
		}
	].forEach(value => {
		test(value.title, () => {
			expect(buildSut.cluster(value.argument)).to.deep.equal({
				kluster: {
					name: 'fakeCluster',
					server: 'https://my-fake-server:6443',
					skipTLSVerify: false
				},
				name: 'fakeCluster',
				server: 'https://my-fake-server:6443'
			});
		});
	});

	test('Build a cluster from an wrong k8s cluster name should return undefined', () => {
		expect(buildSut.cluster('unknownCluster')).to.be.undefined;
	});

	[
		{
			title: 'Successfully build a context from a k8s context',
			argument: fakeKContext
		},
		{
			title: 'Successfully build a context from a context name',
			argument: fakeKContext.name
		}
	].forEach(value => {
		test(value.title, () => {
			expect(buildSut.context(value.argument)).to.deep.equal({
				kontext: {
					name: 'fakeContext',
					cluster: 'fakeCluster',
					user: 'fakeUser'
				},
				name: 'fakeContext',
				cluster: {
					kluster: {
						name: 'fakeCluster',
						server: 'https://my-fake-server:6443',
						skipTLSVerify: false
					},
					name: 'fakeCluster',
					server: 'https://my-fake-server:6443'
				},
				user: {
					kuser: {
						name: 'fakeUser'
					},
					name: 'fakeUser'
				}
			});
		});
	});

	test('Build a context from an wrong k8s context name should return undefined', () => {
		expect(buildSut.context('unknownContext')).to.be.undefined;
	});

	test('Build a context with a wrong cluster name should return undefined', () => {
		expect(buildSut.context({ name: 'fakeContext', cluster: 'unknownCluster', user: 'fakeUser'})).to.be.undefined;
	});

	test('Build a context with a wrong user name should return undefined', () => {
		expect(buildSut.context({ name: 'fakeContext', cluster: 'fakeCluster', user: 'unknownUser'})).to.be.undefined;
	});
});
