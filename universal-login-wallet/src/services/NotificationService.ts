import {Procedure} from 'universal-login-commons';
import WalletService from './WalletService';
import UniversalLoginSDK from 'universal-login-sdk';

export class NotificationService {
    private notifications = [];

    constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
    }

    subscribe (callback: Procedure) {
        callback(this.notifications.length !== 0);
        const subscription = this.sdk.subscribe(
            'AuthorisationsChanged',
            {contractAddress: this.walletService.userWallet!.contractAddress},
            (authorisations: any) => {
                this.notifications = authorisations;
                callback(authorisations.length !== 0);
            });
        return () => { subscription.remove(); };
    }

}
