import execa from 'execa';
import path from 'path';

import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  TransportKind,
  LanguageClientOptions,
  WorkspaceConfiguration,
} from 'coc.nvim';

const languageServerPath = [
  'node_modules',
  '@emberwatch',
  'ember-language-server',
];
const serverBin = ['lib', 'start-server.js'];

export async function activate(context: ExtensionContext): Promise<void> {
  let config = getConfig();
  let isEnabled = config.get<boolean>('enable', true);
  let isDebugging = config.get<boolean>('debug', false);

  console.error('config', config);
  console.log('log config', config);
  console.error('isEnabled', isEnabled);

  if (!isEnabled) return;

  let isEmberCli = await isEmberCliProject();
  console.error('isEmberCli', isEmberCli);

  if (!isEmberCli) {
    return;
  }

  let binPath = context.asAbsolutePath(
    path.join(...languageServerPath, ...serverBin)
  );

  let repoPath = context.asAbsolutePath(path.join(...languageServerPath));

  await checkRequirements(repoPath, binPath);

  let debugOptions = isDebugging
    ? { execArgv: ['--nolazy', '--inspect=6004'] }
    : {};

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

  // const serverOptions: ServerOptions = {
  //   module: serverBinFile,
  //   args: ['--node-ipc'],
  //   transport: TransportKind.ipc,
  //   options: {
  //     cwd: workspace.root,
  //     // TODO: for debugging the language server
  //     execArgv: config.execArgv || [],
  //   },
  // };

  let clientOptions = buildClientOptions();

  let client = new LanguageClient(
    'ember-language-server',
    'Ember Language Server',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(services.registLanguageClient(client));
}

function getConfig(): WorkspaceConfiguration {
  let config = workspace.getConfiguration('ember');

  return config;
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

async function isEmberCliProject(): Promise<boolean> {
  let emberCliBuildFile = await workspace.findUp('ember-cli-build.js');

  return !!emberCliBuildFile;
}

async function checkRequirements(
  repoPath: string,
  binPath: string
): Promise<void> {
  let isAlreadyBuilt = doesFileExist(binPath);

  if (isAlreadyBuilt) {
    return;
  }

  await execa.command(`yarn`, {
    cwd: repoPath,
  });
}

function doesFileExist(filePath: string): boolean {
  const result = execa.commandSync(`test -f ${filePath}`);

  return result.exitCode === 0;
}
