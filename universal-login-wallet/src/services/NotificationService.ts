import {Procedure} from 'universal-login-commons';
import WalletService from "./WalletService";
import UniversalLoginSDK from 'universal-login-sdk'

export class NotificationService {

    constructor (private walletService: WalletService, private sdk: UniversalLoginSDK) {
    };

    async subscribe (callback: Procedure) {
        const subscription = await this.sdk.subscribe('AuthorisationsChanged', {contractAddress: this.walletService.userWallet!.contractAddress}, (authorisations: any) => {
            callback(authorisations);
        });
        return () => {subscription.remove()}
    };

}
