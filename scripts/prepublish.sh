#!/bin/bash
set -e

echo "Cleaning..."
yarn clean

echo "Building coc-ember..."
yarn build:js

echo "Bundling UELS addons..."
yarn build:addons
