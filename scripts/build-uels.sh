#!/bin/bash
set  -ex

tmpDir="tmp/UELS"

mkdir -p $tmpDir
cd $tmpDir
git clone https://github.com/lifeart/ember-language-server.git
cd ember-language-server 
git checkout component-context-info
yarn