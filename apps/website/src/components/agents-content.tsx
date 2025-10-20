"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { CopyButton } from "./copy-button";
import { InstallScriptTabs } from "./install-script-tabs";

export default function AgentsContent() {
  return (
    <div className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          <div className="space-y-12">
            <h1 className="text-4xl font-normal leading-tight tracking-wide max-w-[600px]">
              Build intelligent workflows with specialized AI agents.
            </h1>

            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light">
              Multi-agent orchestration for AI SDK v5. Automatic handoffs,
              programmatic routing, and seamless coordination across any AI
              provider. Perfect for complex tasks requiring distinct expertise.
              <strong className="text-[#d4d4d4]">
                {" "}
                Includes built-in memory system for persistent context.
              </strong>
            </p>

            {/* Terminal */}
            <InstallScriptTabs packageName="@ai-sdk-tools/agents @ai-sdk-tools/memory ai zod" />

            {/* Used by */}
            <div className="space-y-6 max-w-xl">
              <div className="text-xs text-secondary">Used by</div>
              <div className="flex items-center justify-start">
                <a
                  href="https://midday.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={90}
                    height={24}
                    viewBox="0 0 248 66"
                    fill="none"
                    aria-label="Midday logo"
                  >
                    <title>Midday logo</title>
                    <path
                      fill="#d4d4d4"
                      d="M35.013 6.36a21.562 21.562 0 0 1 0 13.637l-1.278 3.826 4.742-4.202a17.39 17.39 0 0 0 5.5-9.522l1.343-6.57 4.087.837-1.344 6.57a21.563 21.563 0 0 1-6.819 11.81l-3.022 2.679 6.21-1.27a17.394 17.394 0 0 0 9.525-5.5l4.449-5.016 3.12 2.768-4.448 5.016a21.563 21.563 0 0 1-11.81 6.818l-3.96.81 6.014 2.004c3.57 1.19 7.43 1.19 10.998 0l6.36-2.12L66 32.893l-6.36 2.12a21.562 21.562 0 0 1-13.637 0l-3.829-1.278 4.205 4.742a17.386 17.386 0 0 0 9.522 5.497l6.57 1.346-.837 4.087-6.57-1.344a21.564 21.564 0 0 1-11.81-6.819l-2.676-3.02 1.27 6.208a17.387 17.387 0 0 0 5.496 9.522l5.017 4.449-2.768 3.12-5.016-4.448a21.559 21.559 0 0 1-6.818-11.807l-.81-3.955-2.002 6.01a17.392 17.392 0 0 0 0 10.998l2.12 6.36L33.107 66l-2.12-6.36a21.562 21.562 0 0 1 0-13.637l1.275-3.834-4.74 4.207a17.393 17.393 0 0 0-5.498 9.525l-1.344 6.57-4.087-.84 1.344-6.566a21.563 21.563 0 0 1 6.819-11.81l3.02-2.682-6.207 1.272a17.389 17.389 0 0 0-9.523 5.5L7.597 52.36l-3.12-2.768 4.448-5.016a21.558 21.558 0 0 1 11.807-6.818l3.958-.812-6.012-2.002a17.392 17.392 0 0 0-10.998 0l-6.36 2.12L0 33.107l6.36-2.12a21.562 21.562 0 0 1 13.637 0l3.826 1.275-4.202-4.74a17.387 17.387 0 0 0-9.522-5.498l-6.57-1.344.837-4.087 6.57 1.344a21.564 21.564 0 0 1 11.81 6.819l2.673 3.016-1.267-6.203a17.386 17.386 0 0 0-5.496-9.523l-5.017-4.449 2.768-3.124 5.016 4.449a21.563 21.563 0 0 1 6.818 11.81l.81 3.958 2.004-6.012a17.392 17.392 0 0 0 0-10.998l-2.12-6.36L32.893 0l2.12 6.36ZM33 26.48A6.522 6.522 0 0 0 26.48 33l.036.666a6.52 6.52 0 0 0 12.968 0l.033-.666-.033-.666a6.52 6.52 0 0 0-5.818-5.818L33 26.481Z"
                    />
                    <path
                      fill="#d4d4d4"
                      d="m226.953 59.728 5.856-12.72-9.168-24.096h4.56l6.864 19.344 7.824-19.344h4.464l-15.744 36.816h-4.656ZM207.608 48.352c-2.336 0-4.224-.64-5.664-1.92-1.44-1.28-2.16-2.96-2.16-5.04 0-2.528 1.216-4.512 3.648-5.952 2.464-1.44 6.432-2.48 11.904-3.12v-1.488c0-1.696-.496-2.96-1.488-3.792-.96-.832-2.288-1.248-3.984-1.248-1.76 0-3.168.432-4.224 1.296-1.024.832-1.568 1.92-1.632 3.264h-4.224c.064-1.536.512-2.896 1.344-4.08.832-1.184 1.984-2.112 3.456-2.784 1.504-.704 3.232-1.056 5.184-1.056 3.104 0 5.488.8 7.152 2.4 1.664 1.568 2.496 3.824 2.496 6.768v16.272h-3.888v-3.504c-.768 1.28-1.84 2.272-3.216 2.976-1.376.672-2.944 1.008-4.704 1.008Zm-3.6-7.152c0 1.184.416 2.112 1.248 2.784.832.672 1.984 1.008 3.456 1.008 2.048 0 3.664-.64 4.848-1.92 1.184-1.312 1.776-3.088 1.776-5.328v-2.4c-3.936.416-6.816 1.104-8.64 2.064-1.792.928-2.688 2.192-2.688 3.792ZM181.033 48.352c-2.24 0-4.144-.56-5.712-1.68-1.568-1.152-2.768-2.704-3.6-4.656-.8-1.984-1.2-4.208-1.2-6.672 0-2.432.4-4.608 1.2-6.528.832-1.952 2.032-3.504 3.6-4.656 1.568-1.152 3.472-1.728 5.712-1.728 3.488 0 6.08 1.28 7.776 3.84v-12h4.32v33.6h-4.08v-3.744c-1.664 2.816-4.336 4.224-8.016 4.224Zm1.008-3.36c2.048 0 3.728-.72 5.04-2.16 1.344-1.472 2.016-3.952 2.016-7.44 0-3.488-.672-5.952-2.016-7.392-1.312-1.472-2.992-2.208-5.04-2.208-2.496 0-4.304.896-5.424 2.688-1.088 1.792-1.632 4.08-1.632 6.864 0 3.04.576 5.408 1.728 7.104 1.184 1.696 2.96 2.544 5.328 2.544ZM152.345 48.352c-2.24 0-4.144-.56-5.712-1.68-1.568-1.152-2.768-2.704-3.6-4.656-.8-1.984-1.2-4.208-1.2-6.672 0-2.432.4-4.608 1.2-6.528.832-1.952 2.032-3.504 3.6-4.656 1.568-1.152 3.472-1.728 5.712-1.728 3.488 0 6.08 1.28 7.776 3.84v-12h4.32v33.6h-4.08v-3.744c-1.664 2.816-4.336 4.224-8.016 4.224Zm1.008-3.36c2.048 0 3.728-.72 5.04-2.16 1.344-1.472 2.016-3.952 2.016-7.44 0-3.488-.672-5.952-2.016-7.392-1.312-1.472-2.992-2.208-5.04-2.208-2.496 0-4.304.896-5.424 2.688-1.088 1.792-1.632 4.08-1.632 6.864 0 3.04.576 5.408 1.728 7.104 1.184 1.696 2.96 2.544 5.328 2.544ZM131.422 47.872v-24.96h4.32v24.96h-4.32Zm2.16-27.984c-.8 0-1.472-.256-2.016-.768-.544-.544-.816-1.232-.816-2.064 0-.832.272-1.504.816-2.016.544-.512 1.216-.768 2.016-.768.768 0 1.424.256 1.968.768s.816 1.184.816 2.016c0 .832-.272 1.52-.816 2.064-.544.512-1.2.768-1.968.768ZM89 47.872v-24.96h4.08v3.696c.864-1.504 1.968-2.576 3.312-3.216 1.376-.64 2.656-.96 3.84-.96 1.792 0 3.36.4 4.704 1.2 1.376.8 2.384 2.048 3.024 3.744.512-1.184 1.2-2.144 2.064-2.88.864-.736 1.776-1.264 2.736-1.584.96-.32 1.872-.48 2.736-.48 2.432 0 4.432.736 6 2.208 1.568 1.44 2.352 3.744 2.352 6.912v16.32h-4.32v-15.36c0-1.664-.224-2.976-.672-3.936-.448-.96-1.04-1.632-1.776-2.016a4.795 4.795 0 0 0-2.4-.624 6.55 6.55 0 0 0-2.88.672c-.928.448-1.696 1.216-2.304 2.304-.608 1.088-.912 2.592-.912 4.512v14.448h-4.32v-15.36c0-1.664-.224-2.976-.672-3.936-.448-.96-1.04-1.632-1.776-2.016a4.795 4.795 0 0 0-2.4-.624a6.55 6.55 0 0 0-2.88.672c-.928.448-1.696 1.216-2.304 2.304-.608 1.088-.912 2.592-.912 4.512v14.448H89Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Code Demo */}
          <div className="space-y-6">
            <div className="border border-[#3c3c3c] p-6">
              <pre
                className="text-xs font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`import { Agent } from '@ai-sdk-tools/agents'
import { DrizzleProvider } from '@ai-sdk-tools/memory/drizzle'
import { openai } from '@ai-sdk/openai'

const mathAgent = new Agent({
  name: 'Math Tutor',
  model: openai('gpt-4o'),
  instructions: 'Help with math problems',
  matchOn: ['math', 'calculate', /\\d+/]
})

const historyAgent = new Agent({
  name: 'History Tutor',  
  model: openai('gpt-4o'),
  instructions: 'Help with history',
  matchOn: ['history', 'war']
})

const orchestrator = new Agent({
  name: 'Triage',
  model: openai('gpt-4o-mini'),
  instructions: 'Route to specialists',
  handoffs: [mathAgent, historyAgent],
  memory: {
    provider: new DrizzleProvider(db),
    workingMemory: { enabled: true, scope: 'user' },
    history: { enabled: true, limit: 10 }
  }
})

// Auto-routes and remembers context
const result = await orchestrator.generate({
  prompt: 'What is 15 * 23?'
})

console.log(\`Handled by: \${result.finalAgent}\`)
// "Handled by: Math Tutor"`),
                }}
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          <div>
            <h3 className="text-base font-medium mb-3">
              Automatic Agent Routing
            </h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Pattern-based routing with regex and string matching. Route
              requests instantly to the right specialist without LLM overhead.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Seamless Handoffs</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Agents can transfer control while preserving full conversation
              context. Include handoff reasons and relevant data for smooth
              transitions.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">
              Multi-Provider Support
            </h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Use different AI models for different tasks. GPT-4 for analysis,
              Claude for writing, Gemini for review - all in one workflow.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Context-Aware Agents</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Pass typed context to agents for team/user-specific behavior.
              Dynamic instructions based on preferences, permissions, and state.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Persistent Memory</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Built-in working memory and conversation history. Agents remember
              context across chats with flexible storage providers (InMemory,
              Drizzle, Upstash).
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Built-in Guardrails</h3>
            <p className="text-xs text-secondary font-light leading-relaxed">
              Input/output validation, content moderation, and tool permissions.
              Block, modify, or approve content before and after agent
              execution.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-8 mb-40">
          <h2 className="text-lg font-medium">Use Cases</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#2a2a2a] p-6">
              <h3 className="text-base font-medium mb-3">Customer Support</h3>
              <p className="text-xs text-secondary mb-4">
                Triage → Technical Support → Billing
              </p>
              <p className="text-xs text-secondary font-light leading-relaxed">
                Route customer inquiries to specialized agents. Technical
                questions to engineering support, billing to finance, general to
                product.
              </p>
            </div>

            <div className="border border-[#2a2a2a] p-6">
              <h3 className="text-base font-medium mb-3">Content Creation</h3>
              <p className="text-xs text-secondary mb-4">
                Research → Writing → Editing → Publishing
              </p>
              <p className="text-xs text-secondary font-light leading-relaxed">
                Multi-stage content pipeline. Research agent gathers info,
                writer creates content, editor reviews, publisher formats and
                posts.
              </p>
            </div>

            <div className="border border-[#2a2a2a] p-6">
              <h3 className="text-base font-medium mb-3">Code Development</h3>
              <p className="text-xs text-secondary mb-4">
                Planning → Implementation → Testing → Documentation
              </p>
              <p className="text-xs text-secondary font-light leading-relaxed">
                Specialized agents for each phase. Architect plans, coder
                implements, tester validates, documenter writes guides.
              </p>
            </div>

            <div className="border border-[#2a2a2a] p-6">
              <h3 className="text-base font-medium mb-3">Data Analysis</h3>
              <p className="text-xs text-secondary mb-4">
                Collection → Processing → Visualization → Insights
              </p>
              <p className="text-xs text-secondary font-light leading-relaxed">
                Agent pipeline for data workflows. Collector fetches data,
                processor cleans, visualizer creates charts, analyst generates
                insights.
              </p>
            </div>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="space-y-8 mb-40">
          <h2 className="text-lg font-medium">Implementation</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-xs text-secondary">
                ◇ Single Model Approach
              </div>
              <div className="border border-[#3c3c3c] p-6 h-[28rem] overflow-y-auto">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// One model handles everything
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: \`You are a helpful assistant.
    
    Handle math questions, history questions,
    coding questions, and general inquiries.
    
    Be expert at everything!\`,
    tools: {
      calculate,
      searchHistory,
      runCode,
      webSearch,
      // ... 20 more tools
    }
  })

  return result.toDataStreamResponse()
}

// Issues:
// - No specialization
// - Tool overload
// - Poor performance on specific domains
// - Hard to maintain instructions`),
                  }}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-secondary">
                ◇ Multi-Agent Approach
              </div>
              <div className="border border-[#3c3c3c] p-6 h-[28rem] overflow-y-auto">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Specialized agents for each domain
import { Agent } from '@ai-sdk-tools/agents'
import { openai } from '@ai-sdk/openai'

const mathAgent = new Agent({
  name: 'Math Expert',
  model: openai('gpt-4o'),
  instructions: 'Expert at math. Show work.',
  tools: { calculate },
  matchOn: ['math', 'calculate', /\\d+/]
})

const historyAgent = new Agent({
  name: 'History Expert',
  model: openai('gpt-4o'),
  instructions: 'Expert at history. Cite dates.',
  tools: { searchHistory },
  matchOn: ['history', 'war', 'civilization']
})

const orchestrator = new Agent({
  name: 'Router',
  model: openai('gpt-4o-mini'),
  instructions: 'Route to specialists',
  handoffs: [mathAgent, historyAgent]
})

// Benefits:
// - Focused expertise
// - Relevant tools only
// - Better performance
// - Easy to maintain & extend`),
                  }}
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-6">
          <div className="border border-dashed border-muted-foreground p-6 max-w-xl mx-auto">
            <div className="text-sm flex items-center justify-between">
              <div>
                <span className="text-secondary">git: (main)$ </span>
                <span className="text-white">
                  npm i @ai-sdk-tools/agents ai zod
                </span>
              </div>
              <CopyButton
                text="npm i @ai-sdk-tools/agents ai zod"
                className="ml-4 hover:text-white"
                size={16}
              />
            </div>
          </div>

          <p className="text-xs text-[#555555] font-light">
            Multi-agent orchestration for AI SDK v5. Works with any AI provider.
          </p>

          <div className="pt-8">
            <Link
              href="/docs/agents"
              className="inline-block px-6 py-3 border border-[#333] hover:border-[#555] transition-colors text-sm"
            >
              View Documentation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
