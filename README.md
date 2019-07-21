# ember language server extension

> [ember-language-server](https://github.com/lifeart/ember-language-server) extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

```
Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}
```

### Minimum Config

1. Install [vim-plug](https://github.com/junegunn/vim-plug)
2. Setup your (neo|oni)vim's config:

    ```vim
    call plug#begin('~/.local/share/nvim/plugged')

      " Highlighting and language support
      Plug 'leafgarland/typescript-vim'
      Plug 'joukevandermaas/vim-ember-hbs'

      " CoC / Intellisense
      Plug 'neoclide/coc.nvim', {'do': 'yarn install --frozen-lockfile'}
      Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}

    call plug#end()


    let g:coc_global_extensions = [
      \ 'coc-tsserver',
      \ 'coc-css',
      \ 'coc-json',
      \ 'coc-html',
      \ 'coc-vimlsp',
      \ 'coc-highlight'
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
 - [recommended](/docs/recomended-config.vim)

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

## Screenshots


![Helper or Component](/docs/images/helper-or-component.png?raw=true)
![Helpers](/docs/images/helpers.png?raw=true)
![Error](/docs/images/error.png?raw=true)
