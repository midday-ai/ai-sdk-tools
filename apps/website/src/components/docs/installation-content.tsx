"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { InstallScriptTabs } from "../install-script-tabs";

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
              <InstallScriptTabs packageName="@ai-sdk-tools/agents ai zod" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">State Management</h3>
              <p className="text-sm text-secondary mb-4">
                Global state management for AI applications with optimized
                performance.
              </p>
              <InstallScriptTabs packageName="@ai-sdk-tools/store" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Debugging Tools</h3>
              <p className="text-sm text-secondary mb-4">
                Powerful debugging and monitoring tool for AI applications.
              </p>
              <InstallScriptTabs packageName="@ai-sdk-tools/devtools" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Streaming Interfaces</h3>
              <p className="text-sm text-secondary mb-4">
                Advanced streaming interfaces with structured data and progress
                tracking.
              </p>
              <InstallScriptTabs packageName="@ai-sdk-tools/artifacts" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Universal Caching</h3>
              <p className="text-sm text-secondary mb-4">
                Cache expensive AI tool executions with zero configuration.
              </p>
              <InstallScriptTabs packageName="@ai-sdk-tools/cache" />
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

            <InstallScriptTabs
              packageName="@ai-sdk-tools/agents @ai-sdk-tools/store
                @ai-sdk-tools/devtools @ai-sdk-tools/artifacts
                @ai-sdk-tools/cache ai zod"
            />
          </div>
        </section>

        {/* Package Manager Support */}
        <section className="mb-40">
          <h2 className="text-2xl font-medium mb-8">Package Manager Support</h2>

          <div className="border border-[#3c3c3c] p-6">
            <h3 className="text-lg font-medium mb-4">
              Install Using Any Package Manager
            </h3>
            <p className="text-sm text-secondary mb-6">
              Use your preferred package manager to install any package from AI
              SDK Tools, for example:
            </p>
            <InstallScriptTabs packageName="@ai-sdk-tools/store" />
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
