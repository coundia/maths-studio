#!/usr/bin/env bash
set -e

# Change to project root directory
cd "$(dirname "$0")/.."

echo "Building Maths Studio for GitHub Pages (STATIC MODE)..."

# 1. Check for node_modules
if [ ! -d "node_modules" ]; then
  echo "Dependencies not found. Running npm install..."
  npm install
fi

echo "Running static build process..."
npm run build:ghpages

echo "Build complete! The static files are in the 'dist' folder."
