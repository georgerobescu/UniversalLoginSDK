import {Procedure} from 'universal-login-commons';
import WalletService from './WalletService';
import UniversalLoginSDK from 'universal-login-sdk';

export class NotificationService {
    private notifications = [];

    constructor (private walletService: WalletService, private sdk: UniversalLoginSDK) {
    }

    subscribe (callback: Procedure) {

        const subscription = this.sdk.subscribe(
            'AuthorisationsChanged',
            {contractAddress: this.walletService.userWallet!.contractAddress},
            (authorisations: any) => {
                this.notifications = authorisations;
                callback(authorisations);
            });
        return () => { subscription.remove(); };
    }

}
