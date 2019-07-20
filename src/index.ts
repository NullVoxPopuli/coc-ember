import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  TransportKind,
  LanguageClientOptions,
  WorkspaceConfiguration,
  ProvideCompletionItemsSignature,
} from 'coc.nvim';
import {
  TextDocument,
  Position,
  CompletionItem,
  CompletionList,
  InsertTextFormat,
  DocumentSelector,
} from 'vscode-languageserver-protocol';
import { CompletionContext } from 'vscode-languageserver-protocol';
import { CancellationToken } from 'vscode-jsonrpc';
import fs from 'fs';
import path from 'path';
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

const sections = [
  'vetur',
  'emmet',
  'html',
  'javascript',
  'typescript',
  'prettier',
  'stylusSupremacy',
];

function getConfig(config: WorkspaceConfiguration): any {
  const res = {};
  for (const section of sections) {
    const o = config.get<any>(section);
    res[section] = o || {};
  }
  return res;
}

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context;
  const c = workspace.getConfiguration();
  const config = c.get('vetur') as any;
  const enable = config.enable;
  if (enable === false) return;
  let file: string;
  const devPath = config.dev && config.dev.vlsPath; // config.get<string>('dev.vlsPath', null)
  if (devPath && fs.existsSync(devPath)) {
    file = path.join(devPath, 'dist/vueServerMain.js');
    if (!fs.existsSync(file)) {
      workspace.showMessage(`vetur server module "${file}" not found!`, 'error');
      return;
    }
  } else {
    file = requireFunc.resolve('vue-language-server');
    if (!file) {
      workspace.showMessage('vue-language-server module not found!', 'error');
      return;
    }
  }
  const selector: DocumentSelector = [
    {
      language: 'vue',
      scheme: 'file',
    },
  ];

  const serverOptions: ServerOptions = {
    module: file,
    args: ['--node-ipc'],
    transport: TransportKind.ipc,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || [],
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.[tj]s', true, false, true),
    },
    outputChannelName: 'vetur',
    initializationOptions: {
      config: getConfig(c),
    },
    middleware: {
      provideCompletionItem: (
        document: TextDocument,
        position: Position,
        context: CompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature
      ) => {
        return Promise.resolve(next(document, position, context, token)).then(
          (res: CompletionItem[] | CompletionList) => {
            const doc = workspace.getDocument(document.uri);
            if (!doc || !res) return [];
            let items: CompletionItem[] = res.hasOwnProperty('isIncomplete')
              ? (res as CompletionList).items
              : (res as CompletionItem[]);
            const pre = doc.getline(position.line).slice(0, position.character);
            // searching for class name
            if (/(^|\s)\.\w*$/.test(pre)) {
              items = items.filter(o => o.label.startsWith('.'));
              items.forEach(fixItem);
            }
            if (context.triggerCharacter == ':' || /\:\w*$/.test(pre)) {
              items = items.filter(o => o.label.startsWith(':'));
              items.forEach(fixItem);
            }
            return items;
          }
        );
      },
    },
  };

  const client = new LanguageClient('vetur', 'Vetur Language Server', serverOptions, clientOptions);

  subscriptions.push(services.registLanguageClient(client));
}

function fixItem(item: CompletionItem): void {
  item.data = item.data || {};
  item.data.abbr = item.label;
  item.label = item.label.slice(1);
  item.textEdit = null;
  item.insertTextFormat = InsertTextFormat.PlainText;
}
