"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { CopyButton } from "../copy-button";
import { InstallScriptTabs } from "../install-script-tabs";

export default function MemoryDocsContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Memory
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Persistent memory system for AI agents with built-in providers for
              development and production. Working memory, conversation history,
              and chat persistence with a simple 4-method interface.
              <strong className="text-[#d4d4d4]">
                {" "}
                Required dependency for @ai-sdk-tools/agents.
              </strong>
            </p>

            <InstallScriptTabs packageName="@ai-sdk-tools/memory" />
          </div>
        </section>

        {/* Features */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Features</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Simple API - Just 4 methods to implement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Built-in Providers - InMemory, Drizzle ORM, and Upstash
                    included
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    TypeScript-first - Full type safety
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Flexible Scopes - Chat-level or user-level memory
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Conversation History - Optional message tracking
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Database Agnostic - Works with PostgreSQL, MySQL, and SQLite
                    via Drizzle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Quick Start</h2>
            <h3 className="text-lg font-medium mb-4">
              InMemory Provider (Development)
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Perfect for local development - works immediately, no setup
              needed.
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`import { InMemoryProvider } from '@ai-sdk-tools/memory/in-memory'
import { Agent } from '@ai-sdk-tools/agents'

const memory = new InMemoryProvider()

// Use with agents
const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4'),
  instructions: 'You are a helpful assistant.',
  memory: {
    provider: memory,
    workingMemory: {
      enabled: true,
      scope: 'chat',
    },
    history: {
      enabled: true,
      limit: 10,
    },
    chats: {
      enabled: true,
      generateTitle: true,
    }
  },
})`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Production Setup */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Production Setup</h2>

            <h3 className="text-lg font-medium mb-4">
              Drizzle Provider (SQL Databases)
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Works with PostgreSQL, MySQL, and SQLite via Drizzle ORM. Perfect
              if you already use Drizzle in your project.
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-8">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { DrizzleProvider } from '@ai-sdk-tools/memory/drizzle'

// Define your schema
const workingMemory = pgTable('working_memory', {
  id: text('id').primaryKey(),
  scope: text('scope').notNull(),
  chatId: text('chat_id'),
  userId: text('user_id'),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

const messages = pgTable('conversation_messages', {
  id: serial('id').primaryKey(),
  chatId: text('chat_id').notNull(),
  userId: text('user_id'),
  role: text('role').notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').notNull(),
})

// Initialize
const db = drizzle(sql)
const memory = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
})`),
                }}
                suppressHydrationWarning
              />
            </div>
            <p className="text-xs text-secondary mb-12">
              <a
                href="https://github.com/midday-ai/ai-sdk-tools/blob/main/packages/memory/DRIZZLE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#d4d4d4] underline"
              >
                Full Drizzle documentation
              </a>{" "}
              - Includes PostgreSQL, MySQL, SQLite/Turso examples
            </p>

            <h3 className="text-lg font-medium mb-4">
              Upstash Provider (Serverless)
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Perfect for edge and serverless environments.
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`import { Redis } from '@upstash/redis'
import { UpstashProvider } from '@ai-sdk-tools/memory/upstash'

const redis = Redis.fromEnv()
const memory = new UpstashProvider(redis)`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Usage with Agents */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Usage with Agents</h2>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              The memory package is a{" "}
              <strong className="text-[#d4d4d4]">required dependency</strong>{" "}
              for{" "}
              <Link
                href="/docs/agents"
                className="text-[#d4d4d4] hover:underline"
              >
                @ai-sdk-tools/agents
              </Link>
              . The agent automatically handles:
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">1.</span>
                <p className="text-sm">
                  Loads working memory into system prompt
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">2.</span>
                <p className="text-sm">Injects updateWorkingMemory tool</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">3.</span>
                <p className="text-sm">
                  Captures and persists conversation messages
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">4.</span>
                <p className="text-sm">
                  Generates chat titles from first message
                </p>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6 mb-8">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`import { Agent } from '@ai-sdk-tools/agents'
import { DrizzleProvider } from '@ai-sdk-tools/memory/drizzle'

const agent = new Agent({
  name: 'Financial Assistant',
  model: openai('gpt-4'),
  instructions: 'You help users manage their finances.',
  memory: {
    provider: new DrizzleProvider(db),
    workingMemory: {
      enabled: true,
      scope: 'user', // or 'chat'
      template: \`# Working Memory

## User Preferences
- [Preferred currency, date format, etc.]

## Important Context
- [Key facts about the user's finances]
\`
    },
    history: {
      enabled: true,
      limit: 10, // Last 10 messages
    },
    chats: {
      enabled: true,
      generateTitle: true, // Auto-generate from first message
    }
  },
})

// In your route handler
export async function POST(req: Request) {
  const { message, chatId } = await req.json()
  
  return agent.toUIMessageStream({
    message, // Single message - agent loads history
    context: {
      chatId,
      userId: 'user-123',
      // ... other context
    }
  })
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Memory Scopes */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Memory Scopes</h2>

            <h3 className="text-lg font-medium mb-4">
              Chat Scope (Recommended)
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Memory is tied to a specific conversation. Each chat has its own
              working memory.
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`workingMemory: {
  enabled: true,
  scope: 'chat',
}`),
                }}
                suppressHydrationWarning
              />
            </div>

            <h3 className="text-lg font-medium mb-4">User Scope</h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Memory persists across all conversations for a user. Useful for
              learning long-term preferences.
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`workingMemory: {
  enabled: true,
  scope: 'user',
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">API Reference</h2>

            <h3 className="text-lg font-medium mb-4">
              MemoryProvider Interface
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              All providers implement this simple 4-method interface:
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`interface MemoryProvider {
  // Get working memory for a chat or user
  getWorkingMemory(params: {
    chatId?: string
    userId?: string
    scope: MemoryScope
  }): Promise<WorkingMemory | null>
  
  // Update working memory
  updateWorkingMemory(params: {
    chatId?: string
    userId?: string
    scope: MemoryScope
    content: string
  }): Promise<void>
  
  // Save a conversation message (optional)
  saveMessage?(message: ConversationMessage): Promise<void>
  
  // Get conversation messages (optional)
  getMessages?(params: {
    chatId: string
    limit?: number
  }): Promise<ConversationMessage[]>
}`),
                }}
                suppressHydrationWarning
              />
            </div>

            <h3 className="text-lg font-medium mb-4">Types</h3>
            <div className="border border-[#3c3c3c] p-6 mb-12">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`interface WorkingMemory {
  content: string
  updatedAt: Date
}

type MemoryScope = 'chat' | 'user'

interface ConversationMessage {
  chatId: string
  userId?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Custom Provider */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Custom Provider</h2>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Implement your own memory backend by following the MemoryProvider
              interface:
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-8">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`import type { 
  MemoryProvider, 
  WorkingMemory, 
  ConversationMessage,
  MemoryScope 
} from '@ai-sdk-tools/memory'

class MyCustomProvider implements MemoryProvider {
  async getWorkingMemory(params: {
    chatId?: string
    userId?: string
    scope: MemoryScope
  }): Promise<WorkingMemory | null> {
    // Fetch from your database
    const key = scope === 'chat' ? params.chatId : params.userId
    const data = await myDb.get(key)
    
    if (!data) return null
    
    return {
      content: data.content,
      updatedAt: new Date(data.updatedAt)
    }
  }
  
  async updateWorkingMemory(params: {
    chatId?: string
    userId?: string
    scope: MemoryScope
    content: string
  }): Promise<void> {
    // Save to your database
    const key = scope === 'chat' ? params.chatId : params.userId
    await myDb.set(key, {
      content: params.content,
      updatedAt: new Date()
    })
  }
  
  // Optional: Implement message storage
  async saveMessage(message: ConversationMessage): Promise<void> {
    await myDb.insertMessage(message)
  }
  
  // Optional: Implement message retrieval
  async getMessages(params: {
    chatId: string
    limit?: number
  }): Promise<ConversationMessage[]> {
    return await myDb.getMessages(params.chatId, params.limit)
  }
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Integration Example */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Complete Example</h2>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Full example showing memory integration with agents:
            </p>
            <div className="border border-[#3c3c3c] p-6 mb-8">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`// app/api/chat/route.ts
import { Agent } from '@ai-sdk-tools/agents'
import { DrizzleProvider } from '@ai-sdk-tools/memory/drizzle'
import { openai } from '@ai-sdk/openai'

const memory = new DrizzleProvider(db)

const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4'),
  instructions: 'You are a helpful assistant.',
  memory: {
    provider: memory,
    workingMemory: {
      enabled: true,
      scope: 'user',
    },
    history: {
      enabled: true,
      limit: 10,
    },
    chats: {
      enabled: true,
      generateTitle: true,
    }
  },
})

export async function POST(req: Request) {
  const { message, chatId } = await req.json()
  
  return agent.toUIMessageStream({
    message,
    context: {
      chatId,
      userId: 'user-123',
    }
  })
}

// Client usage
import { useChat } from '@ai-sdk-tools/store'

function ChatComponent() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            message: messages[messages.length - 1],
            chatId: id,
          },
        }
      },
    }),
  })
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="pt-8 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <Link
              href="/docs/agents"
              className="text-sm text-secondary hover:text-[#d4d4d4] transition-colors"
            >
              ← Agents
            </Link>
            <Link
              href="https://github.com/midday-ai/ai-sdk-tools/tree/main/packages/memory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-[#d4d4d4] transition-colors"
            >
              View on GitHub →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
