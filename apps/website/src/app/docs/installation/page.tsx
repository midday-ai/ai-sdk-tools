import type { Metadata } from "next";
import Link from "next/link";
import { highlight } from "sugar-high";

export const metadata: Metadata = {
  title: "Installation Guide - AI SDK Tools",
  description:
    "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building powerful AI interfaces.",
  keywords: [
    "AI SDK installation",
    "AI tools installation",
    "AI SDK setup",
    "AI tools setup",
    "AI SDK install guide",
    "AI tools install guide",
    "AI SDK packages",
    "AI tools packages",
    "AI SDK npm install",
    "AI tools npm install",
  ],
  openGraph: {
    title: "Installation Guide - AI SDK Tools",
    description:
      "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building.",
    url: "https://ai-sdk-tools.dev/docs/installation",
  },
  twitter: {
    title: "Installation Guide - AI SDK Tools",
    description:
      "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building.",
  },
  alternates: {
    canonical: "/docs/installation",
  },
};

export default function InstallationPage() {
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
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ @ai-sdk-tools/store
              </h3>
              <p className="text-sm text-secondary mb-4">
                Global state management for AI applications. Drop-in replacement
                for @ai-sdk/react.
              </p>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`npm install @ai-sdk-tools/store`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ @ai-sdk-tools/devtools
              </h3>
              <p className="text-sm text-secondary mb-4">
                Powerful debugging and monitoring tool for AI applications.
              </p>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`npm install @ai-sdk-tools/devtools`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ @ai-sdk-tools/artifacts
              </h3>
              <p className="text-sm text-secondary mb-4">
                Advanced streaming interfaces for AI applications. Requires
                @ai-sdk-tools/store.
              </p>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`npm install @ai-sdk-tools/artifacts @ai-sdk-tools/store`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ @ai-sdk-tools/chrome-extension
              </h3>
              <p className="text-sm text-secondary mb-4">
                Chrome extension for debugging AI SDK applications in Chrome
                DevTools.
              </p>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`# Install from Chrome Web Store (coming soon)
# Or build from source:
git clone https://github.com/midday-ai/ai-sdk-tools
cd packages/chrome-extension
bun run setup`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Toolkit */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Complete Toolkit</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ All Packages at Once</h3>
            <p className="text-sm text-secondary mb-4">
              Install all packages for the complete AI SDK Tools experience:
            </p>
            <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
              <pre className="text-xs font-mono text-[#d4d4d4]">
                {`npm install @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts`}
              </pre>
            </div>
          </div>
        </section>

        {/* Package Managers */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Package Managers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">npm</h3>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`npm install @ai-sdk-tools/store`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">yarn</h3>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`yarn add @ai-sdk-tools/store`}
                </pre>
              </div>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">pnpm</h3>
              <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                <pre className="text-xs font-mono text-[#d4d4d4]">
                  {`pnpm add @ai-sdk-tools/store`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Requirements</h2>

          <div className="space-y-6">
            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">
                ◇ System Requirements
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Node.js 18+ (recommended: 20+)</li>
                <li>• React 16.8+ or Next.js 13+</li>
                <li>• TypeScript 4.5+ (recommended)</li>
                <li>• Modern browser with ES2020 support</li>
              </ul>
            </div>

            <div className="border border-[#3c3c3c] p-6">
              <h3 className="text-lg font-medium mb-4">◇ Peer Dependencies</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  • <code>ai</code> - Vercel AI SDK (required for all packages)
                </li>
                <li>
                  • <code>react</code> - React library (required for React
                  packages)
                </li>
                <li>
                  • <code>zod</code> - Schema validation (required for
                  artifacts)
                </li>
                <li>
                  • <code>zustand</code> - State management (required for store)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Framework Support */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Framework Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">⚛️ React</div>
              <p className="text-xs text-secondary">
                Full support for React 16.8+
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">▲ Next.js</div>
              <p className="text-xs text-secondary">
                Optimized for Next.js 13+ with App Router
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">⚡ Vite</div>
              <p className="text-xs text-secondary">
                Works with Vite and other build tools
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">
                🔧 Create React App
              </div>
              <p className="text-xs text-secondary">
                Compatible with CRA and similar tools
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">📱 React Native</div>
              <p className="text-xs text-secondary">
                Store package works with React Native
              </p>
            </div>
            <div className="border border-[#3c3c3c] p-6">
              <div className="text-sm font-medium mb-3">🌐 SSR/SSG</div>
              <p className="text-xs text-secondary">
                Server-side rendering support
              </p>
            </div>
          </div>
        </section>

        {/* TypeScript Support */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">TypeScript Support</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              ◇ Full TypeScript Support
            </h3>
            <p className="text-sm text-secondary mb-4">
              All packages include comprehensive TypeScript definitions and are
              built with TypeScript-first design:
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium mb-2">Type Safety</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Full type definitions included</li>
                    <li>• Generic support for custom types</li>
                    <li>• IntelliSense and autocompletion</li>
                    <li>• Compile-time error checking</li>
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">
                    Advanced Features
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Custom message types with tools</li>
                    <li>• Schema validation with Zod</li>
                    <li>• Context typing for artifacts</li>
                    <li>• Event type definitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Verification</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">◇ Verify Installation</h3>
            <p className="text-sm text-secondary mb-4">
              After installation, verify that everything is working correctly:
            </p>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">
                  1. Check package installation
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                  <pre className="text-xs font-mono text-[#d4d4d4]">
                    {`npm list @ai-sdk-tools/store`}
                  </pre>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">
                  2. Test basic import
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a]">
                  <pre
                    className="text-xs font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`// Test import
import { useChat } from '@ai-sdk-tools/store'

// Should work without TypeScript errors
console.log('AI SDK Tools installed successfully!')`),
                    }}
                  />
                </div>
              </div>
            </div>
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
                    Installation fails?
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Check Node.js version (18+ required)</li>
                    <li>
                      • Clear npm cache: <code>npm cache clean --force</code>
                    </li>
                    <li>
                      • Delete node_modules and package-lock.json, then
                      reinstall
                    </li>
                    <li>• Check for conflicting package versions</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    TypeScript errors?
                  </div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Ensure TypeScript 4.5+ is installed</li>
                    <li>
                      • Check tsconfig.json includes node_modules/@ai-sdk-tools
                    </li>
                    <li>• Restart TypeScript server in your IDE</li>
                    <li>• Update @types packages if needed</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Build errors?</div>
                  <ul className="space-y-1 text-xs text-secondary">
                    <li>• Check peer dependencies are installed</li>
                    <li>• Verify React version compatibility</li>
                    <li>• Check build tool configuration</li>
                    <li>• Look for conflicting React versions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/quickstart" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Quickstart Guide
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Get up and running in minutes with our step-by-step quickstart
                  guide.
                </p>
              </div>
            </Link>

            <Link href="/docs/store" className="group">
              <div className="border border-[#3c3c3c] p-6 hover:border-[#555] transition-colors">
                <div className="text-lg font-medium mb-3 group-hover:text-[#d4d4d4] transition-colors">
                  ◇ Store Documentation
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed">
                  Learn about global state management and advanced patterns.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium">Ready to Start Building?</h2>
            <p className="text-xs text-secondary font-light">
              Choose your packages and start building powerful AI applications
              today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/docs/quickstart"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Quickstart →
              </Link>
              <Link
                href="/docs"
                className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
              >
                Documentation →
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
