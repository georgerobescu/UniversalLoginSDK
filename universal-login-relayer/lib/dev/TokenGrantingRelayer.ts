import {waitToBeMined} from '@universal-login/commons';
import Token from './Token.json';
import Relayer, {RelayerConfig} from '@universal-login/relayer';
import {utils, Contract, providers} from 'ethers';
import {Transaction} from 'ethers/utils';
import {EventSubscription} from 'fbemitter';

interface TokenGrantingRelayerCongig extends RelayerConfig {
  tokenContractAddress : string;
}

class TokenGrantingRelayer extends Relayer {
  private readonly tokenContractAddress : string;
  private tokenContract : Contract;
  private addKeySubscription?: EventSubscription;
  private addKeysSubscription?: EventSubscription;

  constructor(config : TokenGrantingRelayerCongig, provider? : providers.Provider) {
    super(config, provider);
    this.tokenContractAddress = config.tokenContractAddress;
    this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.wallet);
    this.addHooks();
  }

  addHooks() {
    this.hooks.addListener('created', async (transaction : Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(receipt.contractAddress, utils.parseEther('100'));
      }
    });

    this.addKeySubscription = this.hooks.addListener('added', async (transaction : Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('5'));
      }
    });

    this.addKeysSubscription = this.hooks.addListener('keysAdded', async (transaction : Transaction) => {
      const receipt = await waitToBeMined(this.provider, transaction.hash as string);
      if (receipt.status) {
        this.tokenContract.transfer(transaction.to, utils.parseEther('15'));
      }
    });
  }
}

export {TokenGrantingRelayer};