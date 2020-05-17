#!/bin/bash
set -ex

currentDir=$PWD
addonDir="$PWD/addons/"

if [ ! -d "$addonDir/node_modules" ]; then
  cd $addonDir
  yarn
  cd $currentDir
fi

cp -r $addonDir lib/
