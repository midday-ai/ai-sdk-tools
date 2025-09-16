# AI SDK DevTools Chrome Extension

A Chrome extension that provides debugging and monitoring capabilities for AI SDK applications directly in Chrome DevTools.

## Features

- **Real-time Event Monitoring**: Capture and view AI SDK events as they happen
- **Stream Interception**: Automatically intercept and parse AI SDK streams
- **State Management**: Monitor and explore AI SDK store states
- **Filtering & Search**: Filter events by type, tool name, or search content
- **Chrome DevTools Integration**: Native integration with Chrome DevTools

## Installation

### Development

1. Clone the repository
2. Install dependencies and build:
   ```bash
   bun run setup
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Production

1. Build the extension:
   ```bash
   bun run build
   ```

2. Package the extension:
   ```bash
   bun run package
   ```

3. Install the generated `ai-sdk-devtools.zip` file in Chrome

## Usage

1. Open Chrome DevTools (F12)
2. Look for the "AI SDK" tab in the DevTools panel
3. Navigate to a page using AI SDK
4. The extension will automatically start capturing events

## Architecture

The extension consists of several components:

- **Content Script**: Injected into web pages to capture AI SDK events
- **Background Script**: Manages communication between content script and DevTools
- **DevTools Panel**: The main UI that displays captured events and states
- **Injected Script**: Runs in page context to access AI SDK stores

## Development

### Building

```bash
# Development build with watch mode
bun run dev

# Production build
bun run build

# Clean build artifacts
bun run clean
```

### Project Structure

```
src/
├── background.ts          # Background script
├── content.ts            # Content script
├── devtools-panel.tsx    # DevTools panel React component
└── injected.ts           # Injected script for page context

dist/                     # Built extension files
├── manifest.json
├── background.js
├── content.js
├── devtools-panel.js
└── devtools.html
```

## API

The extension exposes several APIs for interacting with AI SDK applications:

### Content Script API

- `toggleCapturing()`: Start/stop event capture
- `clearEvents()`: Clear captured events
- `getEvents()`: Get all captured events
- `getStores()`: Get detected AI SDK stores
- `getStoreState(storeId)`: Get state of a specific store

### Injected Script API

- `window.__AI_SDK_DEVTOOLS__.getStores()`: Get available stores
- `window.__AI_SDK_DEVTOOLS__.getStore(id)`: Get specific store
- `window.__AI_SDK_DEVTOOLS__.getStoreState(id)`: Get store state

## Permissions

The extension requires the following permissions:

- `activeTab`: Access to the current tab
- `storage`: Store extension settings
- `scripting`: Inject content scripts
- `<all_urls>`: Access to all websites (for AI SDK detection)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension
5. Submit a pull request

## License

MIT License - see LICENSE file for details
