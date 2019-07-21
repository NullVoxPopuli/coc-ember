" Steps for testing coc-ember works in isolatio.
" 1. Have an ember project.
" 2. Launch: nvim -u path/to/this/file
" 3. Test that language server features are present
"    in the ember project


" All Plugins are declared in here.
" The argument to begin is where they are stored on disk
call plug#begin('~/.local/share/nvim/plugged')
  " Syntax / Theme
  Plug 'joshdick/onedark.vim'

  " Highlighting and language support
  Plug 'leafgarland/typescript-vim'
  Plug 'joukevandermaas/vim-ember-hbs'
  Plug 'editorconfig/editorconfig-vim'

  " CoC / Intellisense
  Plug 'neoclide/coc.nvim', {'do': 'yarn install --frozen-lockfile'}
  Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}

  " Finding
  Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
  Plug 'junegunn/fzf.vim'
  Plug 'scrooloose/nerdtree'
  Plug 'Xuyuanp/nerdtree-git-plugin'

  let NERDTreeShowHidden=1 " This also ignores .gitignore
  let NERDTreeIgnore=['.git$[[dir]]', '.swp', 'dist', 'tmp', 'node_modules', 'bower_components', '.pnp']
  let NERDTreeAutoDeleteBuffer = 1
  let NERDTreeMinimalUI = 1
  let NERDTreeDirArrows = 1

  " Linting
  Plug 'w0rp/ale'
  let g:ale_sign_error = '✘'
  let g:ale_sign_warning = '⚠'
  let g:ale_linters = {
  \   'javascript': ['eslint'],
  \   'typescript': ['eslint'],
  \   'typescript.tsx': ['eslint'],
  \}

  let g:ale_fixers = {
  \   'javascript': ['eslint'],
  \   'typescript': ['eslint'],
  \   'typescript.tsx': ['eslint'],
  \}
  let g:ale_sign_column_always = 1

  " Status
  Plug 'airblade/vim-gitgutter'
  Plug 'vim-airline/vim-airline'
  let g:airline_powerline_fonts = 1

  if !exists('g:airline_symbols')
    let g:airline_symbols = {}
  endif
  let g:airline_symbols.space = "\ua0"
  let g:airline#extensions#tabline#enabled = 0
  let g:airline#extensions#tabline#formatter = 'unique_tail_improved'


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





" True Colors (tm)
set termguicolors

"""""""""""""""""""""""""
" UI / Aesthetics
"""""""""""""""""""""""""
set background=dark
colorscheme onedark
let g:airline_theme='onedark'

"""""""""""""""""""""""""
" Editor
"""""""""""""""""""""""""
syntax on
set encoding=utf-8
set guifont=DejaVu\ Sans\ Mono

set cmdheight=1      " under statusline messages

set mouse=a          " use mouse for everything
set showmode         " show the current mode (Insert, Visual...)
set laststatus=2     " Always display status line

set cursorline       " highlight current line
set cursorcolumn     " highlight the current columnm

set ruler            " show current position

set number           " line numbers
set relativenumber   " relative line numbers

set backspace=indent,eol,start  " backspace everywhere

set autoindent   " Use current indentation level for new lines
" set smartindent  " Try to guess indentation based on previous line

" Default indentation - editorconfig should override these
set tabstop=2
set shiftwidth=2
set expandtab

" turn off smart indentation when pasting
" set pastetoggle=<F2>

set hlsearch  " highlight search terms
set list      " show whitespace

" set whitespace chars
set listchars=eol:¬,tab:>·,extends:>,precedes:<,space:·

set autoread   " Autoload reload files when they have changed on the disk

" Scrolling
set scrolloff=3  " minimum lines to keep above and below cursor

" Backup and Temp
set backupdir=~/.local/share/nvim/_backup/    " where to put backup files.
set directory=~/.local/share/nvim/_temp/      " where to put swap files.

" allow undo history to persist after closing buffer
if has('persistent_undo')
  set undodir=~/.local/share/nvim/_undo
  set undofile
end

""""""""""""""
" Spell Checker
""""""""""""""
set spellfile=~/.local/share/nvim/spell/en_us.utf-8.add


""""""""""""""""""""
" Panes / Buffers
""""""""""""""""""""
set splitright
set equalalways noequalalways " prevents splits from all auto-adjusting horizontally when one closes


""""""""""""""""""""
" Code Management
""""""""""""""""""""
set foldmethod=indent "" fold based on indentation
set foldlevel=99
set nofoldenable      "" don't open a file with folds, display the whole thing
set signcolumn=yes    "" always show the signcolumn

"" set the title of the window to the filename
set title
set titlestring=%f%(\ [%M]%)







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

