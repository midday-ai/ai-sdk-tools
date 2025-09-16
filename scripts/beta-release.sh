#!/bin/bash

# Beta Release Script for AI SDK Tools
# This script helps create and manage beta releases

set -e

echo "🚀 AI SDK Tools Beta Release Helper"
echo "=================================="

# Check if we're in beta mode
if [ -f ".changeset/pre.json" ]; then
    echo "✅ Currently in beta mode"
    BETA_MODE=true
else
    echo "ℹ️  Not in beta mode"
    BETA_MODE=false
fi

# Function to show help
show_help() {
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Enter beta mode and create a changeset"
    echo "  version   - Version packages for beta release"
    echo "  publish   - Publish beta packages to npm"
    echo "  exit      - Exit beta mode"
    echo "  status    - Show current beta status"
    echo "  help      - Show this help message"
    echo ""
    echo "Note: Beta releases exclude the Chrome extension package"
    echo "      Only @ai-sdk-tools/store, @ai-sdk-tools/devtools, and @ai-sdk-tools/artifacts are included"
    echo ""
    echo "Examples:"
    echo "  $0 start     # Start a new beta release"
    echo "  $0 publish   # Publish current beta"
    echo "  $0 exit      # Exit beta mode"
}

# Function to start beta mode
start_beta() {
    if [ "$BETA_MODE" = true ]; then
        echo "⚠️  Already in beta mode. Use 'exit' to leave beta mode first."
        exit 1
    fi
    
    echo "🔄 Entering beta mode..."
    bun run changeset:beta
    
    echo "📝 Creating changeset..."
    bun run changeset
    
    echo "✅ Beta mode started! You can now make changes and run '$0 version' when ready."
}

# Function to version packages
version_packages() {
    if [ "$BETA_MODE" = false ]; then
        echo "⚠️  Not in beta mode. Run '$0 start' first."
        exit 1
    fi
    
    echo "🔄 Versioning packages for beta release..."
    bun run version-packages:beta
    
    echo "✅ Packages versioned! Run '$0 publish' to publish to npm."
}

# Function to publish beta
publish_beta() {
    if [ "$BETA_MODE" = false ]; then
        echo "⚠️  Not in beta mode. Run '$0 start' first."
        exit 1
    fi
    
    echo "🔄 Publishing beta packages to npm..."
    bun run release:beta
    
    echo "✅ Beta packages published! Users can install with @beta tag."
}

# Function to exit beta mode
exit_beta() {
    if [ "$BETA_MODE" = false ]; then
        echo "⚠️  Not in beta mode."
        exit 1
    fi
    
    echo "🔄 Exiting beta mode..."
    bun run changeset:exit-beta
    
    echo "✅ Exited beta mode. Ready for stable releases."
}

# Function to show status
show_status() {
    echo ""
    echo "📊 Beta Release Status"
    echo "====================="
    
    if [ "$BETA_MODE" = true ]; then
        echo "Mode: 🟡 BETA"
        if [ -f ".changeset/pre.json" ]; then
            echo "Tag: $(grep -o '"tag":"[^"]*"' .changeset/pre.json | cut -d'"' -f4)"
        fi
    else
        echo "Mode: 🟢 STABLE"
    fi
    
    echo ""
    echo "Available changesets:"
    if [ -d ".changeset" ] && [ "$(ls -A .changeset/*.md 2>/dev/null)" ]; then
        ls -la .changeset/*.md 2>/dev/null | grep -v pre.json || echo "  No changesets found"
    else
        echo "  No changesets found"
    fi
}

# Main script logic
case "${1:-help}" in
    start)
        start_beta
        ;;
    version)
        version_packages
        ;;
    publish)
        publish_beta
        ;;
    exit)
        exit_beta
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac
