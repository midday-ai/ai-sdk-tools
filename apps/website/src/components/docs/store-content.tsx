"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function StoreContent() {
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
              High-performance state management for AI applications. Drop-in replacement
              for @ai-sdk/react with 3-5x performance improvements, O(1) message lookups,
              and built-in optimizations.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🌍 Global State</h3>
              <p className="text-sm text-secondary mb-4">
                Access chat state from any component without prop drilling.
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Any component can access the state
function Header() {
  const { messages } = useChat()
  return <div>{messages.length} messages</div>
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">⚡ Performance</h3>
              <p className="text-sm text-secondary mb-4">
                Optimized re-renders with selective subscriptions.
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Only re-renders when messages change
function MessageList() {
  const { messages } = useChat()
  return <div>{messages.map(...)}</div>
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔧 TypeScript</h3>
              <p className="text-sm text-secondary mb-4">
                Full type safety with auto-completion and error checking.
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Full TypeScript support
const { messages, input, handleInputChange } = useChat<{
  role: 'user' | 'assistant'
  content: string
}>()`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔄 Compatibility</h3>
              <p className="text-sm text-secondary mb-4">
                Drop-in replacement with the same API as @ai-sdk/react.
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Same API, better performance
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
  onFinish: (message) => console.log(message)
})`),
                  }}
                />
              </div>
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
                    __html: highlight(`npm install @ai-sdk-tools/store`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">2. Create the store</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// store.ts
import { createAIStore } from '@ai-sdk-tools/store'

export const store = createAIStore({
  initialMessages: [],
  onFinish: (message) => {
    console.log('Message finished:', message)
  },
})`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">3. Use in components</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// ChatInput.tsx
import { useChat } from '@ai-sdk-tools/store'

export function ChatInput() {
  const { input, handleInputChange, handleSubmit } = useChat()
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
    </form>
  )
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Usage */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Advanced Usage</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Custom Hooks</h3>
              <p className="text-sm text-secondary mb-4">
                Create custom hooks for specific parts of the state:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Custom hook for messages only
function useMessages() {
  const { messages } = useChat()
  return messages
}

// Custom hook for loading state
function useIsLoading() {
  const { isLoading } = useChat()
  return isLoading
}`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">State Selectors</h3>
              <p className="text-sm text-secondary mb-4">
                Use selectors to get specific parts of the state:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Get only the last message
function useLastMessage() {
  const { messages } = useChat()
  return messages[messages.length - 1]
}

// Get message count
function useMessageCount() {
  const { messages } = useChat()
  return messages.length
}`),
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
              <h3 className="text-lg font-medium mb-4">useChat</h3>
              <p className="text-sm text-secondary mb-4">
                The main hook for accessing chat state and actions:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`const {
  messages,        // Array of messages
  input,          // Current input value
  handleInputChange, // Input change handler
  handleSubmit,   // Form submit handler
  isLoading,      // Loading state
  error,          // Error state
  reload,         // Reload function
  stop,           // Stop function
  setMessages,    // Set messages function
  setInput,       // Set input function
} = useChat()`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">createAIStore</h3>
              <p className="text-sm text-secondary mb-4">
                Create a new AI store instance:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`const store = createAIStore({
  initialMessages: [], // Initial messages
  onFinish: (message) => {
    // Called when a message is finished
  },
  onError: (error) => {
    // Called when an error occurs
  },
})`),
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
                Try the store in action with our interactive demo.
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
