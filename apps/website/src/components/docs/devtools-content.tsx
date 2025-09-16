"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function DevtoolsContent() {
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
              <h3 className="text-lg font-medium mb-4">🔍 Tool Calls</h3>
              <p className="text-sm text-secondary">
                Monitor all AI tool calls in real-time with detailed parameters,
                responses, and execution times.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">📊 Performance</h3>
              <p className="text-sm text-secondary">
                Track performance metrics, response times, and identify
                bottlenecks in your AI workflows.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🌊 Streaming</h3>
              <p className="text-sm text-secondary">
                Visualize streaming events and monitor real-time data flow
                through your AI applications.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔍 Search</h3>
              <p className="text-sm text-secondary">
                Advanced filtering and search capabilities to quickly find
                specific events or patterns.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">📱 Mobile</h3>
              <p className="text-sm text-secondary">
                Responsive design that works perfectly on mobile devices for
                debugging on the go.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">⚡ Real-time</h3>
              <p className="text-sm text-secondary">
                Live updates as events happen, no need to refresh or restart
                your application.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Getting Started</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">
                1. Install the package
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`npm install @ai-sdk-tools/devtools`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">2. Add to your app</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { AIDevTools } from '@ai-sdk-tools/devtools'

function App() {
  return (
    <div>
      <AIDevTools />
      {/* Your app content */}
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">3. Start debugging</h3>
              <p className="text-sm text-secondary mb-4">
                The DevTools will automatically start monitoring your AI
                application and display events in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Features</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Event Monitoring</h3>
              <p className="text-sm text-secondary mb-4">
                Monitor all AI-related events including tool calls, streaming
                events, and state changes:
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
        // This will be monitored automatically
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
              <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
              <p className="text-sm text-secondary mb-4">
                Track performance metrics and identify bottlenecks:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`// Performance data is automatically collected
- Tool call duration
- Response times
- Memory usage
- Error rates
- Success rates`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Advanced Filtering</h3>
              <p className="text-sm text-secondary mb-4">
                Filter events by type, tool, time range, and more:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Filter options available
- Event type (tool_call, streaming, error)
- Tool name
- Time range
- Status (success, error, pending)
- Search by content`),
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
              <h3 className="text-lg font-medium mb-4">AIDevTools</h3>
              <p className="text-sm text-secondary mb-4">
                The main DevTools component:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`<AIDevTools
  position="bottom-right" // Position on screen
  theme="dark" // Theme (dark/light)
  maxEvents={100} // Maximum events to keep
  showTimestamp={true} // Show timestamps
  showPerformance={true} // Show performance metrics
/>`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">useAIDevTools</h3>
              <p className="text-sm text-secondary mb-4">
                Hook for programmatic access to DevTools:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`const {
  events, // All captured events
  clearEvents, // Clear all events
  exportEvents, // Export events as JSON
  isVisible, // DevTools visibility state
  toggleVisibility, // Toggle DevTools visibility
} = useAIDevTools()`),
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
                Try the DevTools in action with our interactive demo.
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
