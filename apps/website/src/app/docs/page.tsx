import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Documentation - AI SDK Tools",
  description:
    "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools for state management, debugging, and streaming interfaces.",
  keywords: [
    "AI SDK documentation",
    "AI tools documentation",
    "React AI state management",
    "AI debugging tools",
    "AI streaming interfaces",
    "AI SDK tools guide",
    "AI application development",
    "TypeScript AI tools",
  ],
  openGraph: {
    title: "Documentation - AI SDK Tools",
    description:
      "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools.",
    url: "https://ai-sdk-tools.dev/docs",
  },
  twitter: {
    title: "Documentation - AI SDK Tools",
    description:
      "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools.",
  },
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Documentation
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Everything you need to build powerful AI applications with our
              tools. From quick setup to advanced patterns, we've got you
              covered.
            </p>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Getting Started</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/docs/quickstart" className="group h-full">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors h-full flex flex-col">
                <div className="text-sm font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Quickstart
                </div>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Get up and running in minutes with our guided setup process.
                </p>
              </div>
            </Link>

            <Link href="/docs/installation" className="group h-full">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors h-full flex flex-col">
                <div className="text-sm font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Installation
                </div>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Install individual packages or get the complete toolkit.
                </p>
              </div>
            </Link>

            <Link href="/docs/migration" className="group h-full">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors h-full flex flex-col">
                <div className="text-sm font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Migration
                </div>
                <p className="text-xs text-secondary font-light leading-relaxed">
                  Migrate from standard AI SDK to our enhanced tools.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Packages */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Packages</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/store" className="group">
              <div className="border border-[#3c3c3c] p-8 hover:border-[#555] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium group-hover:text-[#d4d4d4] transition-colors">
                    ◇ Store
                  </div>
                  <div className="text-xs text-secondary font-mono">
                    @ai-sdk-tools/store
                  </div>
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed mb-6">
                  Global state management for AI applications. Drop-in
                  replacement for @ai-sdk/react with global access and optimized
                  performance.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-secondary">Key Features:</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Global state access from any component</li>
                    <li>• Optimized re-renders with selective subscriptions</li>
                    <li>• Full TypeScript support with custom types</li>
                    <li>• Custom Zustand stores with persistence</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/docs/devtools" className="group">
              <div className="border border-[#3c3c3c] p-8 hover:border-[#555] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium group-hover:text-[#d4d4d4] transition-colors">
                    ◇ Devtools
                  </div>
                  <div className="text-xs text-secondary font-mono">
                    @ai-sdk-tools/devtools
                  </div>
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed mb-6">
                  Powerful debugging and monitoring tool for AI applications.
                  Real-time insights into tool calls, performance metrics, and
                  streaming events.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-secondary">Key Features:</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Real-time event monitoring</li>
                    <li>• Tool call debugging and performance metrics</li>
                    <li>• Advanced filtering and search</li>
                    <li>• Chrome DevTools integration</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/docs/artifacts" className="group">
              <div className="border border-[#3c3c3c] p-8 hover:border-[#555] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium group-hover:text-[#d4d4d4] transition-colors">
                    ◇ Artifacts
                  </div>
                  <div className="text-xs text-secondary font-mono">
                    @ai-sdk-tools/artifacts
                  </div>
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed mb-6">
                  Advanced streaming interfaces for AI applications. Create
                  structured, type-safe artifacts that stream real-time updates
                  from AI tools.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-secondary">Key Features:</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Type-safe streaming with Zod validation</li>
                    <li>• Real-time updates with progress tracking</li>
                    <li>• Clean API with minimal boilerplate</li>
                    <li>• Built on @ai-sdk-tools/store</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/docs/chrome-extension" className="group">
              <div className="border border-[#3c3c3c] p-8 hover:border-[#555] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium group-hover:text-[#d4d4d4] transition-colors">
                    ◇ Chrome Extension
                  </div>
                  <div className="text-xs text-secondary font-mono">
                    @ai-sdk-tools/chrome-extension
                  </div>
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed mb-6">
                  Chrome extension for debugging AI SDK applications directly in
                  Chrome DevTools. Native integration with real-time monitoring.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-secondary">Key Features:</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Native Chrome DevTools integration</li>
                    <li>• Real-time event monitoring</li>
                    <li>• Stream interception and parsing</li>
                    <li>• State management exploration</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Examples</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-sm font-medium">
                ◇ Basic Chat Application
              </div>
              <div className="border border-[#3c3c3c] p-6 h-[20rem] overflow-y-auto">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useChat } from '@ai-sdk-tools/store'
import { DefaultChatTransport } from 'ai'

function App() {
  useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  })
  
  return (
    <div>
      <MessageList />
      <MessageInput />
    </div>
  )
}

function MessageList() {
  const messages = useChatMessages()
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          {msg.content}
        </div>
      ))}
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium">
                ◇ Debugging with Devtools
              </div>
              <div className="border border-[#3c3c3c] p-6 h-[20rem] overflow-y-auto">
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

            <div className="space-y-4">
              <div className="text-sm font-medium">◇ Streaming Artifacts</div>
              <div className="border border-[#3c3c3c] p-6 h-[20rem] overflow-y-auto">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { artifact, useArtifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

const BurnRate = artifact('burn-rate', z.object({
  title: z.string(),
  data: z.array(z.object({
    month: z.string(),
    burnRate: z.number()
  }))
}))

function Dashboard() {
  const { data, status, progress } = useArtifact(BurnRate)
  
  return (
    <div>
      <h2>{data?.title}</h2>
      {status === 'loading' && (
        <div>Loading... {progress * 100}%</div>
      )}
      {data?.data.map(item => (
        <div key={item.month}>
          {item.month}: \${item.burnRate}
        </div>
      ))}
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
            <h2 className="text-lg font-medium">Ready to Get Started?</h2>
            <p className="text-xs text-secondary font-light">
              Choose your tools and start building powerful AI applications
              today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/docs/quickstart"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Quickstart →
              </Link>
              <Link
                href="/docs/store"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Store Docs →
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
