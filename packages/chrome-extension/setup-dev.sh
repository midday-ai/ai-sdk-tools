#!/bin/bash

echo "🚀 Setting up AI SDK DevTools Chrome Extension for development..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the chrome-extension directory"
    exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install bun first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies with bun..."
bun install

# Build the devtools package first (dependency)
echo "🔨 Building devtools package..."
cd ../devtools
bun run build
cd ../chrome-extension

# Build the extension
echo "🔨 Building Chrome extension..."
bun run build

echo "✅ Setup complete!"
echo ""
echo "To test the extension:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. Open DevTools (F12) and look for the 'AI SDK' tab"
echo "5. Navigate to a page with AI SDK to see events"
echo ""
echo "For development with auto-rebuild:"
echo "bun run dev"
echo ""
echo "Quick setup (one command):"
echo "bun run setup"
echo ""
echo "Note: This extension uses tsup for fast, consistent builds with the rest of the project!"
