#!/bin/bash
set -e

echo "Cleaning..."
yarn clean

echo "Building coc-ember..."
yarn build:js

echo "Building and Bundling the unstable/experimental Ember Language Server..."
yarn build:language-server

echo "Bundling UELS addons..."
yarn build:addons
