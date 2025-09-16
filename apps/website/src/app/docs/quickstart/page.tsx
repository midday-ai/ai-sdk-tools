import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Quickstart Guide - AI SDK Tools",
  description:
    "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation, setup, and your first AI application.",
  keywords: [
    "AI SDK quickstart",
    "AI tools setup",
    "React AI tutorial",
    "AI SDK installation",
    "AI application quickstart",
    "AI SDK getting started",
    "AI tools tutorial",
    "TypeScript AI setup",
  ],
  openGraph: {
    title: "Quickstart Guide - AI SDK Tools",
    description:
      "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation and setup.",
    url: "https://ai-sdk-tools.dev/docs/quickstart",
  },
  twitter: {
    title: "Quickstart Guide - AI SDK Tools",
    description:
      "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation and setup.",
  },
  alternates: {
    canonical: "/docs/quickstart",
  },
};

export default function QuickstartPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Quickstart
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Get up and running with AI SDK Tools in minutes. This guide will
              walk you through setting up your first AI application with our
              enhanced tools.
            </p>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Prerequisites</h2>

          <div className="space-y-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ What You'll Need</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Node.js 18+ and npm/yarn/pnpm</li>
                <li>• React 16.8+ or Next.js 13+</li>
                <li>• Basic knowledge of React and TypeScript</li>
                <li>• An AI provider API key (OpenAI, Anthropic, etc.)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Installation</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Install Packages</h3>
              <p className="text-sm text-secondary mb-4">
                Start with the core packages. You can install them individually
                or all at once:
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">
                    Individual packages:
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`npm install @ai-sdk-tools/store
npm install @ai-sdk-tools/devtools
npm install @ai-sdk-tools/artifacts`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    All packages at once:
                  </div>
                  <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                    <pre className="text-xs font-mono text-[#d4d4d4]">
                      {`npm install @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Setup */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Basic Setup</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 1. Create API Route
              </h3>
              <p className="text-sm text-secondary mb-4">
                Set up your AI API route. This example uses OpenAI:
              </p>

              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4'),
    messages,
  });

  return result.toDataStreamResponse();
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ 2. Initialize Chat</h3>
              <p className="text-sm text-secondary mb-4">
                Replace your existing useChat import with our enhanced version:
              </p>

              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Before
import { useChat } from '@ai-sdk/react'

// After - ONLY CHANGE NEEDED
import { useChat } from '@ai-sdk-tools/store'
import { DefaultChatTransport } from 'ai'

function App() {
  useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  })
  
  return <ChatInterface />
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 3. Access Chat from Any Component
              </h3>
              <p className="text-sm text-secondary mb-4">
                Now you can access chat state from any component without prop
                drilling:
              </p>

              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useChatMessages, useChatSendMessage } from '@ai-sdk-tools/store'

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
          </div>
        </section>

        {/* Add Devtools */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Add Debugging</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Enable Devtools</h3>
              <p className="text-sm text-secondary mb-4">
                Add the devtools component to debug your AI application:
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
      <ChatInterface />
      
      {/* Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <AIDevtools />
      )}
    </div>
  )
}

// Devtools automatically tracks:
// - Tool calls and their results
// - Message streaming events
// - Performance metrics
// - Error handling`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/store" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Store Documentation
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Learn about global state management, custom selectors, and
                  advanced patterns.
                </p>
              </div>
            </Link>

            <Link href="/docs/artifacts" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Artifacts Guide
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Create structured, streaming artifacts for complex AI
                  applications.
                </p>
              </div>
            </Link>

            <Link href="/docs/devtools" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Devtools Reference
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Master debugging and monitoring with comprehensive devtools
                  features.
                </p>
              </div>
            </Link>

            <Link href="/docs/chrome-extension" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Chrome Extension
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Install the Chrome extension for native DevTools integration.
                </p>
              </div>
            </Link>
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
                    Messages not updating?
                  </div>
                  <p className="text-sm text-secondary">
                    Make sure you're using the hooks from @ai-sdk-tools/store,
                    not @ai-sdk/react.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Devtools not showing?
                  </div>
                  <p className="text-sm text-secondary">
                    Ensure you're in development mode and the component is
                    properly imported.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    TypeScript errors?
                  </div>
                  <p className="text-sm text-secondary">
                    Make sure you have the latest versions of both packages
                    installed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">Ready to Build More?</h2>
            <p className="text-xs text-secondary font-light">
              Explore our comprehensive documentation to unlock the full
              potential of AI SDK Tools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/docs/store"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Store Docs →
              </Link>
              <Link
                href="/docs/artifacts"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Artifacts Guide →
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
