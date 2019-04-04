import sinon from 'sinon';
import {expect} from 'chai';
import {providers} from 'ethers';
import {Services} from '../../src/services/Services';
import {setupSdk} from 'universal-login-sdk/test';
import {waitUntil, ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import preconfigureServices from '../helpers/preconfigureServices';

describe('NotificationService', () => {
    let relayer: any;
    let services : Services;
    let contractAddress: string;
    let privateKey: string;
    let provider : providers.Web3Provider;

    before(async () => {
        ({relayer, provider} = await setupSdk({overridePort: 33113}));
        services = await preconfigureServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
        services.sdk.start();
        const name = 'ja.mylogin.eth';
        [privateKey, contractAddress] = await services.createWallet(name);
    });

    it('should call callback when new notification', async () => {
        const callback = sinon.spy();
        const unsubscribe = services.notificationService.subscribe(callback);
        await services.sdk.connect(contractAddress);
        await waitUntil(() => callback.firstCall !== null);

        expect(callback).has.been.called;
        unsubscribe();
    });

    after(async () => {
        await services.sdk.finalizeAndStop();
        await relayer.stop();
    });
});
