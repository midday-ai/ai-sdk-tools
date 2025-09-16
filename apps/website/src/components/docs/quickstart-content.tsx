"use client";

import Link from "next/link";
import { highlight } from "sugar-high";

export default function QuickstartContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Quickstart Guide
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Get up and running with AI SDK Tools in minutes. This guide will
              help you install the packages and create your first AI
              application.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-40">
          <h2 className="text-2xl font-normal mb-8">Installation</h2>
          <div className="max-w-4xl">
            <p className="text-secondary mb-8">
              Choose the packages you need or install the complete toolkit:
            </p>

            <div className="space-y-8">
              {/* Individual Packages */}
              <div>
                <h3 className="text-xl font-normal mb-4">
                  Individual Packages
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-normal mb-2">
                      State Management
                    </h4>
                    <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                      <code className="text-sm">npm i @ai-sdk-tools/store</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "npm i @ai-sdk-tools/store",
                          );
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
                    <h4 className="text-lg font-normal mb-2">
                      Debugging Tools
                    </h4>
                    <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                      <code className="text-sm">
                        npm i @ai-sdk-tools/devtools
                      </code>
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
                    <h4 className="text-lg font-normal mb-2">
                      Streaming Interfaces
                    </h4>
                    <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                      <code className="text-sm">
                        npm i @ai-sdk-tools/artifacts
                      </code>
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
                </div>
              </div>

              {/* Complete Toolkit */}
              <div>
                <h3 className="text-xl font-normal mb-4">Complete Toolkit</h3>
                <div className="flex items-center justify-between border border-dashed border-[#2a2a2a] px-3 py-1.5 max-w-md mb-8">
                  <code className="text-sm">
                    npm i @ai-sdk-tools/store @ai-sdk-tools/devtools
                    @ai-sdk-tools/artifacts
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "npm i @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts",
                      );
                    }}
                    className="text-[#888] hover:text-white transition-colors"
                    aria-label="Copy command"
                    title='Copy "npm i @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts" to clipboard'
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
          </div>
        </section>

        {/* Basic Usage */}
        <section className="mb-40">
          <h2 className="text-2xl font-normal mb-8">Basic Usage</h2>
          <div className="max-w-4xl">
            <p className="text-secondary mb-8">
              Here's a simple example to get you started with AI SDK Tools:
            </p>

            <div className="space-y-8">
              {/* Store Example */}
              <div>
                <h3 className="text-xl font-normal mb-4">
                  1. Set up the Store
                </h3>
                <div
                  className="bg-transparent border border-[#2a2a2a] p-6 rounded-lg overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`
import { createAIStore } from '@ai-sdk-tools/store';

const store = createAIStore({
  initialMessages: [],
  onFinish: (message) => {
    console.log('Message finished:', message);
  },
});

export { store };`),
                  }}
                />
              </div>

              {/* DevTools Example */}
              <div>
                <h3 className="text-xl font-normal mb-4">2. Add DevTools</h3>
                <div
                  className="bg-transparent border border-[#2a2a2a] p-6 rounded-lg overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`
import { AIDevTools } from '@ai-sdk-tools/devtools';

function App() {
  return (
    <div>
      <AIDevTools />
      {/* Your app content */}
    </div>
  );
}`),
                  }}
                />
              </div>

              {/* Artifacts Example */}
              <div>
                <h3 className="text-xl font-normal mb-4">3. Use Artifacts</h3>
                <div
                  className="bg-transparent border border-[#2a2a2a] p-6 rounded-lg overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: highlight(`
import { createArtifact } from '@ai-sdk-tools/artifacts';

const burnRateArtifact = createArtifact({
  name: 'burn-rate',
  description: 'Calculate burn rate metrics',
  schema: z.object({
    monthlyBurn: z.number(),
    runway: z.number(),
  }),
});`),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-normal mb-8">Next Steps</h2>
          <div className="max-w-4xl">
            <p className="text-secondary mb-8">
              Now that you have the basics, explore our detailed documentation:
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <Link
                href="/docs/store"
                className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
              >
                <h3 className="text-lg font-medium mb-4 group-hover:text-white transition-colors">
                  Store Documentation
                </h3>
                <p className="text-sm text-secondary mb-6">
                  Learn about global state management, hooks, and advanced
                  patterns.
                </p>
                <div className="text-xs text-[#888] group-hover:text-[#aaa] transition-colors">
                  Read more →
                </div>
              </Link>

              <Link
                href="/docs/devtools"
                className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
              >
                <h3 className="text-lg font-medium mb-4 group-hover:text-white transition-colors">
                  DevTools Documentation
                </h3>
                <p className="text-sm text-secondary mb-6">
                  Master debugging and monitoring with our powerful DevTools.
                </p>
                <div className="text-xs text-[#888] group-hover:text-[#aaa] transition-colors">
                  Read more →
                </div>
              </Link>

              <Link
                href="/docs/artifacts"
                className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
              >
                <h3 className="text-lg font-medium mb-4 group-hover:text-white transition-colors">
                  Artifacts Documentation
                </h3>
                <p className="text-sm text-secondary mb-6">
                  Build advanced streaming interfaces with structured data.
                </p>
                <div className="text-xs text-[#888] group-hover:text-[#aaa] transition-colors">
                  Read more →
                </div>
              </Link>

              <Link
                href="/docs/chrome-extension"
                className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
              >
                <h3 className="text-lg font-medium mb-4 group-hover:text-white transition-colors">
                  Chrome Extension
                </h3>
                <p className="text-sm text-secondary mb-6">
                  Debug directly in Chrome DevTools with our browser extension.
                </p>
                <div className="text-xs text-[#888] group-hover:text-[#aaa] transition-colors">
                  Read more →
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
