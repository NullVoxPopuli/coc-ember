#!/bin/bash
set  -ex

# TODO:
#  - support a DEBUG_UELS flag
#  - conditionally clone
#  - don't overwrite locally modified fiels (in the tmpDir)
currentDir=$PWD
tmpDir="$(mktemp -d /tmp/coc-ember.XXXXXXXXX)"

# Local Testing
if [ -n "$LOCAL_DEBUG" ]; then
  tmpDir=".els--testing"
fi

mkdir -p $tmpDir
cd $tmpDir


if [ ! -d "ember-language-server" ]; then
  git clone https://github.com/lifeart/ember-language-server.git
fi

cd ember-language-server
# git checkout is a no-op if we are already on that branch
git checkout component-context-info-origin
# yarn also compiles
yarn

cd $currentDir

# clear the old compiled contents
rm -rf lib/ember-language-server/
# copy the new compiled contents to lib
cp -r ${tmpDir}/* lib/
