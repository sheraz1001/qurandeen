#!/bin/bash
set -e
echo "=== Installing root dependencies ==="
npm install
echo "=== Installing client dependencies ==="
cd client && npm install && npm run build
cd ..
echo "=== Pre-rendering pages for SEO ==="
node server/prerenderBuild.js
echo "=== Build complete ==="
