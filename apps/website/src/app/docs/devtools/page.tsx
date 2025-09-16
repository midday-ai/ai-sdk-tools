import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "DevTools Documentation - AI SDK Tools",
  description:
    "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls, performance metrics, and streaming events with advanced filtering and search.",
  keywords: [
    "AI SDK devtools",
    "AI debugging tools",
    "AI monitoring",
    "AI tool calls debugging",
    "AI performance metrics",
    "AI streaming events",
    "AI development tools",
    "AI SDK debugging",
    "AI application monitoring",
    "AI tools debugging",
  ],
  openGraph: {
    title: "DevTools Documentation - AI SDK Tools",
    description:
      "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls and performance metrics.",
    url: "https://ai-sdk-tools.dev/docs/devtools",
  },
  twitter: {
    title: "DevTools Documentation - AI SDK Tools",
    description:
      "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls and performance metrics.",
  },
  alternates: {
    canonical: "/docs/devtools",
  },
};

export default function DevtoolsPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Devtools
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Powerful debugging and monitoring tool for AI applications.
              Real-time insights into tool calls, performance metrics, and
              streaming events with advanced filtering and search.
            </p>

            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
              <span className="text-[#d4d4d4] text-xs font-mono">
                npm i @ai-sdk-tools/devtools
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText("npm i @ai-sdk-tools/devtools")
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "npm i @ai-sdk-tools/devtools" to clipboard`}
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
              <div className="text-sm font-medium mb-3">
                🎯 Real-time Event Monitoring
              </div>
              <p className="text-xs text-secondary">
                Track all AI streaming events as they happen
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔍 Tool Call Debugging
              </div>
              <p className="text-xs text-secondary">
                See tool calls, parameters, results, and execution times
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                📊 Performance Metrics
              </div>
              <p className="text-xs text-secondary">
                Monitor streaming speed (tokens/second, characters/second)
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">🔍 Event Filtering</div>
              <p className="text-xs text-secondary">
                Filter events by type, tool name, or search queries
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🎨 Context Insights
              </div>
              <p className="text-xs text-secondary">
                Visualize token usage and context window utilization
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                ⚡ Stream Interception
              </div>
              <p className="text-xs text-secondary">
                Automatically capture events from AI SDK streams
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Quick Start</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Basic Usage</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { AIDevtools } from '@ai-sdk-tools/devtools';

function App() {
  return (
    <div>
      {/* Your AI app components */}
      
      {/* Add the devtools component - only in development */}
      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </div>
  );
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ With useChat Integration
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useChat } from '@ai-sdk-tools/store';
import { AIDevtools } from '@ai-sdk-tools/devtools';
import { DefaultChatTransport } from 'ai';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    }),
    ...
  });

  return (
    <div>
      {/* Your chat UI */}
      {process.env.NODE_ENV === "development" && <AIDevtools />}
    </div>
  );
}`),
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
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🎯 Event Monitoring</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  • <strong>Tool calls</strong> - Start, result, and error
                  events
                </li>
                <li>
                  • <strong>Message streaming</strong> - Text chunks,
                  completions, and deltas
                </li>
                <li>
                  • <strong>Step tracking</strong> - Multi-step AI processes
                </li>
                <li>
                  • <strong>Error handling</strong> - Capture and debug errors
                </li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                🔍 Advanced Filtering
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  • Filter by event type (tool calls, text events, errors, etc.)
                </li>
                <li>• Filter by tool name</li>
                <li>• Search through event data and metadata</li>
                <li>• Quick filter presets</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                📊 Performance Metrics
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Real-time streaming speed (tokens/second)</li>
                <li>• Character streaming rate</li>
                <li>• Context window utilization</li>
                <li>• Event timing and duration</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🎨 Visual Interface</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Resizable panel (drag to resize)</li>
                <li>• Live event indicators</li>
                <li>• Color-coded event types</li>
                <li>• Context circle visualization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Configuration</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              ◇ Advanced Configuration
            </h3>
            <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`<AIDevtools
  enabled={true}
  maxEvents={1000}
  modelId="gpt-4o" // For context insights
  config={{
    position: "bottom", // or "right", "overlay"
    height: 400,
    streamCapture: {
      enabled: true,
      endpoint: "/api/chat",
      autoConnect: true
    },
    throttle: {
      enabled: true,
      interval: 100, // ms
      includeTypes: ["text-delta"] // Only throttle high-frequency events
    }
  }}
  debug={false} // Enable debug logging
/>`),
                }}
              />
            </div>
          </div>
        </section>

        {/* Advanced Usage */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Advanced Usage</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Manual Event Integration
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useAIDevtools } from '@ai-sdk-tools/devtools';

function MyComponent() {
  const { 
    events, 
    clearEvents, 
    toggleCapturing 
  } = useAIDevtools({
    maxEvents: 500,
    onEvent: (event) => {
      console.log('New event:', event);
    }
  });

  return (
    <div>
      <button onClick={clearEvents}>Clear Events</button>
      <button onClick={toggleCapturing}>Toggle Capture</button>
      <div>Events: {events.length}</div>
    </div>
  );
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Event Filtering</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`const { filterEvents, getUniqueToolNames, getEventStats } = useAIDevtools();

// Filter events
const toolCallEvents = filterEvents(['tool-call-start', 'tool-call-result']);
const errorEvents = filterEvents(['error']);
const searchResults = filterEvents(undefined, 'search query');

// Get statistics
const stats = getEventStats();
const toolNames = getUniqueToolNames();`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Event Types</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ Captured Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-3">Tool Events</div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>
                    • <code>tool-call-start</code> - Tool call initiated
                  </li>
                  <li>
                    • <code>tool-call-result</code> - Tool call completed
                    successfully
                  </li>
                  <li>
                    • <code>tool-call-error</code> - Tool call failed
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">Message Events</div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>
                    • <code>message-start</code> - Message streaming started
                  </li>
                  <li>
                    • <code>message-chunk</code> - Message chunk received
                  </li>
                  <li>
                    • <code>message-complete</code> - Message completed
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">Text Events</div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>
                    • <code>text-start</code> - Text streaming started
                  </li>
                  <li>
                    • <code>text-delta</code> - Text delta received
                  </li>
                  <li>
                    • <code>text-end</code> - Text streaming ended
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">System Events</div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>
                    • <code>finish</code> - Stream finished
                  </li>
                  <li>
                    • <code>error</code> - Error occurred
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Chrome Extension */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Chrome Extension</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              ◇ Native DevTools Integration
            </h3>
            <p className="text-sm text-secondary mb-6">
              For even better debugging experience, install our Chrome extension
              that provides native integration with Chrome DevTools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-3">Features</div>
                <ul className="space-y-2 text-xs text-secondary">
                  <li>• Native Chrome DevTools integration</li>
                  <li>• Real-time event monitoring</li>
                  <li>• Stream interception and parsing</li>
                  <li>• State management exploration</li>
                  <li>• Works on any website using AI SDK</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">Installation</div>
                <div className="space-y-2 text-xs text-secondary">
                  <p>1. Download from Chrome Web Store</p>
                  <p>2. Open Chrome DevTools (F12)</p>
                  <p>3. Look for "AI SDK" tab</p>
                  <p>4. Start debugging your AI apps</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/docs/chrome-extension"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm inline-block"
              >
                Learn More About Chrome Extension →
              </Link>
            </div>
          </div>
        </section>

        {/* Development */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Development</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Debug Mode</h3>
              <p className="text-sm text-secondary mb-4">
                Enable debug logging to see detailed event information:
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Component level
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`<AIDevtools debug={true} />`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Global level</div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`window.__AI_DEVTOOLS_DEBUG = true;`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Requirements</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• React 16.8+</li>
                <li>• AI SDK React package</li>
                <li>• Modern browser with fetch API support</li>
                <li>• Development environment for best experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Examples</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Basic Integration</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { AIDevtools } from '@ai-sdk-tools/devtools'

function App() {
  return (
    <div>
      <Chat />
      
      {process.env.NODE_ENV === 'development' && (
        <AIDevtools />
      )}
    </div>
  )
}

// Automatically tracks:
// - Tool calls
// - State changes  
// - Performance metrics
// - Error handling`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Custom Event Handling
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useAIDevtools } from '@ai-sdk-tools/devtools'

function CustomDebugger() {
  const { events, clearEvents, filterEvents } = useAIDevtools({
    maxEvents: 100,
    onEvent: (event) => {
      if (event.type === 'tool-call-start') {
        console.log('Tool started:', event.data.toolName)
      }
    }
  })

  const toolEvents = filterEvents(['tool-call-start', 'tool-call-result'])
  
  return (
    <div>
      <button onClick={clearEvents}>Clear</button>
      <div>Tool Events: {toolEvents.length}</div>
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">
              Ready to Debug Your AI Apps?
            </h2>
            <p className="text-xs text-secondary font-light">
              Install the devtools package and start debugging your AI
              applications with powerful insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/docs/quickstart"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Quickstart →
              </Link>
              <Link
                href="/docs/chrome-extension"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Chrome Extension →
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
