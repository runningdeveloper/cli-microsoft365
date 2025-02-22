import { Logger } from '../../../../cli/Logger';
import GlobalOptions from '../../../../GlobalOptions';
import request from '../../../../request';
import { formatting } from '../../../../utils/formatting';
import { validation } from '../../../../utils/validation';
import SpoCommand from '../../../base/SpoCommand';
import commands from '../../commands';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  fieldId?: string;
  fieldTitle?: string;
  fieldPosition?: string;
  listId?: string;
  listTitle?: string;
  viewId?: string;
  viewTitle?: string;
  webUrl: string;
}

class SpoListViewFieldAddCommand extends SpoCommand {
  public get name(): string {
    return commands.LIST_VIEW_FIELD_ADD;
  }

  public get description(): string {
    return 'Adds the specified field to list view';
  }

  constructor() {
    super();

    this.#initTelemetry();
    this.#initOptions();
    this.#initValidators();
    this.#initOptionSets();
  }

  #initTelemetry(): void {
    this.telemetry.push((args: CommandArgs) => {
      Object.assign(this.telemetryProperties, {
        listId: typeof args.options.listId !== 'undefined',
        listTitle: typeof args.options.listTitle !== 'undefined',
        viewId: typeof args.options.viewId !== 'undefined',
        viewTitle: typeof args.options.viewTitle !== 'undefined',
        fieldId: typeof args.options.fieldId !== 'undefined',
        fieldTitle: typeof args.options.fieldTitle !== 'undefined',
        fieldPosition: typeof args.options.fieldPosition !== 'undefined'
      });
    });
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-u, --webUrl <webUrl>'
      },
      {
        option: '--listId [listId]'
      },
      {
        option: '--listTitle [listTitle]'
      },
      {
        option: '--viewId [viewId]'
      },
      {
        option: '--viewTitle [viewTitle]'
      },
      {
        option: '--fieldId [fieldId]'
      },
      {
        option: '--fieldTitle [fieldTitle]'
      },
      {
        option: '--fieldPosition [fieldPosition]'
      }
    );
  }

  #initValidators(): void {
    this.validators.push(
      async (args: CommandArgs) => {
        const isValidSharePointUrl: boolean | string = validation.isValidSharePointUrl(args.options.webUrl);
        if (isValidSharePointUrl !== true) {
          return isValidSharePointUrl;
        }

        if (args.options.listId) {
          if (!validation.isValidGuid(args.options.listId)) {
            return `${args.options.listId} is not a valid GUID`;
          }
        }

        if (args.options.viewId) {
          if (!validation.isValidGuid(args.options.viewId)) {
            return `${args.options.viewId} is not a valid GUID`;
          }
        }

        if (args.options.fieldId) {
          if (!validation.isValidGuid(args.options.fieldId)) {
            return `${args.options.fieldId} is not a valid GUID`;
          }
        }

        if (args.options.fieldPosition) {
          const position: number = parseInt(args.options.fieldPosition);
          if (isNaN(position)) {
            return `${args.options.fieldPosition} is not a number`;
          }
        }

        return true;
      }
    );
  }

  #initOptionSets(): void {
    this.optionSets.push(
      ['listId', 'listTitle'],
      ['viewId', 'viewTitle'],
      ['fieldId', 'fieldTitle']
    );
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    const listSelector: string = args.options.listId ? `(guid'${formatting.encodeQueryParameter(args.options.listId)}')` : `/GetByTitle('${formatting.encodeQueryParameter(args.options.listTitle as string)}')`;
    let viewSelector: string = '';
    let currentField: { InternalName: string; };

    if (this.verbose) {
      logger.logToStderr(`Getting field ${args.options.fieldId || args.options.fieldTitle}...`);
    }

    try {
      const field = await this.getField(args.options, listSelector);

      if (this.verbose) {
        logger.logToStderr(`Adding the field ${args.options.fieldId || args.options.fieldTitle} to the view ${args.options.viewId || args.options.viewTitle}...`);
      }

      currentField = field;

      viewSelector = args.options.viewId ? `('${formatting.encodeQueryParameter(args.options.viewId)}')` : `/GetByTitle('${formatting.encodeQueryParameter(args.options.viewTitle as string)}')`;
      const postRequestUrl: string = `${args.options.webUrl}/_api/web/lists${listSelector}/views${viewSelector}/viewfields/addviewfield('${field.InternalName}')`;

      const postRequestOptions: any = {
        url: postRequestUrl,
        headers: {
          'accept': 'application/json;odata=nometadata'
        },
        responseType: 'json'
      };

      await request.post(postRequestOptions);

      if (typeof args.options.fieldPosition === 'undefined') {
        if (this.debug) {
          logger.logToStderr(`No field position.`);
        }

        return;
      }

      if (this.debug) {
        logger.logToStderr(`moveField request...`);
        logger.logToStderr(args.options.fieldPosition);
      }

      if (this.verbose) {
        logger.logToStderr(`Moving the field ${args.options.fieldId || args.options.fieldTitle} to the position ${args.options.fieldPosition} from view ${args.options.viewId || args.options.viewTitle}...`);
      }
      const moveRequestUrl: string = `${args.options.webUrl}/_api/web/lists${listSelector}/views${viewSelector}/viewfields/moveviewfieldto`;

      const moveRequestOptions: any = {
        url: moveRequestUrl,
        headers: {
          'accept': 'application/json;odata=nometadata'
        },
        data: { 'field': currentField.InternalName, 'index': args.options.fieldPosition },
        responseType: 'json'
      };

      await request.post(moveRequestOptions);
      // REST post call doesn't return anything
    }
    catch (err: any) {
      this.handleRejectedODataJsonPromise(err);
    }
  }

  private getField(options: Options, listSelector: string): Promise<{ InternalName: string; }> {
    const fieldSelector: string = options.fieldId ? `/getbyid('${encodeURIComponent(options.fieldId)}')` : `/getbyinternalnameortitle('${encodeURIComponent(options.fieldTitle as string)}')`;
    const getRequestUrl: string = `${options.webUrl}/_api/web/lists${listSelector}/fields${fieldSelector}`;

    const requestOptions: any = {
      url: getRequestUrl,
      headers: {
        'accept': 'application/json;odata=nometadata'
      },
      responseType: 'json'
    };

    return request.get(requestOptions);
  }
}

module.exports = new SpoListViewFieldAddCommand();