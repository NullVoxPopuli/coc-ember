import execa from 'execa';

import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  TransportKind,
  LanguageClientOptions,
} from 'coc.nvim';

const languageServerPath = './node_modules/@emberwatch/ember-language-server';
const serverBin = 'lib/start-server.js';

export async function activate(context: ExtensionContext): Promise<void> {
  console.log('attempting to activate coc-ember')
  let config = getConfig();
  console.info('config', config);

  if (config.enable === false) return;

  let isEmberCli = await isEmberCliProject();
  console.info('isEmberCli', isEmberCli);
  if (!isEmberCli) {
    return;
  }

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

async function isEmberCliProject(): Promise<boolean> {
  let emberCliBuildFile = await workspace.findUp('ember-cli-build.js');

  return !!emberCliBuildFile;
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
