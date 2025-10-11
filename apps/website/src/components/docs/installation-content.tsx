"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function InstallationContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Installation
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Install individual packages or get the complete toolkit for
              building AI applications. Choose what you need and start building
              powerful AI interfaces.
            </p>
          </div>
        </section>

        {/* Individual Packages */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Individual Packages</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Multi-Agent Orchestration
              </h3>
              <p className="text-sm text-secondary mb-4">
                Build intelligent workflows with specialized agents and
                automatic handoffs.
              </p>
              <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                <code className="text-sm">
                  npm i @ai-sdk-tools/agents ai zod
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "npm i @ai-sdk-tools/agents ai zod",
                    );
                  }}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="Copy command"
                  title='Copy "npm i @ai-sdk-tools/agents ai zod" to clipboard'
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>Copy to clipboard</title>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">State Management</h3>
              <p className="text-sm text-secondary mb-4">
                Global state management for AI applications with optimized
                performance.
              </p>
              <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                <code className="text-sm">npm i @ai-sdk-tools/store</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("npm i @ai-sdk-tools/store");
                  }}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="Copy command"
                  title='Copy "npm i @ai-sdk-tools/store" to clipboard'
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>Copy to clipboard</title>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Debugging Tools</h3>
              <p className="text-sm text-secondary mb-4">
                Powerful debugging and monitoring tool for AI applications.
              </p>
              <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                <code className="text-sm">npm i @ai-sdk-tools/devtools</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "npm i @ai-sdk-tools/devtools",
                    );
                  }}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="Copy command"
                  title='Copy "npm i @ai-sdk-tools/devtools" to clipboard'
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>Copy to clipboard</title>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Streaming Interfaces</h3>
              <p className="text-sm text-secondary mb-4">
                Advanced streaming interfaces with structured data and progress
                tracking.
              </p>
              <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                <code className="text-sm">npm i @ai-sdk-tools/artifacts</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "npm i @ai-sdk-tools/artifacts",
                    );
                  }}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="Copy command"
                  title='Copy "npm i @ai-sdk-tools/artifacts" to clipboard'
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>Copy to clipboard</title>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Universal Caching</h3>
              <p className="text-sm text-secondary mb-4">
                Cache expensive AI tool executions with zero configuration.
              </p>
              <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                <code className="text-sm">npm i @ai-sdk-tools/cache</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("npm i @ai-sdk-tools/cache");
                  }}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="Copy command"
                  title='Copy "npm i @ai-sdk-tools/cache" to clipboard'
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>Copy to clipboard</title>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Toolkit */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Complete Toolkit</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">Install Everything</h3>
            <p className="text-sm text-secondary mb-6">
              Get all packages at once for the complete AI SDK Tools experience:
            </p>

            <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
              <code className="text-sm">
                npm i @ai-sdk-tools/agents @ai-sdk-tools/store
                @ai-sdk-tools/devtools @ai-sdk-tools/artifacts
                @ai-sdk-tools/cache ai zod
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "npm i @ai-sdk-tools/agents @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts @ai-sdk-tools/cache ai zod",
                  );
                }}
                className="text-[#888] hover:text-white transition-colors"
                aria-label="Copy command"
                title='Copy "npm i @ai-sdk-tools/agents @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts @ai-sdk-tools/cache ai zod" to clipboard'
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>Copy to clipboard</title>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Package Manager Support */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Package Manager Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">npm</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`npm install @ai-sdk-tools/store`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">yarn</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`yarn add @ai-sdk-tools/store`),
                  }}
                />
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">pnpm</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`pnpm add @ai-sdk-tools/store`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Requirements</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Dependencies</h3>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// Required peer dependencies
"@ai-sdk/react": "^0.0.66"
"react": "^18.0.0"
"zod": "^3.0.0" // For artifacts package`),
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">TypeScript</h3>
              <p className="text-sm text-secondary mb-4">
                Full TypeScript support with type definitions included:
              </p>
              <div className="bg-transparent p-4 rounded border border-[#2a2a2a]">
                <pre
                  className="text-xs font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`// TypeScript configuration
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-medium mb-8">Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/docs/quickstart"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                Quickstart Guide
              </h3>
              <p className="text-secondary mb-6">
                Get up and running in minutes with our comprehensive quickstart
                guide.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Start building →
              </div>
            </Link>

            <Link
              href="/docs/store"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                Store Documentation
              </h3>
              <p className="text-secondary mb-6">
                Learn about global state management and advanced patterns.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Read more →
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
