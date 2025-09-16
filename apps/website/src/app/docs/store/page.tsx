import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Store Documentation - AI SDK Tools",
  description:
    "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access, optimized performance, and full TypeScript support.",
  keywords: [
    "AI SDK store",
    "AI state management",
    "Zustand AI",
    "React AI state",
    "AI chat state",
    "TypeScript AI state",
    "AI application state",
    "AI SDK tools store",
    "global AI state",
    "AI state management library",
  ],
  openGraph: {
    title: "Store Documentation - AI SDK Tools",
    description:
      "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access and optimized performance.",
    url: "https://ai-sdk-tools.dev/docs/store",
  },
  twitter: {
    title: "Store Documentation - AI SDK Tools",
    description:
      "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access and optimized performance.",
  },
  alternates: {
    canonical: "/docs/store",
  },
};

export default function StorePage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Store
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Global state management for AI applications. Drop-in replacement
              for @ai-sdk/react with global access, optimized performance, and
              full TypeScript support.
            </p>

            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
              <span className="text-[#d4d4d4] text-xs font-mono">
                npm i @ai-sdk-tools/store
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText("npm i @ai-sdk-tools/store")
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "npm i @ai-sdk-tools/store" to clipboard`}
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

        {/* Why Use This */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Why Use This?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">❌ Regular useChat</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• State trapped in one component</li>
                <li>• Props everywhere for cross-component access</li>
                <li>• Everything re-renders on any change</li>
                <li>• Complex state management</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ✅ @ai-sdk-tools/store
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Global state access from any component</li>
                <li>• No prop drilling needed</li>
                <li>• Optimized re-renders with selective subscriptions</li>
                <li>• Simplified architecture</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Migration (30 seconds)</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ One Line Change</h3>
            <p className="text-sm text-secondary mb-6">
              Replace your import and everything else works exactly the same:
            </p>

            <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`// Before
import { useChat } from '@ai-sdk/react'

// After - ONLY CHANGE NEEDED
import { useChat } from '@ai-sdk-tools/store'`),
                }}
              />
            </div>
          </div>
        </section>

        {/* Core Benefits */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Core Benefits</h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-medium mb-6">
                1. Access Chat from Any Component
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-medium mb-3 text-red-400">
                    ❌ Regular useChat - state trapped
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
  // Props everywhere!
  return <div>...</div>
}`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-3 text-green-400">
                    ✅ @ai-sdk-tools/store - access anywhere
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function App() {
  useChat({ 
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  }) // Initialize once
  return <Layout />
}

function Layout() {
  const messages = useChatMessages() // Direct access!
  const sendMessage = useChatSendMessage()
  return <div>...</div>
}`),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-6">
                2. Optimized Re-renders
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-medium mb-3 text-red-400">
                    ❌ Regular useChat - everything re-renders
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function Chat() {
  const { messages, isLoading, error } = useChat()
  // Re-renders when ANY of these change
}`),
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-3 text-green-400">
                    ✅ @ai-sdk-tools/store - selective subscriptions
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre
                      className="text-xs font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight(`function MessageCount() {
  const count = useChatMessageCount() // Only re-renders when count changes
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

            <div>
              <h3 className="text-xl font-medium mb-6">
                3. Custom Types & Tool Calls
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

// Custom selectors work too
const toolCallCount = useChatProperty(
  (state) => state.messages.filter(m => m.parts?.some(p => p.type.startsWith('tool-')))
)`),
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
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Hooks</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Main hook - same as @ai-sdk/react
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`const chat = useChat({ 
  transport: new DefaultChatTransport({
    api: '/api/chat'
  })
})`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Store access - no parameters needed
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`const messages = useChatMessages()
const status = useChatStatus()
const sendMessage = useChatSendMessage()`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Selectors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Core selectors</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• useChatMessages() - Message array</li>
                    <li>• useChatStatus() - Chat status</li>
                    <li>• useChatError() - Error state</li>
                    <li>• useChatSendMessage() - Send function</li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Additional</div>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• useChatMessageCount() - Message count</li>
                    <li>• useChatId() - Chat ID</li>
                    <li>• useChatActions() - All actions</li>
                    <li>• useChatProperty() - Custom selector</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Custom Stores</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { createCustomChatStore } from '@ai-sdk-tools/store'
import { persist } from 'zustand/middleware'

// With persistence
const persistedStore = createCustomChatStore(
  persist(
    (set) => ({ /* config */ }),
    { name: 'chat-history' }
  )
)

// Use custom store
const chat = useChat({ store: persistedStore })`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Examples</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Basic Chat Application
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useChat, useChatMessages, useChatSendMessage } from '@ai-sdk-tools/store'
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
}

function MessageInput() {
  const sendMessage = useChatSendMessage()
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const input = e.currentTarget.elements.message
      sendMessage(input.value)
      input.value = ''
    }}>
      <input name="message" placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  )
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ Performance Optimized Components
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`// Only re-renders when message count changes
function MessageCount() {
  const count = useChatMessageCount()
  return <div>Messages: {count}</div>
}

// Only re-renders when status changes
function LoadingIndicator() {
  const status = useChatStatus()
  return status === 'streaming' ? <Spinner /> : null
}

// Only re-renders when error changes
function ErrorDisplay() {
  const error = useChatError()
  return error ? <div className="error">{error.message}</div> : null
}

// Custom selector - only re-renders when user messages change
function UserMessageCount() {
  const userMessages = useChatProperty(
    state => state.messages.filter(m => m.role === 'user')
  )
  return <div>User messages: {userMessages.length}</div>
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* When to Use */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">
            When to Use This vs Regular useChat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4 text-green-400">
                ✅ Use @ai-sdk-tools/store when:
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Multiple components need chat data</li>
                <li>• Building complex chat UIs</li>
                <li>• Need performance optimization</li>
                <li>• Want custom types with tool calls</li>
                <li>• Want persistence or custom middleware</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4 text-yellow-400">
                ⚠️ Use regular useChat when:
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Simple single-component chat</li>
                <li>• No cross-component access needed</li>
                <li>• Prototyping or simple demos</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration Benefits */}
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

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">Ready to Get Started?</h2>
            <p className="text-xs text-secondary font-light">
              Install the store package and start building better AI
              applications today.
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
                Devtools →
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
