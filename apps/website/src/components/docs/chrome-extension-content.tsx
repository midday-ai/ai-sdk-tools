"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function ChromeExtensionContent() {
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
                chrome-extension
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText("chrome-extension")
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "chrome-extension" to clipboard`}
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

        {/* What it does */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">What it does</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                🔧 DevTools Integration
              </h3>
              <p className="text-sm text-secondary">
                Native integration with Chrome DevTools for seamless debugging
                experience.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                🌊 Stream Interception
              </h3>
              <p className="text-sm text-secondary">
                Intercept and monitor AI streaming events in real-time directly
                in the browser.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">📊 State Explorer</h3>
              <p className="text-sm text-secondary">
                Explore and inspect AI application state with a visual state
                explorer.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔍 Tool Call Monitor</h3>
              <p className="text-sm text-secondary">
                Monitor all AI tool calls with detailed parameters, responses,
                and execution times.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">⚡ Performance</h3>
              <p className="text-sm text-secondary">
                Track performance metrics and identify bottlenecks in your AI
                workflows.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🎨 Customizable</h3>
              <p className="text-sm text-secondary">
                Customize the DevTools panel with themes and layout options.
              </p>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Installation</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">
                1. Download the Extension
              </h3>
              <p className="text-sm text-secondary mb-4">
                Download the extension from the Chrome Web Store or build from
                source:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`# Clone the repository
git clone https://github.com/midday-ai/ai-sdk-tools.git

# Navigate to chrome-extension directory
cd ai-sdk-tools/packages/chrome-extension

# Install dependencies
npm install

# Build the extension
npm run build`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">2. Load in Chrome</h3>
              <p className="text-sm text-secondary mb-4">
                Load the extension in Chrome Developer Mode:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the dist folder
4. The extension will appear in your extensions list`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">3. Open DevTools</h3>
              <p className="text-sm text-secondary mb-4">
                Open Chrome DevTools and look for the "AI SDK Tools" tab:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`1. Open your AI application in Chrome
2. Press F12 or right-click → Inspect
3. Look for "AI SDK Tools" tab in DevTools
4. Click to open the debugging panel`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Features</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Real-time Monitoring</h3>
              <p className="text-sm text-secondary mb-4">
                Monitor AI events in real-time as they happen in your
                application:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Events are automatically captured
const { messages, handleSubmit } = useChat({
  tools: {
    weather: {
      description: 'Get weather information',
      parameters: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        // This will be monitored in DevTools
        return { weather: 'sunny' }
      },
    },
  },
})`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">State Explorer</h3>
              <p className="text-sm text-secondary mb-4">
                Explore and inspect your AI application state:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// State is automatically tracked
- Messages array
- Input state
- Loading states
- Error states
- Tool call history
- Performance metrics`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Stream Interception</h3>
              <p className="text-sm text-secondary mb-4">
                Intercept and monitor streaming events:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Streaming events are captured
- Message chunks
- Tool call progress
- Error events
- Completion events
- Performance metrics`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">API Reference</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Extension API</h3>
              <p className="text-sm text-secondary mb-4">
                The extension provides several APIs for debugging:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Extension APIs
window.AISDKTools = {
  getState: () => state, // Get current state
  getEvents: () => events, // Get all events
  clearEvents: () => {}, // Clear events
  exportData: () => {}, // Export data
  toggleMonitoring: () => {}, // Toggle monitoring
}`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">DevTools Panel</h3>
              <p className="text-sm text-secondary mb-4">
                The DevTools panel provides a visual interface for debugging:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// DevTools Panel Features
- Event timeline
- State explorer
- Performance metrics
- Tool call details
- Error logs
- Export/import data`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-2xl font-medium mb-8">Examples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/store"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                Live Demo
              </h3>
              <p className="text-secondary mb-6">
                Try the Chrome extension with our interactive demo.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Try it out →
              </div>
            </Link>

            <a
              href="https://github.com/midday-ai/ai-sdk-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                GitHub
              </h3>
              <p className="text-secondary mb-6">
                View source code and more examples on GitHub.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                View on GitHub →
              </div>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
