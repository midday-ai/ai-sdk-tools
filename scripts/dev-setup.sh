#!/bin/bash

# Development setup script for AI SDK Tools monorepo
# This script sets up the workspace for local development

echo "🚀 Setting up AI SDK Tools for development..."

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build all packages
echo "🔨 Building packages..."
bun run build

# Link packages for local development
echo "🔗 Setting up local package linking..."

# For local development, we can use workspace:* in dev dependencies
# This allows us to work with local versions during development
echo "✅ Development setup complete!"
echo ""
echo "Available commands:"
echo "  bun run dev          - Start development mode for all packages"
echo "  bun run build        - Build all packages"
echo "  bun run changeset    - Create a new changeset"
echo "  bun run type-check   - Run type checking for all packages"
echo ""
echo "To create a new changeset:"
echo "  bun run changeset"
echo ""
echo "To publish packages:"
echo "  bun run release"
