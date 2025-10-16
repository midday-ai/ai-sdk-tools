"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { InstallScriptTabs } from "../install-script-tabs";

export default function MigrationContent() {
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

        {/* Quick Migration */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">
            Quick Migration (30 seconds)
          </h2>

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

        {/* Step by Step */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Step by Step Migration</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">
                1. Install the package
              </h3>
              <InstallScriptTabs packageName="@ai-sdk-tools/store" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                2. Update your imports
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Replace this
import { useChat } from '@ai-sdk/react'

// With this
import { useChat } from '@ai-sdk-tools/store'`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                3. Create the store (optional)
              </h3>
              <p className="text-sm text-secondary mb-4">
                For global state access, create a store instance:
              </p>
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
              <h3 className="text-lg font-medium mb-4">
                4. Add DevTools (optional)
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { AIDevtools } from '@ai-sdk-tools/devtools'

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
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">What You Get</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🌍 Global State</h3>
              <p className="text-sm text-secondary">
                Access chat state from any component without prop drilling.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">⚡ Performance</h3>
              <p className="text-sm text-secondary">
                Optimized re-renders with selective subscriptions.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔧 DevTools</h3>
              <p className="text-sm text-secondary">
                Powerful debugging and monitoring capabilities.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔒 Type Safety</h3>
              <p className="text-sm text-secondary">
                Full TypeScript support with auto-completion.
              </p>
            </div>
          </div>
        </section>

        {/* Common Patterns */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">
            Common Migration Patterns
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Before: Prop Drilling
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Before: Props everywhere
function App() {
  const { messages, input, handleSubmit } = useChat()

  return (
    <div>
      <Header messages={messages} />
      <Chat messages={messages} />
      <Input input={input} onSubmit={handleSubmit} />
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">After: Global Access</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// After: No props needed
function App() {
  return (
    <div>
      <Header />
      <Chat />
      <Input />
    </div>
  )
}

function Header() {
  const { messages } = useChat() // Access anywhere
  return <div>{messages.length} messages</div>
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Troubleshooting</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Common Issues</h3>
              <div className="space-y-4">
                <div className="border border-[#3c3c3c] p-4">
                  <h4 className="text-md font-medium mb-2">
                    State not updating
                  </h4>
                  <p className="text-sm text-secondary">
                    Make sure you're using the same store instance across
                    components. Create a store and export it from a shared file.
                  </p>
                </div>

                <div className="border border-[#3c3c3c] p-4">
                  <h4 className="text-md font-medium mb-2">
                    DevTools not showing
                  </h4>
                  <p className="text-sm text-secondary">
                    Ensure the AIDevTools component is rendered in your app and
                    check the browser console for any errors.
                  </p>
                </div>

                <div className="border border-[#3c3c3c] p-4">
                  <h4 className="text-md font-medium mb-2">
                    TypeScript errors
                  </h4>
                  <p className="text-sm text-secondary">
                    Make sure you have the latest version of @ai-sdk-tools/store
                    and that your TypeScript configuration is up to date.
                  </p>
                </div>
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
                See the migration in action with our interactive demo.
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
