import * as assert from 'assert';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../../../Auth';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command, { CommandError } from '../../../../Command';
import request from '../../../../request';
import { pid } from '../../../../utils/pid';
import { sinonUtil } from '../../../../utils/sinonUtil';
import commands from '../../commands';
const command: Command = require('./list-add');

describe(commands.LIST_ADD, () => {
  let log: any[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
    auth.service.connected = true;
    commandInfo = Cli.getCommandInfo(command);
  });

  beforeEach(() => {
    log = [];
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
  });

  afterEach(() => {
    sinonUtil.restore([
      request.post
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      appInsights.trackEvent,
      pid.getProcessName
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.LIST_ADD), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('sets specified title for list', async () => {
    const expected = 'List 1';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Title;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: expected, baseTemplate: 'GenericList', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified baseTemplate for list', async () => {
    const expected = 100;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.BaseTemplate;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified description for list', async () => {
    const expected = 'List 1 description';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Description;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', description: expected, baseTemplate: 'GenericList', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified templateFeatureId for list', async () => {
    const expected = '00bfea71-de22-43b2-a848-c05709900100';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.TemplateFeatureId;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', templateFeatureId: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified schemaXml for list', async () => {
    const expected = `<List Title=\'List 1' ID='BE9CE88C-EF3A-4A61-9A8E-F8C038442227'></List>`;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.SchemaXml;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', schemaXml: expected, templateFeatureId: '00bfea71-de22-43b2-a848-c05709900100', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified allowDeletion for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.AllowDeletion;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', allowDeletion: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified allowEveryoneViewItems for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.AllowEveryoneViewItems;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', allowEveryoneViewItems: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified allowMultiResponses for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.AllowMultiResponses;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', allowMultiResponses: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified contentTypesEnabled for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ContentTypesEnabled;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', contentTypesEnabled: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified crawlNonDefaultViews for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.CrawlNonDefaultViews;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', crawlNonDefaultViews: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified defaultContentApprovalWorkflowId for list', async () => {
    const expected = '00bfea71-de22-43b2-a848-c05709900100';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.DefaultContentApprovalWorkflowId;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', defaultContentApprovalWorkflowId: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified defaultDisplayFormUrl for list', async () => {
    const expected = '/sites/project-x/List%201/view.aspx';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.DefaultDisplayFormUrl;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', defaultDisplayFormUrl: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified defaultEditFormUrl for list', async () => {
    const expected = '/sites/project-x/List%201/edit.aspx';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.DefaultEditFormUrl;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', defaultEditFormUrl: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified direction for list', async () => {
    const expected = 'LTR';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Direction;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', direction: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified disableGridEditing for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.DisableGridEditing;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', disableGridEditing: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified draftVersionVisibility for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.DraftVersionVisibility;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', draftVersionVisibility: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified emailAlias for list', async () => {
    const expected = 'yourname@contoso.onmicrosoft.com';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EmailAlias;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', emailAlias: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableAssignToEmail for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableAssignToEmail;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableAssignToEmail: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableAttachments for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableAttachments;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableAttachments: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableDeployWithDependentList for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableDeployWithDependentList;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableDeployWithDependentList: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableFolderCreation for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableFolderCreation;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableFolderCreation: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableMinorVersions for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableMinorVersions;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableMinorVersions: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableModeration for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableModeration;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableModeration: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enablePeopleSelector for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnablePeopleSelector;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enablePeopleSelector: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableResourceSelector for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableResourceSelector;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableResourceSelector: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableSchemaCaching for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableSchemaCaching;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableSchemaCaching: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableSyndication for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableSyndication;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableSyndication: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableThrottling for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableThrottling;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableThrottling: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enableVersioning for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnableVersioning;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enableVersioning: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified enforceDataValidation for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.EnforceDataValidation;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', enforceDataValidation: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified excludeFromOfflineClient for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ExcludeFromOfflineClient;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', excludeFromOfflineClient: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified fetchPropertyBagForListView for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.FetchPropertyBagForListView;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', fetchPropertyBagForListView: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified followable for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Followable;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', followable: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified forceCheckout for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ForceCheckout;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', forceCheckout: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified forceDefaultContentType for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ForceDefaultContentType;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', forceDefaultContentType: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified hidden for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Hidden;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', hidden: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified includedInMyFilesScope for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.IncludedInMyFilesScope;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', includedInMyFilesScope: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified irmEnabled for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.IrmEnabled;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', irmEnabled: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified irmExpire for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.IrmExpire;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', irmExpire: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified irmReject for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.IrmReject;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', irmReject: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified isApplicationList for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.IsApplicationList;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', isApplicationList: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified listExperienceOptions for list', async () => {
    const expected = 'NewExperience';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ListExperienceOptions;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', listExperienceOptions: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified majorVersionLimit for list', async () => {
    const expected = 34;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.MajorVersionLimit;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', majorVersionLimit: expected, enableVersioning: true, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified majorWithMinorVersionsLimit for list', async () => {
    const expected = 20;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.MajorWithMinorVersionsLimit;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', majorWithMinorVersionsLimit: expected, enableMinorVersions: true, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified multipleDataList for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.MultipleDataList;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', multipleDataList: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified navigateForFormsPages for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.NavigateForFormsPages;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', navigateForFormsPages: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified needUpdateSiteClientTag for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.NeedUpdateSiteClientTag;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', needUpdateSiteClientTag: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified noCrawl for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.NoCrawl;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', noCrawl: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified onQuickLaunch for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.OnQuickLaunch;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', onQuickLaunch: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified ordered for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.Ordered;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', ordered: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified parserDisabled for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ParserDisabled;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', parserDisabled: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified readOnlyUI for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ReadOnlyUI;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', readOnlyUI: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified readSecurity for list', async () => {
    const expected = 2;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ReadSecurity;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', readSecurity: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified requestAccessEnabled for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.RequestAccessEnabled;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', requestAccessEnabled: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified restrictUserUpdates for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.RestrictUserUpdates;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', restrictUserUpdates: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified sendToLocationName for list', async () => {
    const expected = 'SendToLocation';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.SendToLocationName;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', sendToLocationName: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified sendToLocationUrl for list', async () => {
    const expected = '/sites/project-x/SendToLocation.aspx';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.SendToLocationUrl;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', sendToLocationUrl: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified showUser for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ShowUser;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', showUser: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified useFormsForDisplay for list', async () => {
    const expected = true;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.UseFormsForDisplay;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', useFormsForDisplay: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified validationFormula for list', async () => {
    const expected = `IF(fieldName=true);'truetest':'falsetest'`;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ValidationFormula;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', validationFormula: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified validationMessage for list', async () => {
    const expected = 'Error on field x';
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.ValidationMessage;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', validationMessage: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('sets specified writeSecurity for list', async () => {
    const expected = 4;
    let actual = '';
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        actual = opts.data.WriteSecurity;
        return Promise.resolve({ ErrorMessage: null });
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', writeSecurity: expected, webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert.strictEqual(actual, expected);
  });

  it('correctly handles random API error', async () => {
    sinon.stub(request, 'post').callsFake(() => {
      return Promise.reject('An error has occurred');
    });

    await assert.rejects(command.action(logger, { options: { debug: false, title: 'List 1', baseTemplate: 'GenericList', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } } as any),
      new CommandError('An error has occurred'));
  });

  it('supports debug mode', () => {
    const options = command.options;
    let containsDebugOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsDebugOption = true;
      }
    });
    assert(containsDebugOption);
  });

  it('supports specifying URL', () => {
    const options = command.options;
    let containsTypeOption = false;
    options.forEach(o => {
      if (o.option.indexOf('<webUrl>') > -1) {
        containsTypeOption = true;
      }
    });
    assert(containsTypeOption);
  });

  it('offers autocomplete for the baseTemplate option', () => {
    const options = command.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].option.indexOf('--baseTemplate') > -1) {
        assert(options[i].autocomplete);
        return;
      }
    }
    assert(false);
  });

  it('offers autocomplete for the direction option', () => {
    const options = command.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].option.indexOf('--direction') > -1) {
        assert(options[i].autocomplete);
        return;
      }
    }
    assert(false);
  });

  it('configures command types', () => {
    assert.notStrictEqual(typeof command.types, 'undefined', 'command types undefined');
    assert.notStrictEqual(command.types.string, 'undefined', 'command string types undefined');
  });

  it('fails validation if the url option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo', title: 'List 1', baseTemplate: 'GenericList' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the url option is a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList' } }, commandInfo);
    assert(actual);
  });

  it('has correct baseTemplate specified', async () => {
    const baseTemplateValue = 'DocumentLibrary';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: baseTemplateValue } }, commandInfo);
    assert(actual === true);
  });

  it('fails if non existing baseTemplate specified', async () => {
    const baseTemplateValue = 'foo';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: baseTemplateValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the templateFeatureId option is not a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', templateFeatureId: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the templateFeatureId option is a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', templateFeatureId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the allowDeletion option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowDeletion: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the allowDeletion option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowDeletion: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the allowEveryoneViewItems option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowEveryoneViewItems: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the allowEveryoneViewItems option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowEveryoneViewItems: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the allowMultiResponses option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowMultiResponses: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the allowMultiResponses option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', allowMultiResponses: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the contentTypesEnabled option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', contentTypesEnabled: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the contentTypesEnabled option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', contentTypesEnabled: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the crawlNonDefaultViews option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', crawlNonDefaultViews: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the crawlNonDefaultViews option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', crawlNonDefaultViews: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the disableGridEditing option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', disableGridEditing: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the disableGridEditing option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', disableGridEditing: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableAssignToEmail option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableAssignToEmail: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableAssignToEmail option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableAssignToEmail: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableAttachments option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableAttachments: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableAttachments option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableAttachments: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableDeployWithDependentList option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableDeployWithDependentList: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableDeployWithDependentList option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableDeployWithDependentList: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableFolderCreation option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableFolderCreation: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableFolderCreation option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableFolderCreation: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableMinorVersions option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableMinorVersions: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableMinorVersions option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableMinorVersions: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableModeration option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableModeration: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableModeration option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableModeration: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enablePeopleSelector option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enablePeopleSelector: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enablePeopleSelector option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enablePeopleSelector: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableResourceSelector option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableResourceSelector: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableResourceSelector option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableResourceSelector: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableSchemaCaching option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableSchemaCaching: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableSchemaCaching option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableSchemaCaching: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableSyndication option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableSyndication: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableSyndication option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableSyndication: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableThrottling option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableThrottling: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableThrottling option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableThrottling: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enableVersioning option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableVersioning: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enableVersioning option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enableVersioning: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the enforceDataValidation option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enforceDataValidation: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the enforceDataValidation option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', enforceDataValidation: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the excludeFromOfflineClient option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', excludeFromOfflineClient: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the excludeFromOfflineClient option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', excludeFromOfflineClient: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the fetchPropertyBagForListView option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', fetchPropertyBagForListView: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the fetchPropertyBagForListView option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', fetchPropertyBagForListView: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the followable option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', followable: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the followable option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', followable: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the forceCheckout option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', forceCheckout: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the forceCheckout option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', forceCheckout: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the forceDefaultContentType option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', forceDefaultContentType: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the forceDefaultContentType option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', forceDefaultContentType: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the hidden option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', hidden: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the hidden option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', hidden: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the includedInMyFilesScope option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', includedInMyFilesScope: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the includedInMyFilesScope option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', includedInMyFilesScope: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the irmEnabled option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmEnabled: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the irmEnabled option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmEnabled: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the irmExpire option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmExpire: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the irmExpire option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmExpire: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the irmReject option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmReject: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the irmReject option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', irmReject: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the isApplicationList option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', isApplicationList: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the isApplicationList option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', isApplicationList: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the multipleDataList option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', multipleDataList: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the multipleDataList option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', multipleDataList: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the navigateForFormsPages option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', navigateForFormsPages: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the navigateForFormsPages option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', navigateForFormsPages: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the needUpdateSiteClientTag option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', needUpdateSiteClientTag: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the needUpdateSiteClientTag option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', needUpdateSiteClientTag: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the noCrawl option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', noCrawl: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the noCrawl option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', noCrawl: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the onQuickLaunch option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', onQuickLaunch: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the onQuickLaunch option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', onQuickLaunch: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the ordered option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', ordered: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the ordered option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', ordered: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the parserDisabled option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', parserDisabled: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the parserDisabled option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', parserDisabled: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the readOnlyUI option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', readOnlyUI: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the readOnlyUI option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', readOnlyUI: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the requestAccessEnabled option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', requestAccessEnabled: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the requestAccessEnabled option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', requestAccessEnabled: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the restrictUserUpdates option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', restrictUserUpdates: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the restrictUserUpdates option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', restrictUserUpdates: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the showUser option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', showUser: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the showUser option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', showUser: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the useFormsForDisplay option is not a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', useFormsForDisplay: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the useFormsForDisplay option is a valid Boolean', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', useFormsForDisplay: 'true' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the defaultContentApprovalWorkflowId option is not a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', defaultContentApprovalWorkflowId: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the defaultContentApprovalWorkflowId option is a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', defaultContentApprovalWorkflowId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF' } }, commandInfo);
    assert(actual);
  });

  it('fails if non existing draftVersionVisibility specified', async () => {
    const draftVersionValue = 'NonExistingDraftVersionVisibility';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', draftVersionVisibility: draftVersionValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('has correct draftVersionVisibility specified', async () => {
    const draftVersionValue = 'Approver';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', draftVersionVisibility: draftVersionValue } }, commandInfo);
    assert(actual === true);
  });

  it('fails if emailAlias specified, but enableAssignToEmail is not true', async () => {
    const emailAliasValue = 'yourname@contoso.onmicrosoft.com';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', emailAlias: emailAliasValue } }, commandInfo);
    assert.strictEqual(actual, `emailAlias could not be set if enableAssignToEmail is not set to true. Please set enableAssignToEmail.`);
  });

  it('has correct emailAlias and enableAssignToEmail values specified', async () => {
    const emailAliasValue = 'yourname@contoso.onmicrosoft.com';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', emailAlias: emailAliasValue, enableAssignToEmail: 'true' } }, commandInfo);
    assert(actual === true);
  });

  it('fails if non existing direction specified', async () => {
    const directionValue = 'abc';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', direction: directionValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('has correct direction value specified', async () => {
    const directionValue = 'LTR';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', direction: directionValue } }, commandInfo);
    assert(actual === true);
  });

  it('fails if majorVersionLimit specified, but enableVersioning is not true', async () => {
    const majorVersionLimitValue = 20;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', majorVersionLimit: majorVersionLimitValue } }, commandInfo);
    assert.strictEqual(actual, `majorVersionLimit option is only valid in combination with enableVersioning.`);
  });

  it('has correct majorVersionLimit and enableVersioning values specified', async () => {
    const majorVersionLimitValue = 20;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', majorVersionLimit: majorVersionLimitValue, enableVersioning: 'true' } }, commandInfo);
    assert(actual === true);
  });

  it('fails if majorWithMinorVersionsLimit specified, but enableModeration is not true', async () => {
    const majorWithMinorVersionLimitValue = 20;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', majorWithMinorVersionsLimit: majorWithMinorVersionLimitValue } }, commandInfo);
    assert.strictEqual(actual, `majorWithMinorVersionsLimit option is only valid in combination with enableMinorVersions or enableModeration.`);
  });

  it('fails if non existing readSecurity specified', async () => {
    const readSecurityValue = 5;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', readSecurity: readSecurityValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails if non existing writeSecurity specified', async () => {
    const writeSecurityValue = 5;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', writeSecurity: writeSecurityValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('has correct readSecurity specified', async () => {
    const readSecurityValue = 2;
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', readSecurity: readSecurityValue } }, commandInfo);
    assert(actual === true);
  });

  it('fails if non existing listExperienceOptions specified', async () => {
    const listExperienceValue = 'NonExistingExperience';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', listExperienceOptions: listExperienceValue } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('has correct listExperienceOptions specified', async () => {
    const listExperienceValue = 'NewExperience';
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', title: 'List 1', baseTemplate: 'GenericList', listExperienceOptions: listExperienceValue } }, commandInfo);
    assert(actual === true);
  });

  it('returns listInstance object when list is added with correct values', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`/_api/web/lists`) > -1) {
        return Promise.resolve(
          {
            "AllowContentTypes": true,
            "BaseTemplate": 100,
            "BaseType": 1,
            "ContentTypesEnabled": false,
            "CrawlNonDefaultViews": false,
            "Created": null,
            "CurrentChangeToken": null,
            "CustomActionElements": null,
            "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
            "DefaultItemOpenUseListSetting": false,
            "Description": "",
            "Direction": "none",
            "DocumentTemplateUrl": null,
            "DraftVersionVisibility": 0,
            "EnableAttachments": false,
            "EnableFolderCreation": true,
            "EnableMinorVersions": false,
            "EnableModeration": false,
            "EnableVersioning": false,
            "EntityTypeName": "Documents",
            "ExemptFromBlockDownloadOfNonViewableFiles": false,
            "FileSavePostProcessingEnabled": false,
            "ForceCheckout": false,
            "HasExternalDataSource": false,
            "Hidden": false,
            "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
            "ImagePath": null,
            "ImageUrl": null,
            "IrmEnabled": false,
            "IrmExpire": false,
            "IrmReject": false,
            "IsApplicationList": false,
            "IsCatalog": false,
            "IsPrivate": false,
            "ItemCount": 69,
            "LastItemDeletedDate": null,
            "LastItemModifiedDate": null,
            "LastItemUserModifiedDate": null,
            "ListExperienceOptions": 0,
            "ListItemEntityTypeFullName": null,
            "MajorVersionLimit": 0,
            "MajorWithMinorVersionsLimit": 0,
            "MultipleDataList": false,
            "NoCrawl": false,
            "ParentWebPath": null,
            "ParentWebUrl": null,
            "ParserDisabled": false,
            "ServerTemplateCanCreateFolders": true,
            "TemplateFeatureId": null,
            "Title": "List 1"
          }
        );
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: { debug: true, title: 'List 1', baseTemplate: 'GenericList', webUrl: 'https://contoso.sharepoint.com/sites/project-x' } });
    assert(loggerLogSpy.calledWith({
      AllowContentTypes: true,
      BaseTemplate: 100,
      BaseType: 1,
      ContentTypesEnabled: false,
      CrawlNonDefaultViews: false,
      Created: null,
      CurrentChangeToken: null,
      CustomActionElements: null,
      DefaultContentApprovalWorkflowId: '00000000-0000-0000-0000-000000000000',
      DefaultItemOpenUseListSetting: false,
      Description: '',
      Direction: 'none',
      DocumentTemplateUrl: null,
      DraftVersionVisibility: 0,
      EnableAttachments: false,
      EnableFolderCreation: true,
      EnableMinorVersions: false,
      EnableModeration: false,
      EnableVersioning: false,
      EntityTypeName: 'Documents',
      ExemptFromBlockDownloadOfNonViewableFiles: false,
      FileSavePostProcessingEnabled: false,
      ForceCheckout: false,
      HasExternalDataSource: false,
      Hidden: false,
      Id: '14b2b6ed-0885-4814-bfd6-594737cc3ae3',
      ImagePath: null,
      ImageUrl: null,
      IrmEnabled: false,
      IrmExpire: false,
      IrmReject: false,
      IsApplicationList: false,
      IsCatalog: false,
      IsPrivate: false,
      ItemCount: 69,
      LastItemDeletedDate: null,
      LastItemModifiedDate: null,
      LastItemUserModifiedDate: null,
      ListExperienceOptions: 0,
      ListItemEntityTypeFullName: null,
      MajorVersionLimit: 0,
      MajorWithMinorVersionsLimit: 0,
      MultipleDataList: false,
      NoCrawl: false,
      ParentWebPath: null,
      ParentWebUrl: null,
      ParserDisabled: false,
      ServerTemplateCanCreateFolders: true,
      TemplateFeatureId: null,
      Title: 'List 1'
    }));
  });
});