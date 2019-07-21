# ember language server extension

> [ember-language-server](https://github.com/lifeart/ember-language-server) extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

## Install

```
Plug 'nullvoxpopuli/coc-ember', {'do': 'yarn install --frozen-lockfile'}
```

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
