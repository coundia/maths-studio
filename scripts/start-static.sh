#!/usr/bin/env bash
set -e

# Change to project root directory
cd "$(dirname "$0")/.."

echo "Starting Maths Studio in STATIC MODE..."

# 1. Check for node_modules
if [ ! -d "node_modules" ]; then
  echo "Dependencies not found. Running npm install..."
  npm install
fi

echo "Starting static development server (no backend) on http://localhost:5173..."
npm run dev:static
