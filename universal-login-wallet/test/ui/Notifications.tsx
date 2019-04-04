import React from 'React';
import {ReactWrapper} from 'enzyme';
import {expect} from 'chai';
import {Services} from '../../src/services/Services';
import {providers, utils} from 'ethers';
import {setupSdk} from 'universal-login-sdk/test';
import preconfigureServices from '../helpers/preconfigureServices';
import {ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import {mountWithContext} from '../helpers/CustomMount';
import App from '../../src/ui/App';
import {createAndSendInitial} from '../utils/utils';

describe('UI: Notifications',  () => {
  let services : Services;
  let relayer : any;
  let provider : providers.Web3Provider;
  let appWrapper : ReactWrapper;

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: 33113}));
    services = await preconfigureServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    services.tokenService.start();
    services.balanceService.start();
    services.sdk.start();
    appWrapper = mountWithContext(<App/>, services, ['/']);
  });

  it('Should get notification when new device connect', async () => {
    const appPage = await createAndSendInitial(appWrapper, provider);
    appPage.dashboard().isNotificationAlert();
  });

});
