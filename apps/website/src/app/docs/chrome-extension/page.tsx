import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Chrome Extension Documentation - AI SDK Tools",
  description:
    "Chrome extension for debugging AI SDK applications directly in Chrome DevTools. Native integration with real-time monitoring, stream interception, and state management exploration.",
  keywords: [
    "AI SDK chrome extension",
    "AI debugging extension",
    "Chrome DevTools AI",
    "AI SDK browser tools",
    "AI debugging browser",
    "AI monitoring extension",
    "AI tools chrome extension",
    "AI SDK browser debugging",
    "AI application debugging",
    "AI tools browser tools",
  ],
  openGraph: {
    title: "Chrome Extension Documentation - AI SDK Tools",
    description:
      "Chrome extension for debugging AI SDK applications directly in Chrome DevTools with native integration and real-time monitoring.",
    url: "https://ai-sdk-tools.dev/docs/chrome-extension",
  },
  twitter: {
    title: "Chrome Extension Documentation - AI SDK Tools",
    description:
      "Chrome extension for debugging AI SDK applications directly in Chrome DevTools with native integration and real-time monitoring.",
  },
  alternates: {
    canonical: "/docs/chrome-extension",
  },
};

export default function ChromeExtensionPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Chrome Extension
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Chrome extension for debugging AI SDK applications directly in
              Chrome DevTools. Native integration with real-time monitoring,
              stream interception, and state management exploration.
            </p>

            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
              <span className="text-[#d4d4d4] text-xs font-mono">
                Chrome Web Store (Coming Soon)
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    "Chrome Web Store (Coming Soon)",
                  )
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "Chrome Web Store (Coming Soon)" to clipboard`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-label="Copy command"
                >
                  <title>Copy command to clipboard</title>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔧 Native DevTools Integration
              </div>
              <p className="text-xs text-secondary">
                Seamless integration with Chrome DevTools panel
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                ⚡ Real-time Event Monitoring
              </div>
              <p className="text-xs text-secondary">
                Capture and view AI SDK events as they happen
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔍 Stream Interception
              </div>
              <p className="text-xs text-secondary">
                Automatically intercept and parse AI SDK streams
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🏪 State Management
              </div>
              <p className="text-xs text-secondary">
                Monitor and explore AI SDK store states
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔍 Filtering & Search
              </div>
              <p className="text-xs text-secondary">
                Filter events by type, tool name, or search content
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🌐 Universal Compatibility
              </div>
              <p className="text-xs text-secondary">
                Works on any website using AI SDK
              </p>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Installation</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Development Installation
              </h3>
              <p className="text-sm text-secondary mb-4">
                For development and testing, you can build and install the
                extension locally:
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    1. Clone and build
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`git clone https://github.com/midday-ai/ai-sdk-tools
cd ai-sdk-tools/packages/chrome-extension
bun run setup`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    2. Load in Chrome
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • Open Chrome and go to <code>chrome://extensions/</code>
                    </li>
                    <li>• Enable "Developer mode"</li>
                    <li>
                      • Click "Load unpacked" and select the <code>dist</code>{" "}
                      folder
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Production Installation
              </h3>
              <p className="text-sm text-secondary mb-4">
                Once available on the Chrome Web Store:
              </p>

              <div className="space-y-2 text-xs text-secondary">
                <p>1. Visit the Chrome Web Store listing</p>
                <p>2. Click "Add to Chrome"</p>
                <p>3. Open Chrome DevTools (F12)</p>
                <p>4. Look for the "AI SDK" tab</p>
                <p>5. Start debugging your AI applications</p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Usage</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Getting Started</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-full">
                    <div className="text-sm font-medium mb-3">
                      1. Open DevTools
                    </div>
                    <p className="text-xs text-secondary">
                      Press F12 or right-click and select "Inspect" to open
                      Chrome DevTools.
                    </p>
                  </div>
                  <div className="h-full">
                    <div className="text-sm font-medium mb-3">
                      2. Find AI SDK Tab
                    </div>
                    <p className="text-xs text-secondary">
                      Look for the "AI SDK" tab in the DevTools panel (next to
                      Console, Network, etc.).
                    </p>
                  </div>
                  <div className="h-full">
                    <div className="text-sm font-medium mb-3">
                      3. Navigate to AI App
                    </div>
                    <p className="text-xs text-secondary">
                      Go to any website using AI SDK - the extension will
                      automatically detect it.
                    </p>
                  </div>
                  <div className="h-full">
                    <div className="text-sm font-medium mb-3">
                      4. Start Debugging
                    </div>
                    <p className="text-xs text-secondary">
                      The extension will automatically start capturing events
                      and show them in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ What You'll See</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-3">Event Stream</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Real-time AI SDK events</li>
                    <li>• Tool calls and their results</li>
                    <li>• Message streaming events</li>
                    <li>• Error handling and debugging info</li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">State Explorer</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• AI SDK store states</li>
                    <li>• Message history and metadata</li>
                    <li>• Tool call parameters and results</li>
                    <li>• Performance metrics and timing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Architecture</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ Extension Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-3">Content Script</div>
                <p className="text-xs text-secondary mb-2">
                  Injected into web pages to capture AI SDK events and
                  communicate with the DevTools panel.
                </p>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>• Event capture and filtering</li>
                  <li>• Stream interception</li>
                  <li>• Communication bridge</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">
                  Background Script
                </div>
                <p className="text-xs text-secondary mb-2">
                  Manages communication between content script and DevTools
                  panel, handles extension lifecycle.
                </p>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>• Message routing</li>
                  <li>• State management</li>
                  <li>• Extension permissions</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">DevTools Panel</div>
                <p className="text-xs text-secondary mb-2">
                  The main UI that displays captured events and states in the
                  Chrome DevTools interface.
                </p>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>• Event visualization</li>
                  <li>• State exploration</li>
                  <li>• Filtering and search</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">Injected Script</div>
                <p className="text-xs text-secondary mb-2">
                  Runs in page context to access AI SDK stores and provide
                  direct state inspection.
                </p>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>• Store access</li>
                  <li>• State inspection</li>
                  <li>• Direct API calls</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Development */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Development</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Building the Extension
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Development build with watch mode
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`bun run dev`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Production build
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`bun run build`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Clean build artifacts
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`bun run clean`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Project Structure</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`src/
├── background.ts          # Background script
├── content.ts            # Content script
├── devtools-panel.tsx    # DevTools panel React component
└── injected.ts           # Injected script for page context

dist/                     # Built extension files
├── manifest.json
├── background.js
├── content.js
├── devtools-panel.js
└── devtools.html`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">API</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Content Script API</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Event Management
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • <code>toggleCapturing()</code> - Start/stop event
                      capture
                    </li>
                    <li>
                      • <code>clearEvents()</code> - Clear captured events
                    </li>
                    <li>
                      • <code>getEvents()</code> - Get all captured events
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Store Access</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • <code>getStores()</code> - Get detected AI SDK stores
                    </li>
                    <li>
                      • <code>getStoreState(storeId)</code> - Get state of a
                      specific store
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Injected Script API
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Access from page context
window.__AI_SDK_DEVTOOLS__.getStores()        // Get available stores
window.__AI_SDK_DEVTOOLS__.getStore(id)        // Get specific store
window.__AI_SDK_DEVTOOLS__.getStoreState(id)   // Get store state`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Permissions</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ Required Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-3">Core Permissions</div>
                <ul className="space-y-2 text-xs text-secondary">
                  <li>
                    • <code>activeTab</code> - Access to the current tab
                  </li>
                  <li>
                    • <code>storage</code> - Store extension settings
                  </li>
                  <li>
                    • <code>scripting</code> - Inject content scripts
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">AI SDK Detection</div>
                <ul className="space-y-2 text-xs text-secondary">
                  <li>
                    • <code>&lt;all_urls&gt;</code> - Access to all websites for
                    AI SDK detection
                  </li>
                  <li>
                    • <code>devtools</code> - DevTools panel integration
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-secondary mt-4">
              These permissions are necessary for the extension to detect and
              debug AI SDK applications across different websites while
              maintaining user privacy and security.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Examples</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Debugging a Chat Application
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-secondary">
                  <p>1. Open your AI-powered chat application in Chrome</p>
                  <p>
                    2. Open Chrome DevTools (F12) and go to the "AI SDK" tab
                  </p>
                  <p>
                    3. Start a conversation and watch events stream in real-time
                  </p>
                  <p>
                    4. Use filters to focus on specific tool calls or message
                    types
                  </p>
                  <p>
                    5. Inspect store state to see message history and metadata
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Monitoring Tool Calls
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-secondary">
                  <p>
                    1. Filter events by "tool-call-start" to see when tools are
                    invoked
                  </p>
                  <p>
                    2. Click on tool call events to see parameters and execution
                    details
                  </p>
                  <p>
                    3. Monitor "tool-call-result" events to see outputs and
                    execution times
                  </p>
                  <p>
                    4. Use search to find specific tool calls or error messages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Troubleshooting</h2>

          <div className="space-y-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Common Issues</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Extension not detecting AI SDK?
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Make sure the website is using AI SDK</li>
                    <li>• Check that the extension is enabled</li>
                    <li>• Refresh the page after installing the extension</li>
                    <li>• Check the browser console for error messages</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Events not showing?
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • Ensure the AI application is actively using AI SDK
                    </li>
                    <li>• Check if event capturing is enabled</li>
                    <li>• Try clearing events and starting fresh</li>
                    <li>• Verify the extension has proper permissions</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    DevTools tab missing?
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Make sure the extension is properly installed</li>
                    <li>• Check that DevTools is open on a page with AI SDK</li>
                    <li>• Try refreshing the DevTools panel</li>
                    <li>• Reinstall the extension if necessary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Contributing</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ How to Contribute</h3>
            <div className="space-y-4">
              <div className="text-sm text-secondary">
                <p>1. Fork the repository</p>
                <p>2. Create a feature branch</p>
                <p>3. Make your changes</p>
                <p>4. Test the extension thoroughly</p>
                <p>5. Submit a pull request</p>
              </div>

              <div className="mt-6">
                <a
                  href="https://github.com/midday-ai/ai-sdk-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm inline-block"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">
              Ready to Debug AI Applications?
            </h2>
            <p className="text-xs text-secondary font-light">
              Install the Chrome extension and start debugging AI SDK
              applications with native DevTools integration.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/docs/quickstart"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Quickstart →
              </Link>
              <Link
                href="/docs/devtools"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Devtools Docs →
              </Link>
              <a
                href="https://github.com/midday-ai/ai-sdk-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                GitHub →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
