"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { CopyButton } from "../copy-button";
import { InstallScriptTabs } from "../install-script-tabs";

export default function AgentsDocsContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Agents
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Multi-agent orchestration for AI SDK v5. Build intelligent
              workflows with specialized agents, automatic handoffs, and
              seamless coordination. Works with any AI provider.
              <strong className="text-[#d4d4d4]">
                {" "}
                Includes built-in memory system for persistent context.
              </strong>
            </p>

            <InstallScriptTabs packageName="@ai-sdk-tools/agents @ai-sdk-tools/memory ai zod" />
          </div>
        </section>

        {/* Why Multi-Agent Systems */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">
              Why Multi-Agent Systems?
            </h2>
            <p className="text-sm text-secondary mb-8 leading-relaxed">
              Complex tasks benefit from specialized expertise. Instead of a
              single model handling everything, break work into focused agents:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-base font-medium mb-2">Customer Support</h3>
                <p className="text-xs text-secondary">
                  Triage → Technical Support → Billing
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-base font-medium mb-2">Content Pipeline</h3>
                <p className="text-xs text-secondary">
                  Research → Writing → Editing → Publishing
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-base font-medium mb-2">Code Development</h3>
                <p className="text-xs text-secondary">
                  Planning → Implementation → Testing → Documentation
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-base font-medium mb-2">Data Analysis</h3>
                <p className="text-xs text-secondary">
                  Collection → Processing → Visualization → Insights
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">Specialization</p>
                  <p className="text-xs text-secondary">
                    Each agent focuses on its domain with optimized instructions
                    and tools
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Context Preservation
                  </p>
                  <p className="text-xs text-secondary">
                    Full conversation history maintained across handoffs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Provider Flexibility
                  </p>
                  <p className="text-xs text-secondary">
                    Use different models for different tasks (GPT-4 for
                    analysis, Claude for writing)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Programmatic Routing
                  </p>
                  <p className="text-xs text-secondary">
                    Pattern matching and automatic agent selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memory System */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">
              Built-in Memory System
            </h2>
            <p className="text-sm text-secondary mb-8 leading-relaxed">
              Every agent includes a powerful memory system that maintains
              context across conversations. Memory is a{" "}
              <strong className="text-[#d4d4d4]">required dependency</strong>{" "}
              that provides:
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">Working Memory</p>
                  <p className="text-xs text-secondary">
                    Persistent context that agents can read and update during
                    conversations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">
                    Conversation History
                  </p>
                  <p className="text-xs text-secondary">
                    Automatic message persistence and retrieval across chat
                    sessions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">Chat Management</p>
                  <p className="text-xs text-secondary">
                    Automatic title generation and chat organization
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="text-sm font-medium mb-1">Flexible Scopes</p>
                  <p className="text-xs text-secondary">
                    Chat-level or user-level memory with multiple storage
                    backends
                  </p>
                </div>
              </div>
            </div>
            <div className="border border-[#2a2a2a] p-6">
              <pre
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`import { Agent } from '@ai-sdk-tools/agents'
import { InMemoryProvider } from '@ai-sdk-tools/memory/in-memory'
import { openai } from '@ai-sdk/openai'

const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
  memory: {
    provider: new InMemoryProvider(),
    workingMemory: {
      enabled: true,
      scope: 'chat', // or 'user'
    },
    history: {
      enabled: true,
      limit: 10,
    },
    chats: {
      enabled: true,
      generateTitle: true,
    }
  }
})`),
                }}
                suppressHydrationWarning
              />
            </div>
            <p className="text-xs text-secondary mt-4">
              <Link
                href="/docs/memory"
                className="text-[#d4d4d4] hover:underline"
              >
                Learn more about memory configuration →
              </Link>
            </p>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Quick Start</h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-normal mb-4">
                  Basic: Single Agent
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { Agent } from '@ai-sdk-tools/agents'
import { openai } from '@ai-sdk/openai'

const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
})

// Generate response
const result = await agent.generate({
  prompt: 'What is 2+2?',
})

console.log(result.text) // "4"`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Handoffs: Two Specialists
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { Agent } from '@ai-sdk-tools/agents'
import { openai } from '@ai-sdk/openai'

// Create specialized agents
const mathAgent = new Agent({
  name: 'Math Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with math problems. Show step-by-step solutions.',
})

const historyAgent = new Agent({
  name: 'History Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with history questions. Provide context and dates.',
})

// Create orchestrator with handoff capability
const orchestrator = new Agent({
  name: 'Triage',
  model: openai('gpt-4o'),
  instructions: 'Route questions to the appropriate specialist.',
  handoffs: [mathAgent, historyAgent],
})

// LLM decides which specialist to use
const result = await orchestrator.generate({
  prompt: 'What is the quadratic formula?',
})

console.log(\`Handled by: \${result.finalAgent}\`) // "Math Tutor"
console.log(\`Handoffs: \${result.handoffs.length}\`) // 1`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Orchestration: Auto-Routing
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Use programmatic routing for instant agent selection without
                  LLM overhead:
                </p>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`const mathAgent = new Agent({
  name: 'Math Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with math problems.',
  matchOn: ['calculate', 'math', 'equation', /\\d+\\s*[\\+\\-\\*\\/]\\s*\\d+/],
})

const historyAgent = new Agent({
  name: 'History Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with history questions.',
  matchOn: ['history', 'war', 'civilization', /\\d{4}/], // Years
})

const orchestrator = new Agent({
  name: 'Smart Router',
  model: openai('gpt-4o-mini'), // Efficient for routing
  instructions: 'Route to specialists. Fall back to handling general questions.',
  handoffs: [mathAgent, historyAgent],
})

// Automatically routes to mathAgent based on pattern match
const result = await orchestrator.generate({
  prompt: 'What is 15 * 23?',
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Streaming with UI */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Streaming with UI</h2>
            <p className="text-sm text-secondary mb-4">
              For Next.js route handlers and real-time UI updates:
            </p>
            <div className="border border-[#2a2a2a] p-6">
              <pre
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`// app/api/chat/route.ts
import { Agent } from '@ai-sdk-tools/agents'
import { openai } from '@ai-sdk/openai'

const supportAgent = new Agent({
  name: 'Support',
  model: openai('gpt-4o'),
  instructions: 'Handle customer support inquiries.',
  handoffs: [technicalAgent, billingAgent],
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  return supportAgent.toUIMessageStream({
    messages,
    maxRounds: 5, // Max handoffs
    maxSteps: 10, // Max tool calls per agent
    onEvent: async (event) => {
      if (event.type === 'agent-handoff') {
        console.log(\`Handoff: \${event.from} → \${event.to}\`)
      }
    },
  })
}`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Tools and Context */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Tools and Context</h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-normal mb-4">Adding Tools</h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`import { tool } from 'ai'
import { z } from 'zod'

const calculatorTool = tool({
  description: 'Perform calculations',
  parameters: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    return eval(expression) // Use safe-eval in production
  },
})

const agent = new Agent({
  name: 'Calculator Agent',
  model: openai('gpt-4o'),
  instructions: 'Help with math using the calculator tool.',
  tools: {
    calculator: calculatorTool,
  },
  maxTurns: 20, // Max tool call iterations
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Context-Aware Agents
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Use typed context for team/user-specific behavior:
                </p>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`interface TeamContext {
  teamId: string
  userId: string
  preferences: Record<string, string>
}

const agent = new Agent<TeamContext>({
  name: 'Team Assistant',
  model: openai('gpt-4o'),
  instructions: (context) => {
    return \`You are helping team \${context.teamId}. 
    User preferences: \${JSON.stringify(context.preferences)}\`
  },
})

// Pass context when streaming
agent.toUIMessageStream({
  messages,
  context: {
    teamId: 'team-123',
    userId: 'user-456',
    preferences: { theme: 'dark', language: 'en' },
  },
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Provider Setup */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Multi-Provider Setup</h2>
            <p className="text-sm text-secondary mb-4">
              Use the best model for each task:
            </p>
            <div className="border border-[#2a2a2a] p-6">
              <pre
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

const researchAgent = new Agent({
  name: 'Researcher',
  model: anthropic('claude-3-5-sonnet-20241022'), // Excellent reasoning
  instructions: 'Research topics thoroughly.',
})

const writerAgent = new Agent({
  name: 'Writer',
  model: openai('gpt-4o'), // Great at creative writing
  instructions: 'Create engaging content.',
})

const editorAgent = new Agent({
  name: 'Editor',
  model: google('gemini-1.5-pro'), // Strong at review
  instructions: 'Review and improve content.',
  handoffs: [writerAgent], // Can send back for rewrites
})

const pipeline = new Agent({
  name: 'Content Manager',
  model: openai('gpt-4o-mini'), // Efficient orchestrator
  instructions: 'Coordinate content creation.',
  handoffs: [researchAgent, writerAgent, editorAgent],
})`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Guardrails</h2>
            <p className="text-sm text-secondary mb-4">
              Control agent behavior with input/output validation:
            </p>
            <div className="border border-[#2a2a2a] p-6">
              <pre
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(`const agent = new Agent({
  name: 'Moderated Agent',
  model: openai('gpt-4o'),
  instructions: 'Answer questions helpfully.',
  inputGuardrails: [
    async (input) => {
      if (containsProfanity(input)) {
        return { 
          pass: false, 
          action: 'block',
          message: 'Input violates content policy',
        }
      }
      return { pass: true }
    },
  ],
  outputGuardrails: [
    async (output) => {
      if (containsSensitiveInfo(output)) {
        return { 
          pass: false, 
          action: 'modify',
          modifiedOutput: redactSensitiveInfo(output),
        }
      }
      return { pass: true }
    },
  ],
})`),
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

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-normal mb-4">
                  Agent Constructor Options
                </h3>
                <div className="border border-[#2a2a2a] p-6 space-y-3 text-sm">
                  <div>
                    <code className="text-xs">name: string</code> - Unique agent
                    identifier
                  </div>
                  <div>
                    <code className="text-xs">model: LanguageModel</code> - AI
                    SDK language model
                  </div>
                  <div>
                    <code className="text-xs">
                      instructions: string | ((context: TContext) =&gt; string)
                    </code>{" "}
                    - System prompt
                  </div>
                  <div>
                    <code className="text-xs">
                      tools?: Record&lt;string, Tool&gt;
                    </code>{" "}
                    - Available tools
                  </div>
                  <div>
                    <code className="text-xs">handoffs?: Agent[]</code> - Agents
                    this agent can hand off to
                  </div>
                  <div>
                    <code className="text-xs">maxTurns?: number</code> - Maximum
                    tool call iterations (default: 10)
                  </div>
                  <div>
                    <code className="text-xs">temperature?: number</code> -
                    Model temperature
                  </div>
                  <div>
                    <code className="text-xs">
                      matchOn?: (string | RegExp)[] | ((message: string) =&gt;
                      boolean)
                    </code>{" "}
                    - Routing patterns
                  </div>
                  <div>
                    <code className="text-xs">
                      onEvent?: (event: AgentEvent) =&gt; void
                    </code>{" "}
                    - Lifecycle event handler
                  </div>
                  <div>
                    <code className="text-xs">
                      inputGuardrails?: InputGuardrail[]
                    </code>{" "}
                    - Pre-execution validation
                  </div>
                  <div>
                    <code className="text-xs">
                      outputGuardrails?: OutputGuardrail[]
                    </code>{" "}
                    - Post-execution validation
                  </div>
                  <div>
                    <code className="text-xs">
                      permissions?: ToolPermissions
                    </code>{" "}
                    - Tool access control
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">Methods</h3>
                <div className="border border-[#2a2a2a] p-6 space-y-4">
                  <div>
                    <code className="text-xs text-secondary">
                      generate(options)
                    </code>
                    <p className="text-xs text-secondary mt-1">
                      Generate response (non-streaming)
                    </p>
                  </div>
                  <div>
                    <code className="text-xs text-secondary">
                      stream(options)
                    </code>
                    <p className="text-xs text-secondary mt-1">
                      Stream response (AI SDK stream)
                    </p>
                  </div>
                  <div>
                    <code className="text-xs text-secondary">
                      toUIMessageStream(options)
                    </code>
                    <p className="text-xs text-secondary mt-1">
                      Stream as UI messages (Next.js route handler)
                    </p>
                  </div>
                  <div>
                    <code className="text-xs text-secondary">
                      getHandoffs()
                    </code>
                    <p className="text-xs text-secondary mt-1">
                      Get handoff agents
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">Event Types</h3>
                <div className="border border-[#2a2a2a] p-6 space-y-2 text-xs text-secondary">
                  <div>
                    • <code>agent-start</code> - Agent starts execution
                  </div>
                  <div>
                    • <code>agent-step</code> - Agent completes a step
                  </div>
                  <div>
                    • <code>agent-finish</code> - Agent finishes round
                  </div>
                  <div>
                    • <code>agent-handoff</code> - Agent hands off to another
                  </div>
                  <div>
                    • <code>agent-complete</code> - All execution complete
                  </div>
                  <div>
                    • <code>agent-error</code> - Error occurred
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration with Other Packages */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">
              Integration with Other Packages
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-normal mb-4">
                  With @ai-sdk-tools/memory
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Add persistent working memory and conversation history to
                  agents:
                </p>
                <div className="border border-[#2a2a2a] p-6 mb-4">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { DrizzleProvider } from '@ai-sdk-tools/memory/drizzle'

const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
  memory: {
    provider: new DrizzleProvider(db),
    workingMemory: {
      enabled: true,
      scope: 'user', // or 'chat'
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

// Agent automatically:
// - Loads working memory into system prompt
// - Injects updateWorkingMemory tool
// - Loads conversation history
// - Persists messages and generates titles`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
                <p className="text-xs text-secondary">
                  Learn more:{" "}
                  <Link
                    href="/docs/memory"
                    className="text-[#d4d4d4] hover:underline"
                  >
                    Memory Documentation
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  With @ai-sdk-tools/cache
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Cache expensive tool calls across agents:
                </p>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { cached } from '@ai-sdk-tools/cache'

const agent = new Agent({
  name: 'Data Agent',
  model: openai('gpt-4o'),
  instructions: 'Analyze data.',
  tools: {
    analyze: cached(expensiveAnalysisTool),
  },
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  With @ai-sdk-tools/artifacts
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Stream structured artifacts from agents:
                </p>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { artifact } from '@ai-sdk-tools/artifacts'

const reportAgent = new Agent({
  name: 'Report Generator',
  model: openai('gpt-4o'),
  instructions: 'Generate structured reports.',
  tools: {
    createReport: tool({
      execute: async function* ({ title }) {
        const report = artifact.stream({ title, sections: [] })
        yield { text: 'Report complete', forceStop: true }
      },
    }),
  },
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  With @ai-sdk-tools/devtools
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Debug agent execution in development:
                </p>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { AIDevTools } from '@ai-sdk-tools/devtools'

const agent = new Agent({
  name: 'Debug Agent',
  model: openai('gpt-4o'),
  instructions: 'Test agent.',
  onEvent: (event) => {
    console.log('[Agent Event]', event)
  },
})

// In your app
export default function App() {
  return (
    <>
      <YourChatInterface />
      <AIDevTools />
    </>
  )
}`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Examples</h2>
            <p className="text-sm text-secondary mb-4">
              Real-world implementations can be found in{" "}
              <code className="text-xs">/apps/example/src/ai/agents/</code>:
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="font-medium mb-1">Triage Agent</p>
                  <p className="text-xs text-secondary">
                    Route customer questions to specialists
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="font-medium mb-1">Financial Agent</p>
                  <p className="text-xs text-secondary">
                    Multi-step analysis with artifacts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="font-medium mb-1">Code Review</p>
                  <p className="text-xs text-secondary">
                    Analyze → Test → Document workflow
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs text-secondary mt-1">•</span>
                <div>
                  <p className="font-medium mb-1">Multi-Provider</p>
                  <p className="text-xs text-secondary">
                    Use different models for different tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="https://github.com/midday-ai/ai-sdk-tools/tree/main/packages/agents"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#2a2a2a] hover:border-[#404040] transition-colors p-6 group"
              >
                <h3 className="text-base font-medium mb-2 group-hover:text-white transition-colors">
                  View on GitHub
                </h3>
                <p className="text-xs text-secondary">
                  Explore source code and contribute
                </p>
              </Link>
              <Link
                href="/docs"
                className="border border-[#2a2a2a] hover:border-[#404040] transition-colors p-6 group"
              >
                <h3 className="text-base font-medium mb-2 group-hover:text-white transition-colors">
                  Back to Documentation
                </h3>
                <p className="text-xs text-secondary">Explore other packages</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
