import { Logger } from '../../../../cli/Logger';
import GlobalOptions from '../../../../GlobalOptions';
import request from '../../../../request';
import { formatting } from '../../../../utils/formatting';
import { validation } from '../../../../utils/validation';
import SpoCommand from '../../../base/SpoCommand';
import commands from '../../commands';
import { FileSharingPrincipalType } from './FileSharingPrincipalType';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  webUrl: string;
  id?: string;
  url?: string;
}

interface SharingPrincipal {
  isActive: boolean;
  isExternal: boolean;
  name: string;
  principalType: string;
}

interface SharingInformation {
  permissionsInformation: {
    links: {
      linkDetails: {
        Invitations: {
          invitee: SharingPrincipal;
        }[];
      };
    }[];
    principals: {
      principal: SharingPrincipal;
    }[];
  };
}

interface FileSharingInformation {
  IsActive: boolean;
  IsExternal: boolean;
  PrincipalType: string;
  SharedWith: string;
}

class SpoFileSharinginfoGetCommand extends SpoCommand {
  public get name(): string {
    return commands.FILE_SHARINGINFO_GET;
  }

  public get description(): string {
    return 'Generates a sharing information report for the specified file';
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
        id: (!(!args.options.id)).toString(),
        url: (!(!args.options.url)).toString()
      });
    });
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-w, --webUrl <webUrl>'
      },
      {
        option: '-i, --id [id]'
      },
      {
        option: '-u, --url [url]'
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
    
        if (args.options.id) {
          if (!validation.isValidGuid(args.options.id)) {
            return `${args.options.id} is not a valid GUID`;
          }
        }
    
        return true;
      }
    );
  }

  #initOptionSets(): void {
    this.optionSets.push(['id', 'url']);
  }

  protected getExcludedOptionsWithUrls(): string[] | undefined {
    return ['url'];
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    if (this.verbose) {
      logger.logToStderr(`Retrieving sharing information report for the file...`);
    }

    try {
      const fileInformation = await this.getNeededFileInformation(args);
      if (this.verbose) {
        logger.logToStderr(`Retrieving sharing information report for the file with item Id  ${fileInformation.fileItemId}`);
      }

      const requestOptions: any = {
        url: `${args.options.webUrl}/_api/web/lists/getbytitle('${formatting.encodeQueryParameter(fileInformation.libraryName)}')/items(${fileInformation.fileItemId})/GetSharingInformation?$select=permissionsInformation&$Expand=permissionsInformation`,
        headers: {
          'accept': 'application/json;odata=nometadata'
        },
        responseType: 'json'
      };
      const res = await request.post<SharingInformation>(requestOptions);

      // typically, we don't do this, but in this case, we need to due to
      // the complexity of the retrieved object and the fact that we can't
      // use the generic way of simplifying the output
      if (args.options.output === 'json') {
        logger.log(res);
      }
      else {
        const fileSharingInfoCollection: FileSharingInformation[] = [];
        res.permissionsInformation.links.forEach(link => {
          link.linkDetails.Invitations.forEach(linkInvite => {
            fileSharingInfoCollection.push({
              SharedWith: linkInvite.invitee.name,
              IsActive: linkInvite.invitee.isActive,
              IsExternal: linkInvite.invitee.isExternal,
              PrincipalType: FileSharingPrincipalType[parseInt(linkInvite.invitee.principalType)]
            });
          });
        });
        res.permissionsInformation.principals.forEach(principal => {
          fileSharingInfoCollection.push({
            SharedWith: principal.principal.name,
            IsActive: principal.principal.isActive,
            IsExternal: principal.principal.isExternal,
            PrincipalType: FileSharingPrincipalType[parseInt(principal.principal.principalType)]
          });
        });

        logger.log(fileSharingInfoCollection);
      }
    }
    catch (err: any) {
      this.handleRejectedODataJsonPromise(err);
    }
  }

  private getNeededFileInformation(args: CommandArgs): Promise<{ fileItemId: number; libraryName: string; }> {
    let requestUrl: string = '';

    if (args.options.id) {
      requestUrl = `${args.options.webUrl}/_api/web/GetFileById('${escape(args.options.id as string)}')/?$select=ListItemAllFields/Id,ListItemAllFields/ParentList/Title&$expand=ListItemAllFields/ParentList`;
    }
    else {
      requestUrl = `${args.options.webUrl}/_api/web/GetFileByServerRelativePath(decodedUrl='${encodeURIComponent(args.options.url as string)}')?$select=ListItemAllFields/Id,ListItemAllFields/ParentList/Title&$expand=ListItemAllFields/ParentList`;
    }

    const requestOptions: any = {
      url: requestUrl,
      headers: {
        'accept': 'application/json;odata=nometadata'
      },
      responseType: 'json'
    };

    return request.get<{ ListItemAllFields: { Id: string; ParentList: { Title: string }; } }>(requestOptions)
      .then((res: { ListItemAllFields: { Id: string; ParentList: { Title: string }; } }): Promise<{ fileItemId: number; libraryName: string; }> => Promise.resolve({
        fileItemId: parseInt(res.ListItemAllFields.Id),
        libraryName: res.ListItemAllFields.ParentList.Title
      }));
  }
}

module.exports = new SpoFileSharinginfoGetCommand();