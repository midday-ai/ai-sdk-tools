"use client";

import Link from "next/link";
import { highlight } from "sugar-high";
import { CopyButton } from "../copy-button";
import { InstallScriptTabs } from "../install-script-tabs";

export default function CacheContent() {
  return (
    <main className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-[95rem] mx-auto px-8 py-32 relativez-10">
        {/* Hero */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-normal leading-tight tracking-wide mb-6">
              Cache
            </h1>
            <p className="text-base text-secondary max-w-3xl leading-relaxed font-light mb-12">
              Universal caching wrapper for AI SDK tools. Cache expensive tool
              executions with zero configuration - works with regular tools,
              streaming tools, and artifacts.
            </p>

            <InstallScriptTabs packageName="@ai-sdk-tools/cache" />
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Quick Start</h2>
            <div className="space-y-8">
              <div className="border border-[#2a2a2a] p-6">
                <pre
                  className="text-sm font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(`import { cached } from '@ai-sdk-tools/cache'

const expensiveWeatherTool = tool({
  description: 'Get weather data',
  parameters: z.object({
    location: z.string()
  }),
  execute: async ({ location }) => {
    // Expensive API call
    return await weatherAPI.get(location)
  }
})

// Cache with one line
const weatherTool = cached(expensiveWeatherTool)

// First call: 2s API request
// Next calls: <1ms from cache ⚡`),
                  }}
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>
        </section>

        {/* Universal Tool Support */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">
              Universal Tool Support
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-normal mb-4">
                  Regular Tools (async function)
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`const apiTool = cached(tool({
  execute: async ({ query }) => {
    return await api.search(query) // Cached return value
  }
}))`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Streaming Tools (async function*)
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`const streamingTool = cached(tool({
  execute: async function* ({ params }) {
    yield { text: "Processing..." } // Cached yields
    yield { text: "Complete!" }
  }
}))`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Artifact Tools (with writer data)
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`const artifactTool = cached(tool({
  execute: async function* ({ data }) => {
    const analysis = artifact.stream({ ... })
    await analysis.update({ charts, metrics }) // Cached writer messages
    yield { text: "Done" }
  }
}))`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cache Backends */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Cache Backends</h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-normal mb-4">
                  LRU Cache (Default)
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { cached } from '@ai-sdk-tools/cache'

// Uses LRU cache automatically
const weatherTool = cached(expensiveWeatherTool, {
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 1000, // Max 1000 cached items
})`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Redis Cache (Production)
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(`import { createCachedFunction, createCacheBackend } from '@ai-sdk-tools/cache'
import Redis from 'redis'

const redis = Redis.createClient({
  url: process.env.REDIS_URL
})

const redisBackend = createCacheBackend({
  type: 'redis',
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  redis: {
    client: redis,
    keyPrefix: 'ai-tools:'
  }
})

export const cached = createCachedFunction(redisBackend)`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-4">
                  Environment-Aware Setup
                </h3>
                <div className="border border-[#2a2a2a] p-6">
                  <pre
                    className="text-sm font-mono leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlight(`const backend = process.env.REDIS_URL 
  ? createCacheBackend({
      type: 'redis',
      defaultTTL: 30 * 60 * 1000,
      redis: { client: Redis.createClient({ url: process.env.REDIS_URL }) }
    })
  : createCacheBackend({
      type: 'lru',
      maxSize: 1000,
      defaultTTL: 10 * 60 * 1000
    })

export const cached = createCachedFunction(backend)
// Production: Redis, Development: LRU`),
                    }}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Streaming Tools Requirements */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">
              Streaming Tools Requirements
            </h2>
            <p className="text-base text-secondary mb-6 leading-relaxed font-light">
              For complete caching of streaming tools with artifacts, ensure
              your API route passes the writer:
            </p>

            <div className="border border-[#2a2a2a] p-6 mb-8">
              <pre
                className="text-sm font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(`// API route setup (required for artifact caching)
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    setContext({ writer }) // Set up artifacts context
    
    const result = streamText({
      model: openai("gpt-4o"),
      tools: { analysis: cachedAnalysisTool },
      experimental_context: { writer }, // ← Essential for artifact caching
    })
    
    writer.merge(result.toUIMessageStream())
  }
})`),
                }}
                suppressHydrationWarning
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-6">
              <p className="font-medium mb-4">
                <strong>Important:</strong> Without{" "}
                <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                  experimental_context: {`{ writer }`}
                </code>
                :
              </p>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Streaming text is cached
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  Artifact data (charts, metrics) is missing on cache hits
                </li>
              </ul>
              <p className="font-medium mb-2">
                <strong>With proper setup:</strong>
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Complete data preservation - everything cached and restored
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Performance Benefits */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Performance Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-lg font-medium mb-3">
                  10x faster responses
                </h3>
                <p className="text-sm text-secondary">for repeated requests</p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-lg font-medium mb-3">80% cost reduction</h3>
                <p className="text-sm text-secondary">
                  by avoiding duplicate calls
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-lg font-medium mb-3">
                  Smooth agent conversations
                </h3>
                <p className="text-sm text-secondary">
                  with instant cached results
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-lg font-medium mb-3">
                  Complete data preservation
                </h3>
                <p className="text-sm text-secondary">
                  streaming, artifacts, everything
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">API Reference</h2>
            <div className="space-y-8">
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-xl font-normal mb-4">
                  cached(tool, options?)
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Wraps an AI SDK tool with caching capabilities.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium mb-2">Parameters</h4>
                    <ul className="text-sm text-secondary space-y-1">
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          tool
                        </code>{" "}
                        - Any AI SDK tool
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          options
                        </code>{" "}
                        - Optional cache configuration
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base font-medium mb-2">Options</h4>
                    <ul className="text-sm text-secondary space-y-1">
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          ttl
                        </code>{" "}
                        - Time to live in milliseconds (default: 5 minutes)
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          maxSize
                        </code>{" "}
                        - Maximum cache size (default: 1000)
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          store
                        </code>{" "}
                        - Custom cache backend
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          keyGenerator
                        </code>{" "}
                        - Custom key generation function
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          shouldCache
                        </code>{" "}
                        - Conditional caching function
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          onHit
                        </code>{" "}
                        - Cache hit callback
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          onMiss
                        </code>{" "}
                        - Cache miss callback
                      </li>
                      <li>
                        <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                          debug
                        </code>{" "}
                        - Enable debug logging
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-xl font-normal mb-4">
                  createCachedFunction(store)
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Creates a pre-configured cached function with a specific
                  store.
                </p>
              </div>

              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-xl font-normal mb-4">
                  createCacheBackend(config)
                </h3>
                <p className="text-sm text-secondary mb-4">
                  Creates a cache backend with the specified configuration.
                </p>

                <div>
                  <h4 className="text-base font-medium mb-2">Backend Types</h4>
                  <ul className="text-sm text-secondary space-y-1">
                    <li>
                      <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                        lru
                      </code>{" "}
                      - LRU cache (single instance)
                    </li>
                    <li>
                      <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                        redis
                      </code>{" "}
                      - Redis cache (distributed)
                    </li>
                    <li>
                      <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                        memory
                      </code>{" "}
                      - Simple memory cache
                    </li>
                    <li>
                      <code className="bg-black/30 px-1 py-0.5 rounded text-xs">
                        simple
                      </code>{" "}
                      - Basic cache implementation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-40">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Best Practices</h2>
            <div className="space-y-4">
              <div className="border border-[#2a2a2a] p-4">
                <p className="text-sm">
                  Use LRU cache for single instance applications
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-4">
                <p className="text-sm">
                  Use Redis cache for distributed/production applications
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-4">
                <p className="text-sm">
                  Set appropriate TTL values based on data freshness
                  requirements
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-4">
                <p className="text-sm">
                  Use environment-aware configuration for seamless dev/prod
                  switching
                </p>
              </div>
              <div className="border border-[#2a2a2a] p-4">
                <p className="text-sm">
                  Enable debug mode during development to monitor cache behavior
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-20">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-normal mb-8">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/cache"
                className="group border border-[#2a2a2a] hover:border-[#404040] transition-colors p-8"
              >
                <h3 className="text-xl font-normal mb-4 group-hover:text-white transition-colors">
                  Live Examples
                </h3>
                <p className="text-sm text-secondary mb-6">
                  Try interactive examples and see caching in action.
                </p>
                <div className="text-sm text-[#d4d4d4] group-hover:text-white transition-colors">
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
                <p className="text-sm text-secondary mb-6">
                  View source code and more examples on GitHub.
                </p>
                <div className="text-sm text-[#d4d4d4] group-hover:text-white transition-colors">
                  View on GitHub →
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
