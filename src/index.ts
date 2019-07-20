import execa from 'execa';

import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  TransportKind,
  LanguageClientOptions,
  ProvideCompletionItemsSignature,
} from 'coc.nvim';
import {
  TextDocument,
  Position,
  CompletionItem,
  CompletionList,
  InsertTextFormat,
} from 'vscode-languageserver-protocol';
import { CompletionContext } from 'vscode-languageserver-protocol';
import { CancellationToken } from 'vscode-jsonrpc';

const languageServerPath = './node_modules/@emberwatch/ember-language-server';
const serverBin = 'lib/start-server.js';

export async function activate(context: ExtensionContext): Promise<void> {
  let config = getConfig();

  if (config.enable === false) return;

  let devPath = config.dev && config.dev.lsPath;
  let lsPath = devPath || languageServerPath;
  let serverBinFile = `${lsPath}/${serverBin}`;

  await checkRequirements(lsPath);

  const serverOptions: ServerOptions = {
    module: serverBinFile,
    args: ['--node-ipc'],
    transport: TransportKind.ipc,
    options: {
      cwd: workspace.root,
      // TODO: for debugging the language server
      execArgv: config.execArgv || [],
    },
  };

  let clientOptions = buildClientOptions();

  let client = new LanguageClient(
    'ember-language-server',
    'Ember Language Server',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(services.registLanguageClient(client));
}

function getConfig(): any {
  let workspaceConfig = workspace.getConfiguration();

  let cocEmberConfig = workspaceConfig.get('ember') as any;

  return cocEmberConfig;
}

function buildClientOptions(): LanguageClientOptions {
  return {
    documentSelector: [
      'hbs',
      'html.handlebars',
      'handlebars',
      'typescript',
      'javascript',
    ],
    outputChannelName: 'ember-language-server',
  };
}

async function checkRequirements(languageServerPath: string): Promise<void> {
  let repoLocation = `${languageServerPath}/ember-language-server`;
  let binPath = `${repoLocation}/${serverBin}`;

  let isAlreadyBuilt = doesFileExist(binPath);

  if (isAlreadyBuilt) {
    return;
  }

  await execa.command(`yarn`, {
    cwd: repoLocation,
  });
}

function doesFileExist(filePath: string): boolean {
  const result = execa.commandSync(`test -f ${filePath}`);

  return result.exitCode === 0;
}
