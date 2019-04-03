import sinon from 'sinon';
import {expect} from 'chai';
import {NotificationService} from '../../src/services/NotificationService';
import UniversalLoginSDK from 'universal-login-sdk';
import {setupSdk} from 'universal-login-sdk/test';
import WalletService from '../../src/services/WalletService';
import {waitUntil} from 'universal-login-commons';

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let sdk: UniversalLoginSDK;
    let relayer: any;
    let contractAddress: string;
    let privateKey: string;

    before(async () => {
        ({sdk, relayer} = await setupSdk());
        sdk.start();
        const name = 'ja.mylogin.eth';
        [privateKey, contractAddress] = await sdk.create(name);
        const walletService = new WalletService();
        walletService.userWallet = {contractAddress, privateKey, name};
        notificationService = new NotificationService(walletService, sdk);
    });

    it('works', async () => {
        const callback = sinon.spy();
        const unsubscribe = notificationService.subscribe(callback);
        await sdk.connect(contractAddress);
        await waitUntil(() => callback.firstCall !== null);

        expect(callback).has.been.called;
        unsubscribe();
    });

    after(async () => {
        await sdk.finalizeAndStop();
        await relayer.stop();
    });
});
