#!/bin/bash

set -e

VERSION=$(jq -r .version package.json)

echo "Deploying version $VERSION"
echo "Stopping furnfront"
pm2 stop furnfront || true
echo "Extracting furnfront package"
tar -xzf furnfront.tar.gz -C .
echo "Starting furnfront"
pm2 start .output/server/index.mjs --name furnfront
echo "Done"


