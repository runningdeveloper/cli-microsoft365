import * as assert from 'assert';
import * as open from 'open';
import * as sinon from 'sinon';
import appInsights from '../../../appInsights';
import { Cli } from '../../../cli/Cli';
import { Logger } from '../../../cli/Logger';
import Command, { CommandError } from '../../../Command';
import { pid } from '../../../utils/pid';
import { sinonUtil } from '../../../utils/sinonUtil';
import commands from '../commands';
const command: Command = require('./cli-reconsent');

describe(commands.RECONSENT, () => {
  let log: string[];
  let logger: Logger;
  let cli: Cli;
  let getSettingWithDefaultValueStub: sinon.SinonStub;
  let openStub: sinon.SinonStub;
  let loggerLogSpy: sinon.SinonSpy;

  before(() => {
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
  });

  beforeEach(() => {
    log = [];
    cli = Cli.getInstance();
    logger = {
      log: (msg: string) => {
        log.push(msg);
      },
      logRaw: (msg: string) => {
        log.push(msg);
      },
      logToStderr: (msg: string) => {
        log.push(msg);
      }
    };
    loggerLogSpy = sinon.spy(logger, 'log');
    (command as any)._open = open;
    openStub = sinon.stub(command as any, '_open').callsFake(() => Promise.resolve(null));
    getSettingWithDefaultValueStub = sinon.stub(cli, 'getSettingWithDefaultValue').callsFake((() => false));
  });

  afterEach(() => {
    loggerLogSpy.restore();
    openStub.restore();
    getSettingWithDefaultValueStub.restore();
  });

  after(() => {
    sinonUtil.restore([
      appInsights.trackEvent,
      pid.getProcessName
    ]);
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.RECONSENT), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('shows message with url (not using autoOpenLinksInBrowser)', async () => {
    await command.action(logger, { options: { debug: false } });
    assert(loggerLogSpy.calledWith(`To re-consent the PnP Microsoft 365 Management Shell Azure AD application navigate in your web browser to https://login.microsoftonline.com/common/oauth2/authorize?client_id=31359c7f-bd7e-475c-86db-fdb8c937548e&response_type=code&prompt=admin_consent`));
  });

  it('shows message with url (using autoOpenLinksInBrowser)', async () => {
    getSettingWithDefaultValueStub.restore();
    getSettingWithDefaultValueStub = sinon.stub(cli, 'getSettingWithDefaultValue').callsFake((() => true));

    await command.action(logger, {
      options: {
        debug: false
      }
    });
    assert(loggerLogSpy.calledWith(`Opening the following page in your browser: https://login.microsoftonline.com/common/oauth2/authorize?client_id=31359c7f-bd7e-475c-86db-fdb8c937548e&response_type=code&prompt=admin_consent`));
  });

  it('throws error when open in browser fails', async () => {
    openStub.restore();
    openStub = sinon.stub(command as any, '_open').callsFake(() => Promise.reject("An error occurred"));
    getSettingWithDefaultValueStub.restore();
    getSettingWithDefaultValueStub = sinon.stub(cli, 'getSettingWithDefaultValue').callsFake((() => true));

    await assert.rejects(command.action(logger, {
      options: {
        debug: false
      }
    }), new CommandError("An error occurred"));
    assert(loggerLogSpy.calledWith(`Opening the following page in your browser: https://login.microsoftonline.com/common/oauth2/authorize?client_id=31359c7f-bd7e-475c-86db-fdb8c937548e&response_type=code&prompt=admin_consent`));
  });
});