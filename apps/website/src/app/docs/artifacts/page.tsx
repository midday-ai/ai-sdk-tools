import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Artifacts Documentation - AI SDK Tools",
  description:
    "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts that stream real-time updates from AI tools to React components with progress tracking and error handling.",
  keywords: [
    "AI SDK artifacts",
    "AI streaming interfaces",
    "AI tool streaming",
    "AI progress tracking",
    "AI error handling",
    "AI structured data",
    "AI type-safe streaming",
    "AI real-time updates",
    "AI streaming components",
    "AI tools streaming",
  ],
  openGraph: {
    title: "Artifacts Documentation - AI SDK Tools",
    description:
      "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts with real-time updates and progress tracking.",
    url: "https://ai-sdk-tools.dev/docs/artifacts",
  },
  twitter: {
    title: "Artifacts Documentation - AI SDK Tools",
    description:
      "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts with real-time updates and progress tracking.",
  },
  alternates: {
    canonical: "/docs/artifacts",
  },
};

export default function ArtifactsPage() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Artifacts
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Advanced streaming interfaces for AI applications. Create
              structured, type-safe artifacts that stream real-time updates from
              AI tools to React components with progress tracking and error
              handling.
            </p>

            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
              <span className="text-[#d4d4d4] text-xs font-mono">
                npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    "npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store",
                  )
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store" to clipboard`}
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

        {/* Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🎯 Type-Safe Streaming
              </div>
              <p className="text-xs text-secondary">
                Full TypeScript support with Zod schema validation
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔄 Real-time Updates
              </div>
              <p className="text-xs text-secondary">
                Stream partial updates with progress tracking
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">🎨 Clean API</div>
              <p className="text-xs text-secondary">
                Minimal boilerplate, maximum flexibility
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🏪 State Management
              </div>
              <p className="text-xs text-secondary">
                Built on @ai-sdk-tools/store for efficient message handling
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                ⚡ Performance Optimized
              </div>
              <p className="text-xs text-secondary">
                Efficient state management and updates
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">🔧 Context Support</div>
              <p className="text-xs text-secondary">
                Access typed context in your AI tools
              </p>
            </div>
          </div>
        </section>

        {/* Why Both Packages */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">
            Why Do You Need Both Packages?
          </h2>

          <div className="border border-[#3c3c3c] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-lg font-medium mb-4">
                  @ai-sdk-tools/artifacts
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  <li>• Provides artifact streaming and management APIs</li>
                  <li>• Zod schema validation</li>
                  <li>• Progress tracking and error handling</li>
                  <li>• Context support for tools</li>
                </ul>
              </div>
              <div>
                <div className="text-lg font-medium mb-4">
                  @ai-sdk-tools/store
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  <li>• Required for message state management</li>
                  <li>• React hooks for consuming artifacts</li>
                  <li>• Efficient message extraction from streams</li>
                  <li>• Optimized re-renders</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-secondary mt-6">
              The artifacts package uses the store package's{" "}
              <code>useChatMessages</code> hook to efficiently extract and track
              artifact data from AI SDK message streams, ensuring optimal
              performance.
            </p>
          </div>
        </section>

        {/* Setup */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Setup</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 1. Initialize Chat with Store
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useChat } from '@ai-sdk-tools/store'; // Drop-in replacement for @ai-sdk/react
import { DefaultChatTransport } from 'ai';

function ChatComponent() {
  // Initialize chat (same API as @ai-sdk/react)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  });

  return (
    <div>
      {/* Your chat UI */}
      <ArtifactDisplay /> {/* Artifacts work from any component */}
    </div>
  );
}`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 2. Use Artifacts from Any Component
              </h3>
              <p className="text-sm text-secondary mb-4">
                The <code>useArtifact</code> hook automatically connects to the
                global chat store to extract artifact data from message streams
                - no prop drilling needed!
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Quick Start</h2>

          <div className="space-y-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 1. Define an Artifact
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { artifact } from '@ai-sdk-tools/artifacts';
import { z } from 'zod';

const BurnRate = artifact('burn-rate', z.object({
  title: z.string(),
  stage: z.enum(['loading', 'processing', 'complete']).default('loading'),
  data: z.array(z.object({
    month: z.string(),
    burnRate: z.number()
  })).default([])
}));`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 2. Create a Tool with Context
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Use direct AI SDK tool format
const analyzeBurnRate = {
  description: 'Analyze company burn rate',
  inputSchema: z.object({
    company: z.string()
  }),
  execute: async ({ company }: { company: string }) => {
    // Access typed context in tools
    const context = getContext(); // Fully typed as MyContext
    
    console.log('Processing for user:', context.userId);
    console.log('Theme:', context.config.theme);
    
    const analysis = BurnRate.stream({
      title: \`\${company} Analysis for \${context.userId}\`,
      stage: 'loading'
    });

    // Stream updates
    analysis.progress = 0.5;
    await analysis.update({ stage: 'processing' });
    
    // Complete
    await analysis.complete({
      title: \`\${company} Analysis\`,
      stage: 'complete',
      data: [{ month: '2024-01', burnRate: 50000 }]
    });

    return 'Analysis complete';
  }
};`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 3. Set Up Route with Context
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { createTypedContext, BaseContext } from '@ai-sdk-tools/artifacts';
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Define your context type
interface MyContext extends BaseContext {
  userId: string;
  permissions: string[];
  config: { theme: 'light' | 'dark' };
}

// Create typed context helpers
const { setContext, getContext } = createTypedContext<MyContext>();

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set typed context
      setContext({
        writer,
        userId: req.headers.get('user-id') || 'anonymous',
        permissions: ['read', 'write'],
        config: { theme: 'dark' }
      });

      const result = streamText({
        model: openai('gpt-4'),
        messages,
        tools: { analyzeBurnRate }
      });

      writer.merge(result.toUIMessageStream());
    }
  });

  return createUIMessageStreamResponse({ stream });
};`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ 4. Consume in React
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { useArtifact } from '@ai-sdk-tools/artifacts';

function Analysis() {
  const { data, status, progress } = useArtifact(BurnRate, {
    onComplete: (data) => console.log('Done!', data),
    onError: (error) => console.error('Failed:', error)
  });

  if (!data) return null;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>Stage: {data.stage}</p>
      {progress && <div>Progress: {progress * 100}%</div>}
      {data.data.map(item => (
        <div key={item.month}>
          {item.month}: \${item.burnRate.toLocaleString()}
        </div>
      ))}
    </div>
  );
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
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ artifact(id, schema)
              </h3>
              <p className="text-sm text-secondary mb-4">
                Creates an artifact definition with Zod schema validation.
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`const MyArtifact = artifact('my-artifact', z.object({
  title: z.string(),
  data: z.array(z.any())
}));`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ useArtifact(artifact, callbacks?)
              </h3>
              <p className="text-sm text-secondary mb-4">
                React hook for consuming streaming artifacts.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Returns:</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • <code>data</code> - Current artifact payload
                    </li>
                    <li>
                      • <code>status</code> - Current status ('idle' | 'loading'
                      | 'streaming' | 'complete' | 'error')
                    </li>
                    <li>
                      • <code>progress</code> - Progress value (0-1)
                    </li>
                    <li>
                      • <code>error</code> - Error message if failed
                    </li>
                    <li>
                      • <code>isActive</code> - Whether artifact is currently
                      processing
                    </li>
                    <li>
                      • <code>hasData</code> - Whether artifact has any data
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Callbacks:</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>
                      • <code>onUpdate(data, prevData)</code> - Called when data
                      updates
                    </li>
                    <li>
                      • <code>onComplete(data)</code> - Called when artifact
                      completes
                    </li>
                    <li>
                      • <code>onError(error, data)</code> - Called on error
                    </li>
                    <li>
                      • <code>onProgress(progress, data)</code> - Called on
                      progress updates
                    </li>
                    <li>
                      • <code>onStatusChange(status, prevStatus)</code> - Called
                      when status changes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Context Support</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { createTypedContext, BaseContext } from '@ai-sdk-tools/artifacts';

// Define your context type
interface MyContext extends BaseContext {
  userId: string;
  permissions: string[];
  config: { theme: 'light' | 'dark' };
}

// Create typed context helpers
const { setContext, getContext } = createTypedContext<MyContext>();

// In your tool
const myTool = {
  execute: async () => {
    const context = getContext(); // Fully typed!
    console.log(context.userId); // TypeScript knows this exists
  }
};`),
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
              <h3 className="text-lg font-medium mb-4">◇ Burn Rate Analysis</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
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

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Progress Tracking</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`function ProgressTracker() {
  const { data, status, progress } = useArtifact(MyArtifact, {
    onProgress: (progress, data) => {
      console.log(\`Progress: \${progress * 100}%\`)
    },
    onComplete: (data) => {
      console.log('Artifact completed!', data)
    },
    onError: (error) => {
      console.error('Artifact failed:', error)
    }
  })

  return (
    <div>
      {status === 'streaming' && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: \`\${(progress || 0) * 100}%\` }}
          />
        </div>
      )}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Use Cases</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">📊 Data Analysis</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Financial reports with real-time updates</li>
                <li>• Data visualization with progress tracking</li>
                <li>• Complex calculations with intermediate results</li>
                <li>• Multi-step analysis workflows</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                🎨 Content Generation
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Document generation with live preview</li>
                <li>• Code generation with syntax highlighting</li>
                <li>• Image processing with progress updates</li>
                <li>• Multi-format content creation</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔧 Development Tools</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Code analysis with real-time results</li>
                <li>• Testing frameworks with progress tracking</li>
                <li>• Build processes with status updates</li>
                <li>• Deployment monitoring</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                🎯 Business Applications
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Report generation with live updates</li>
                <li>• Dashboard creation with real-time data</li>
                <li>• Workflow automation with progress tracking</li>
                <li>• Customer analytics with streaming updates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Best Practices</h2>

          <div className="space-y-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Schema Design</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Use descriptive artifact IDs that match your use case</li>
                <li>
                  • Design schemas with optional fields for progressive loading
                </li>
                <li>• Include status fields to track processing stages</li>
                <li>• Use arrays for data that can grow over time</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Performance</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Use selective subscriptions with custom selectors</li>
                <li>
                  • Implement proper error boundaries around artifact components
                </li>
                <li>• Consider throttling for high-frequency updates</li>
                <li>• Clean up event listeners in useEffect cleanup</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Error Handling</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Always provide onError callbacks</li>
                <li>• Implement retry logic for failed artifacts</li>
                <li>• Show meaningful error messages to users</li>
                <li>• Log errors for debugging purposes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">
              Ready to Build Advanced AI Applications?
            </h2>
            <p className="text-xs text-secondary font-light">
              Install the artifacts package and start creating structured,
              streaming AI experiences.
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
