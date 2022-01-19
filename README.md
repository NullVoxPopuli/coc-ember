# ember language server extension

> [ember-language-server](https://github.com/lifeart/ember-language-server) extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

Via Plug
```
Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}
```

Or via the automatically kept up-to-date config var:

```
let g:coc_global_extensions = [
  \ 'coc-ember'
\ ]
```

### Starting from Scratch

0. For the fanciest experience, install [the neovim nightly release](https://github.com/neovim/neovim/releases/)
1. Install [vim-plug](https://github.com/junegunn/vim-plug)
2. Setup your (neo|oni)vim's config:

    ```vim
    call plug#begin('~/.local/share/nvim/plugged')

      " Highlighting and language support
      Plug 'leafgarland/typescript-vim'
      Plug 'joukevandermaas/vim-ember-hbs'

      " CoC / Intellisense
      Plug 'neoclide/coc.nvim', {'do': 'yarn install --frozen-lockfile'}

    call plug#end()


    let g:coc_global_extensions = [
      \ 'coc-actions',
      \ 'coc-tsserver',
      \ 'coc-css',
      \ 'coc-json',
      \ 'coc-html',
      \ 'coc-vimlsp',
      \ 'coc-highlight',
      \ 'coc-ember'
    \ ]
    ```

3. Restart your editor, run `:PlugInstall`
4. Navigate to an ember project and open (neo|oni)vim.

Done :)

To test this out with neovim:
1. clone this repo
2. go to an ember project and run `nvim . -u path/to/repo/docs/minimal-config.vim`

There are two working neovim single-file configs in this repo
 - [minimal](/docs/minimal-config.vim)
 - [recommended](/docs/recommended-config.vim)

Additionally, [@NullVoxPopuli's vim config can be found here](https://github.com/NullVoxPopuli/dotfiles/blob/master/home/.config/nvim/init.vim)

## Features

[from @lifeart's PR](https://github.com/emberwatch/ember-language-server/pull/173)

- mu, pods, classic layouts support for app models definitions lookup, including js and ts files.
- mu, pods, classic layouts support for app transforms definitions lookup, including js and ts files.
- addon components and helpers definitions lookup
- AngleBracket components autocomplete (including addon-located components) for mu, pods, classic layouts.
- go-to routes, component properties, actions for mu, pods, classic
- go-to service declaration definition for classic components
- go-to ember/addon import support
- store.peekRecord, findRecord... model names autocomplete for classic
- belongsTo, hasMany model names autocomplete for classic
- transitionTo,.. routes autocomplete for classic
- named: service(name) services autocomplete
- template linting fix
- in-repo addons lookup (for classic and mu apps)

Other Features:
- Component and helper autocompletion for inline and sub expressions
- Definition providers for (enable features like "Go To Definition" or "Peek Definition"):
  - Components (in Templates)
  - Helpers (in Templates)
  - Models
  - Transforms
- Route autocompletion in link-to
- Diagnostics for ember-template-lint (if it is included in a project)

## Screenshots


![Helper or Component](/docs/images/helper-or-component.png?raw=true)
![Helpers](/docs/images/helpers.png?raw=true)
![Error](/docs/images/error.png?raw=true)


## Contributing

NOTE: development will not work on Windows machines, as all the scripts are in Bash
      and expect *nix compatibility

- fork repo
- make modifications
- Open PR &lt;3


**Testing**
- be in coc-ember root directory
- `./scripts/prepublish.sh`
- `yarn link`
- test in your own ember project via
  - :CocList extensions
  - cd to the extensions path (the folder containing a package.json, on linux: `~/.config/coc/extensions/`)
  - `yarn link coc-ember`
  - restart (neo)vim


**Debugging**

NOTE: `./scripts/prepublish.sh` needs be run initially. Afterwards, the following may be used to rebuild each sub-tool, depending on what you're changing.
- `yarn build:js` - coc-ember
- `yarn build:addons` - the UELS addons bundled with coc-ember


Generally
- be in ember project
- open (neo)vim

Viewing Logs
- Optionally launch with `NVIM_COC_LOG_LEVEL=debug nvim .`
  - This is very verbose, but is the only way to have stack traces printed
- `:CocOpenLog` to view log.
  - `:e` to refresh the log

Debugging Chrome Dev Tools
```
:let g:coc_node_args = ['--nolazy', '--inspect-brk=6045']`
:CocRestart
```
Then visit chrome://inspect/#devices

More info:
https://github.com/neoclide/coc.nvim/wiki/Debug-coc.nvim#get-result-from-console


### To use local coc-ember in your nvim

These steps are handy for reporting issues

* in `<coc-ember>`
  * `yarn`
  * `./scripts/prepublish.sh`
  * `yarn link`
* in `<your ember project>`
  * either
    * use your own configuration
      * `cd ~/.config/coc/extensions && yarn link coc-ember`
      * open nvim, don't update dependencies
    * or use a minimal config
      * `nvim -u <coc-ember>/docs/minimal-config.vim`
      * `:PlugInstall`
      * `cd ~/.config/coc/extensions && yarn link coc-ember`
      * then back in your project: `nvim -u <coc-ember>/docs/minimal-config.vim`

