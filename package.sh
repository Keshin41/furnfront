#!/bin/sh

set -e

VERSION=$(jq -r .version package.json)

echo "Building version $VERSION"
echo "Cleaning dist folder"
rm -rf .output
echo "Building furnfront"
npm run build
echo "Packing furnfront"
tar -czf furnfront.tar.gz .output deploy.sh package.json
echo "Done"
echo "You can now deploy furnfront.tar.gz to your server and extract it there."