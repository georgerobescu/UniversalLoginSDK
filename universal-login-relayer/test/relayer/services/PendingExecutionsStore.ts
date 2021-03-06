import {expect} from 'chai';
import PendingExecutionsStore from '../../../lib/services/transactions/PendingExecutionsStore';
import PendingExecution from '../../../lib/utils/pendingExecution';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import { calculateMessageHash } from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../fixtures/basicWalletContractWithMockToken';
import getMessageWith from '../../helpers/message';
import { Message } from '@universal-login/commons';

describe('UNIT: PendingExecutionsStore', async () => {
  let pendingExecutionsStore: PendingExecutionsStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: Message;
  let pendingExecution: PendingExecution;
  let messageHash: string;

  beforeEach(async () => {
    ({wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    pendingExecutionsStore = new PendingExecutionsStore();
    message = await getMessageWith(walletContract.address, wallet.privateKey);

    pendingExecution = new PendingExecution(message.from, wallet);
    messageHash = calculateMessageHash(message);
  });

  it('roundtrip', () => {
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(false);
    pendingExecutionsStore.add(messageHash, pendingExecution);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(true);
    expect(pendingExecutionsStore.get(messageHash)).to.be.deep.eq(pendingExecution);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(true);
    const removedPendingExecution = pendingExecutionsStore.remove(messageHash);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(pendingExecution);
  });
});
