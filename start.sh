#!/usr/bin/env bash
set -e

# Change to project root directory
cd "$(dirname "$0")"

echo "Starting Maths Studio..."

# 1. Check for .env file
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
  else
    echo "Warning: .env file not found."
  fi
fi

# 2. Check for node_modules
if [ ! -d "node_modules" ]; then
  echo "Dependencies not found. Running npm install..."
  npm install
fi

# 3. Parse arguments or run default (dev mode)
MODE="${1:-dev}"

case "$MODE" in
  prod|production)
    echo "Building project for production..."
    npm run build
    echo "Starting production server on http://localhost:3000..."
    npm start
    ;;
  static)
    echo "Starting static development server (no backend)..."
    npm run dev:static
    ;;
  build:static)
    echo "Building static version..."
    npm run build:static
    ;;
  build:ghpages)
    echo "Building project for GitHub Pages..."
    npm run build:ghpages
    ;;
  build)
    echo "Building project..."
    npm run build
    ;;
  dev|*)
    echo "Starting development server on http://localhost:3000..."
    npm run dev
    ;;
esac
