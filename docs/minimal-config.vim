" Steps for testing coc-ember works in isolatio.
" 1. Have an ember project.
" 2. Launch: nvim -u path/to/this/file
" 3. Test that language server features are present
"    in the ember project

" All Plugins are declared in here.
" The argument to begin is where they are stored on disk
call plug#begin('~/.local/share/nvim/plugged')

  " Highlighting and language support
  Plug 'leafgarland/typescript-vim'
  Plug 'joukevandermaas/vim-ember-hbs'

  " CoC / Intellisense
  Plug 'neoclide/coc.nvim', {'do': 'yarn install --frozen-lockfile'}
  Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}

call plug#end()

""""""""""""""""""""""
" CoC configuration
""""""""""""""""""""""

" Someday coc-ember will be in this list
"  - auto updates
"  - in Plug, updates are all manual
let g:coc_global_extensions = [
  \ 'coc-tsserver',
  \ 'coc-css',
  \ 'coc-json',
  \ 'coc-html',
  \ 'coc-vimlsp',
  \ 'coc-highlight'
\ ]


" everything from here below is optional and is just suggestion.

" Personal hotkey preferences to make testing easier.
let mapleader = "\'"
let maplocalleader = "\'"

"" Hot Keys
nnoremap <silent> <space>c :<C-u>CocList commands<cr>
inoremap <silent><expr> <c-space> coc#refresh()
" Remap keys for gotos
nmap <silent> <leader>gd <Plug>(coc-definition)
nmap <silent> <leader>gy <Plug>(coc-type-definition)
nmap <silent> <leader>gi <Plug>(coc-implementation)
nmap <silent> <leader>gr <Plug>(coc-references)

"" Remap for code action
nmap <leader>ga <Plug>(coc-codeaction)
" Remap for rename current word
nmap <leader>rn <Plug>(coc-rename)
" Remap for format selected region
vmap <leader>f  <Plug>(coc-format-selected)
nmap <leader>f <Plug>(coc-format-selected)

"" Suggestion UX
"" https://github.com/neoclide/coc.nvim/wiki/Completion-with-sources#improve-completion-experience
"" Navigation
inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"

" NOTE: using tab for this makes TAB not work as normal tab insersion...
" Use tab for trigger completion with characters ahead and navigate.
" Use command ':verbose imap <tab>' to make sure tab is not mapped by other plugin.
" inoremap <silent><expr> <TAB> pumvisible() ? "\<C-n>" : <SID>check_back_space() ? "\<TAB>" : coc#refresh()

inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

"" Use enter to confirm completion
inoremap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"

"" Close preview window when completion is done.
autocmd! CompleteDone * if pumvisible() == 0 | pclose | endif

