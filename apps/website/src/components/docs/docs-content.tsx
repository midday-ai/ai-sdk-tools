"use client";

import Link from "next/link";

export default function DocsContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Documentation
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Everything you need to build powerful AI applications with our
              tools. From quick setup to advanced patterns, we've got you
              covered.
            </p>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-40">
          <h2 className="text-2xl font-normal mb-8">Getting Started</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <Link
              href="/docs/quickstart"
              className="h-full flex flex-col group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                  Quickstart
                </h3>
                <p className="text-secondary mb-6 flex-grow">
                  Get up and running in minutes with our comprehensive
                  quickstart guide.
                </p>
                <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                  Start building →
                </div>
              </div>
            </Link>

            <Link
              href="/docs/installation"
              className="h-full flex flex-col group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                  Installation
                </h3>
                <p className="text-secondary mb-6 flex-grow">
                  Install individual packages or get the complete toolkit for
                  your project.
                </p>
                <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                  Install packages →
                </div>
              </div>
            </Link>

            <Link
              href="/docs/migration"
              className="h-full flex flex-col group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                  Migration
                </h3>
                <p className="text-secondary mb-6 flex-grow">
                  Migrate from standard AI SDK to our enhanced tools with
                  minimal changes.
                </p>
                <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                  Migrate now →
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Packages */}
        <section className="mb-40">
          <h2 className="text-2xl font-normal mb-8">Packages</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Link
              href="/docs/store"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                @ai-sdk-tools/store
              </h3>
              <p className="text-secondary mb-6">
                Global state management for AI applications. Drop-in replacement
                for @ai-sdk/react with global access and optimized performance.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Learn more →
              </div>
            </Link>

            <Link
              href="/docs/devtools"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                @ai-sdk-tools/devtools
              </h3>
              <p className="text-secondary mb-6">
                Powerful debugging and monitoring tool for AI applications with
                real-time insights and performance metrics.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Learn more →
              </div>
            </Link>

            <Link
              href="/docs/artifacts"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                @ai-sdk-tools/artifacts
              </h3>
              <p className="text-secondary mb-6">
                Advanced streaming interfaces for AI applications with
                structured data, progress tracking, and error handling.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Learn more →
              </div>
            </Link>

            <Link
              href="/docs/chrome-extension"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                chrome-extension
              </h3>
              <p className="text-secondary mb-6">
                Chrome extension for debugging AI SDK applications directly in
                Chrome DevTools with native integration.
              </p>
              <div className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">
                Learn more →
              </div>
            </Link>
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-2xl font-normal mb-8">Examples</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Link
              href="/store"
              className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
            >
              <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                Live Demo
              </h3>
              <p className="text-secondary mb-6">
                Try our tools in action with interactive examples and real-time
                demonstrations.
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
                View source code, contribute, and explore more examples in our
                GitHub repository.
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
