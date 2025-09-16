import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Migration Guide - AI SDK Tools",
  description:
    "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance, global state access, and powerful debugging capabilities.",
  keywords: [
    "AI SDK migration",
    "AI tools migration",
    "AI SDK upgrade",
    "AI SDK migration guide",
    "AI tools upgrade",
    "AI SDK migration tutorial",
    "AI application migration",
    "AI SDK tools migration",
    "AI SDK migration steps",
    "AI tools migration guide",
  ],
  openGraph: {
    title: "Migration Guide - AI SDK Tools",
    description:
      "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance and global state access.",
    url: "https://ai-sdk-tools.dev/docs/migration",
  },
  twitter: {
    title: "Migration Guide - AI SDK Tools",
    description:
      "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance and global state access.",
  },
  alternates: {
    canonical: "/docs/migration",
  },
};

export default function MigrationPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Migration Guide
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Migrate from standard AI SDK to our enhanced tools with minimal
              changes. Get better performance, global state access, and powerful
              debugging capabilities.
            </p>
          </div>
        </section>

        {/* Why Migrate */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Why Migrate?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ❌ Current Limitations
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• State trapped in individual components</li>
                <li>• Props drilling for cross-component access</li>
                <li>• Everything re-renders on any change</li>
                <li>• No built-in debugging tools</li>
                <li>• Complex state management patterns</li>
                <li>• Limited streaming capabilities</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">✅ With AI SDK Tools</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Global state access from any component</li>
                <li>• No prop drilling needed</li>
                <li>• Optimized re-renders with selective subscriptions</li>
                <li>• Powerful debugging and monitoring</li>
                <li>• Simplified architecture</li>
                <li>• Advanced streaming with artifacts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration Steps */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Migration Steps</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Step 1: Install Packages
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`npm install @ai-sdk-tools/store @ai-sdk-tools/devtools`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Step 2: Update Imports
              </h3>
              <p className="text-sm text-secondary mb-4">
                Replace your existing AI SDK imports with our enhanced versions:
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2 text-red-400">
                    Before
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          highlight(`import { useChat } from '@ai-sdk/react'
import { streamText } from 'ai'`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2 text-green-400">
                    After
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          highlight(`import { useChat } from '@ai-sdk-tools/store'
import { streamText } from 'ai'`),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Step 3: Update Chat Initialization
              </h3>
              <p className="text-sm text-secondary mb-4">
                Update your chat initialization to use the new transport
                pattern:
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2 text-red-400">
                    Before
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat'
  })
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2 text-green-400">
                    After
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          highlight(`import { DefaultChatTransport } from 'ai'

function Chat() {
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
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}

function MessageInput() {
  const sendMessage = useChatSendMessage()
  // ... input handling
}`),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Step 4: Add Debugging (Optional)
              </h3>
              <p className="text-sm text-secondary mb-4">
                Add the devtools component for debugging and monitoring:
              </p>

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
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Migration Patterns */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">
            Common Migration Patterns
          </h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Prop Drilling Elimination
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2 text-red-400">
                    Before - Prop Drilling
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function App() {
  const { messages, sendMessage } = useChat()
  return <Layout messages={messages} sendMessage={sendMessage} />
}

function Layout({ messages, sendMessage }) {
  return (
    <div>
      <Header messageCount={messages.length} />
      <ChatInterface messages={messages} sendMessage={sendMessage} />
    </div>
  )
}

function Header({ messageCount }) {
  return <div>Messages: {messageCount}</div>
}`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2 text-green-400">
                    After - Global Access
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function App() {
  useChat({ transport: new DefaultChatTransport({ api: '/api/chat' }) })
  return <Layout />
}

function Layout() {
  return (
    <div>
      <Header />
      <ChatInterface />
    </div>
  )
}

function Header() {
  const messageCount = useChatMessageCount()
  return <div>Messages: {messageCount}</div>
}`),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Performance Optimization
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2 text-red-400">
                    Before - Everything Re-renders
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function Chat() {
  const { messages, isLoading, error } = useChat()
  // Re-renders when ANY of these change
  
  return (
    <div>
      <MessageCount count={messages.length} />
      <LoadingSpinner loading={isLoading} />
      <ErrorMessage error={error} />
    </div>
  )
}`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2 text-green-400">
                    After - Selective Subscriptions
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function Chat() {
  useChat({ transport: new DefaultChatTransport({ api: '/api/chat' }) })
  
  return (
    <div>
      <MessageCount />
      <LoadingSpinner />
      <ErrorMessage />
    </div>
  )
}

function MessageCount() {
  const count = useChatMessageCount() // Only re-renders when count changes
  return <div>Messages: {count}</div>
}

function LoadingSpinner() {
  const status = useChatStatus() // Only re-renders when status changes
  return status === 'streaming' ? <Spinner /> : null
}`),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Advanced Features</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Custom Types and Tool Calls
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Define custom message types
interface MyMessage extends UIMessage<
  { userId: string }, // metadata
  { weather: WeatherData }, // data  
  { getWeather: { input: { location: string }, output: WeatherData } } // tools
> {}

// Use with full typing
const chat = useChat<MyMessage>({ 
  transport: new DefaultChatTransport({
    api: '/api/chat'
  })
})
const messages = useChatMessages<MyMessage>() // Fully typed!

// Custom selectors
const toolCallCount = useChatProperty(
  (state) => state.messages.filter(m => m.parts?.some(p => p.type.startsWith('tool-')))
)`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Custom Stores with Persistence
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { createCustomChatStore } from '@ai-sdk-tools/store'
import { persist } from 'zustand/middleware'

// Custom store with persistence
const persistedStore = createCustomChatStore(
  persist(
    (set) => ({ /* your config */ }),
    { name: 'chat-storage' }
  )
)

function PersistentChat() {
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    }),
    store: persistedStore // Chat survives page refresh!
  })
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Breaking Changes */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Breaking Changes</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              ◇ Minimal Breaking Changes
            </h3>
            <p className="text-sm text-secondary mb-4">
              The migration is designed to be as smooth as possible with minimal
              breaking changes:
            </p>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">
                  ✅ What Stays the Same
                </div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>• All useChat parameters and options</li>
                  <li>• Message structure and types</li>
                  <li>• Tool call handling</li>
                  <li>• Error handling patterns</li>
                  <li>• TypeScript generics support</li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">⚠️ What Changes</div>
                <ul className="space-y-1 text-xs text-secondary">
                  <li>
                    • Import path: <code>@ai-sdk/react</code> →{" "}
                    <code>@ai-sdk-tools/store</code>
                  </li>
                  <li>
                    • API parameter: <code>api</code> → <code>transport</code>
                  </li>
                  <li>• New hooks available for global access</li>
                  <li>• Additional configuration options</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Checklist */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Migration Checklist</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              ◇ Step-by-Step Checklist
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border border-[#3c3c3c] rounded flex items-center justify-center text-xs">
                  1
                </div>
                <div>
                  <div className="text-sm font-medium">Install packages</div>
                  <div className="text-xs text-secondary">
                    npm install @ai-sdk-tools/store @ai-sdk-tools/devtools
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border border-[#3c3c3c] rounded flex items-center justify-center text-xs">
                  2
                </div>
                <div>
                  <div className="text-sm font-medium">Update imports</div>
                  <div className="text-xs text-secondary">
                    Replace @ai-sdk/react with @ai-sdk-tools/store
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border border-[#3c3c3c] rounded flex items-center justify-center text-xs">
                  3
                </div>
                <div>
                  <div className="text-sm font-medium">Refactor components</div>
                  <div className="text-xs text-secondary">
                    Use new hooks for global state access
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border border-[#3c3c3c] rounded flex items-center justify-center text-xs">
                  4
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Add debugging (optional)
                  </div>
                  <div className="text-xs text-secondary">
                    Include AIDevtools component
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border border-[#3c3c3c] rounded flex items-center justify-center text-xs">
                  5
                </div>
                <div>
                  <div className="text-sm font-medium">Test and verify</div>
                  <div className="text-xs text-secondary">
                    Ensure everything works as expected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Migration Benefits</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">
                ✅ Zero breaking changes
              </div>
              <p className="text-xs text-secondary">
                Same API as @ai-sdk/react
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">
                ✅ Better performance
              </div>
              <p className="text-xs text-secondary">Selective re-renders</p>
            </div>
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">
                ✅ No prop drilling
              </div>
              <p className="text-xs text-secondary">Access from anywhere</p>
            </div>
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">
                ✅ Simplified architecture
              </div>
              <p className="text-xs text-secondary">Single global store</p>
            </div>
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">✅ Custom stores</div>
              <p className="text-xs text-secondary">
                Persistence, devtools, etc.
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-4">
              <div className="text-sm font-medium mb-2">✅ Full TypeScript</div>
              <p className="text-xs text-secondary">Same generic support</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/quickstart" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Quickstart Guide
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Get up and running with a complete example after migration.
                </p>
              </div>
            </Link>

            <Link href="/docs/store" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Store Documentation
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Learn about advanced features and patterns.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">Ready to Migrate?</h2>
            <p className="text-xs text-secondary font-light">
              Start your migration today and unlock the full potential of AI SDK
              Tools.
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
