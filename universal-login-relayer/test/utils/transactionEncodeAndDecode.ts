import {expect} from 'chai';
import { Message } from '@universal-login/commons';
import getMessageWith from '../config/message';
import {encodeDataForExecuteSigned, decodeDataForExecuteSigned} from '../../lib/utils/transactions';

describe('Coding transaction data', () => {
  let message: Message;
  const privateKey = '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797';

  before(async () => {
    message = await getMessageWith('0x123', privateKey);
  });

  it('message without from property shoud be equal decoded message', () => {
    const {from, ...messageWithoutFrom} = message;
    const encoded = encodeDataForExecuteSigned(message);
    const decoded = decodeDataForExecuteSigned(encoded);
    expect(decoded).to.deep.equal(messageWithoutFrom);
  });
});