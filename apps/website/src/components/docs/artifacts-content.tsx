"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function ArtifactsContent() {
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
                npm i @ai-sdk-tools/artifacts
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText("npm i @ai-sdk-tools/artifacts")
                }
                className="text-secondary hover:text-[#d4d4d4] transition-colors p-1"
                title={`Copy "npm i @ai-sdk-tools/artifacts" to clipboard`}
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

        {/* What it does */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">What it does</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🌊 Streaming</h3>
              <p className="text-sm text-secondary">
                Stream real-time updates from AI tools to React components with
                smooth, responsive interfaces.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">📊 Progress</h3>
              <p className="text-sm text-secondary">
                Track progress and show loading states as AI tools process
                requests and generate responses.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🔒 Type Safety</h3>
              <p className="text-sm text-secondary">
                Full TypeScript support with schema validation using Zod for
                type-safe data structures.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">⚡ Performance</h3>
              <p className="text-sm text-secondary">
                Optimized rendering with selective updates and efficient state
                management.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🛠️ Error Handling</h3>
              <p className="text-sm text-secondary">
                Built-in error handling with retry mechanisms and graceful
                fallbacks.
              </p>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">🎨 Customizable</h3>
              <p className="text-sm text-secondary">
                Highly customizable with support for custom UI components and
                styling.
              </p>
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
                    __html: highlight(`npm install @ai-sdk-tools/artifacts`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                2. Create an artifact
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { createArtifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

const burnRateArtifact = createArtifact({
  name: 'burn-rate',
  description: 'Calculate burn rate metrics',
  schema: z.object({
    monthlyBurn: z.number(),
    runway: z.number(),
  }),
})`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                3. Use in your component
              </h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`function BurnRateChart() {
  const { data, isLoading, error } = useArtifact(burnRateArtifact)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{data?.monthlyBurn}</div>
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Features</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Schema Validation</h3>
              <p className="text-sm text-secondary mb-4">
                Define data structures with Zod schemas for type safety and
                validation:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`const userProfileArtifact = createArtifact({
  name: 'user-profile',
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark']),
      notifications: z.boolean(),
    }),
  }),
})`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Progress Tracking</h3>
              <p className="text-sm text-secondary mb-4">
                Track progress and show loading states:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`function ProgressBar() {
  const { progress, isLoading } = useArtifact(processingArtifact)
  
  return (
    <div>
      {isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      )}
    </div>
  )
}`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Error Handling</h3>
              <p className="text-sm text-secondary mb-4">
                Built-in error handling with retry mechanisms:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`const resilientArtifact = createArtifact({
  name: 'resilient-data',
  schema: z.object({ data: z.string() }),
  retry: {
    attempts: 3,
    delay: 1000,
  },
  onError: (error) => {
    console.error('Artifact error:', error)
    // Custom error handling
  },
})`),
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
              <h3 className="text-lg font-medium mb-4">createArtifact</h3>
              <p className="text-sm text-secondary mb-4">
                Create a new artifact with schema validation:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`createArtifact({
  name: string, // Unique artifact name
  description?: string, // Optional description
  schema: ZodSchema, // Zod schema for validation
  retry?: {
    attempts: number,
    delay: number,
  },
  onError?: (error: Error) => void,
  onSuccess?: (data: any) => void,
})`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">useArtifact</h3>
              <p className="text-sm text-secondary mb-4">
                Hook for using artifacts in React components:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`const {
  data, // Current artifact data
  isLoading, // Loading state
  error, // Error state
  progress, // Progress percentage (0-100)
  retry, // Retry function
  refresh, // Refresh function
} = useArtifact(artifact)`),
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
                Try artifacts in action with our interactive demo.
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
