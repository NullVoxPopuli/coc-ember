import { commands, LanguageClient, services, TransportKind, workspace } from 'coc.nvim';
import { readdirSync } from 'fs';
import path from 'path';

import type {
  ExtensionContext,
  LanguageClientOptions,
  ServerOptions,
  WorkspaceConfiguration,
} from 'coc.nvim';

const languageServerPath = ['node_modules', '@lifeart', 'ember-language-server'];
const serverBin = ['lib', 'start-server.js'];
const addonPath = ['lib', 'addons'];

// https://github.com/lifeart/vscode-ember/blob/master/src/constants.ts
export const COMMANDS = {
  OPEN_RELATED_FILE: 'els.openRelatedFile',
  RELOAD_PROJECT: 'els.reloadProject',
  SET_STATUS_BAR_TEXT: 'els.setStatusBarText',
  RUN_IN_EMBER_CLI: 'els.runInEmberCLI',
  GET_USER_INPUT: 'els.getUserInput',
  EXECUTE_IN_EMBER_CLI: 'els.executeInEmberCLI',
  SET_CONFIG: 'els.setConfig',
  GET_RELATED_FILES: 'els.getRelatedFiles',
  GET_KIND_USAGES: 'els.getKindUsages',
};

export async function activate(context: ExtensionContext): Promise<void> {
  try {
    await boot(context);
  } catch (e) {
    console.error(e);

    throw e;
  }
}

async function boot(context: ExtensionContext) {
  let config = getConfig();
  let isEnabled = config.get<boolean>('enable', true);
  let isDebugging = config.get<boolean>('debug', false);

  if (!isEnabled) return;

  let isEmberCli = await isEmberCliProject();

  // Not really an error, but this is important information for the first phase of debugging.
  console.info('isEmberCli', isEmberCli);

  if (!isEmberCli) {
    return;
  }

  let client = await startLanguageServerClient(context, isDebugging);

  console.info('Configuring LanguageServerClient...');

  configureClient(client, context);
}

async function startLanguageServerClient(context: ExtensionContext, isDebugging = false) {
  let binPath = context.asAbsolutePath(path.join(...languageServerPath, ...serverBin));

  console.info('UELS bin @', binPath);

  let debugOptions = isDebugging ? { execArgv: ['--nolazy', '--inspect=6004'] } : {};

  // If the extension is launched in debug mode then the debug
  // server options are used...
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: {
      module: binPath,
      transport: TransportKind.ipc,
    },
    debug: {
      module: binPath,
      transport: TransportKind.ipc,
      options: debugOptions,
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

  await client.onReady();

  return client;
}

function configureClient(client: LanguageClient, context: ExtensionContext) {
  let addonsRelPath = path.join(...addonPath);
  let addonAbsolutePath = context.asAbsolutePath(addonsRelPath);

  console.info('UELS Addons @', addonAbsolutePath);

  let cocUELSConfig = insertLocalAddonPath(addonAbsolutePath);

  commands.executeCommand(COMMANDS.SET_CONFIG, cocUELSConfig);

  context.subscriptions.push(
    commands.registerCommand(COMMANDS.GET_USER_INPUT, async (opts, callbackName, tail) => {
      try {
        console.info('Getting user input...');

        let name = await workspace.requestInput('Component Name');
        let document = tail.uri;

        console.info(callbackName, document, name, tail);

        await commands.executeCommand(callbackName, document, name, tail);
      } catch (e) {
        workspace.showMessage(e.toString(), 'error');
      }
    })
  );
}

function insertLocalAddonPath(addonPath: string) {
  let config = getUELSConfig();

  let local = config.local || {};
  let addons = local.addons || [];

  let addonPaths = readdirSync(path.join(addonPath, 'node_modules'), {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name.startsWith('els-'))
    .map((addonName) => path.join(addonPath, 'node_modules', addonName));

  console.info(addonPaths);

  return {
    ...config,
    local: {
      ...local,
      addons: [...addons, ...addonPaths],
    },
  };
}

function getConfig(): WorkspaceConfiguration {
  let config = workspace.getConfiguration('ember');

  return config;
}

function getUELSConfig(): WorkspaceConfiguration {
  let config = workspace.getConfiguration('els');

  return config;
}

function buildClientOptions(): LanguageClientOptions {
  return {
    documentSelector: ['hbs', 'html.handlebars', 'handlebars', 'typescript', 'javascript'],
    initializationOptions: {
      editor: 'vscode', // hack
    },
    outputChannelName: 'ember-language-server',
  };
}

async function isEmberCliProject(): Promise<boolean> {
  let emberCliBuildFile = await workspace.findUp('ember-cli-build.js');

  return !!emberCliBuildFile;
}
