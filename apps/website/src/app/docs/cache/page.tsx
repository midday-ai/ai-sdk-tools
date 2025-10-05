import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cache Documentation - AI SDK Tools",
  description:
    "Complete documentation for @ai-sdk-tools/cache. Learn how to cache AI tool executions with zero configuration, including streaming tools and artifacts.",
  keywords: [
    "AI SDK cache docs",
    "AI tool caching guide",
    "streaming tool cache",
    "artifact caching",
    "Redis cache setup",
    "LRU cache configuration",
  ],
  openGraph: {
    title: "Cache Documentation - AI SDK Tools",
    description:
      "Complete documentation for @ai-sdk-tools/cache. Learn how to cache AI tool executions with zero configuration.",
    url: "https://ai-sdk-tools.dev/docs/cache",
  },
  alternates: {
    canonical: "/docs/cache",
  },
};

export default function CacheDocsPage() {
  return (
    <div className="min-h-screen text-[#d4d4d4] font-[family-name:var(--font-geist-mono)]">
      <div className="max-w-4xl mx-auto px-8 py-32">
        <div className="prose prose-invert max-w-none">
          <h1>@ai-sdk-tools/cache</h1>
          
          <p className="lead">
            Universal caching wrapper for AI SDK tools. Cache expensive tool executions 
            with zero configuration - works with regular tools, streaming tools, and artifacts.
          </p>

          <h2>Installation</h2>
          <pre><code>npm install @ai-sdk-tools/cache</code></pre>

          <h2>Quick Start</h2>
          <pre><code>{`import { cached } from '@ai-sdk-tools/cache'

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
// Next calls: <1ms from cache ⚡`}</code></pre>

          <h2>Universal Tool Support</h2>
          
          <h3>Regular Tools (async function)</h3>
          <pre><code>{`const apiTool = cached(tool({
  execute: async ({ query }) => {
    return await api.search(query) // Cached return value
  }
}))`}</code></pre>

          <h3>Streaming Tools (async function*)</h3>
          <pre><code>{`const streamingTool = cached(tool({
  execute: async function* ({ params }) => {
    yield { text: "Processing..." } // Cached yields
    yield { text: "Complete!" }
  }
}))`}</code></pre>

          <h3>Artifact Tools (with writer data)</h3>
          <pre><code>{`const artifactTool = cached(tool({
  execute: async function* ({ data }) => {
    const analysis = artifact.stream({ ... })
    await analysis.update({ charts, metrics }) // Cached writer messages
    yield { text: "Done" }
  }
}))`}</code></pre>

          <h2>Cache Backends</h2>

          <h3>LRU Cache (Default)</h3>
          <pre><code>{`import { cached } from '@ai-sdk-tools/cache'

// Uses LRU cache automatically
const weatherTool = cached(expensiveWeatherTool, {
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 1000, // Max 1000 cached items
})`}</code></pre>

          <h3>Redis Cache (Production)</h3>
          <pre><code>{`import { createCachedFunction, createCacheBackend } from '@ai-sdk-tools/cache'
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

export const cached = createCachedFunction(redisBackend)`}</code></pre>

          <h3>Environment-Aware Setup</h3>
          <pre><code>{`const backend = process.env.REDIS_URL 
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
// Production: Redis, Development: LRU`}</code></pre>

          <h2>Streaming Tools Requirements</h2>
          
          <p>For complete caching of streaming tools with artifacts, ensure your API route passes the writer:</p>
          
          <pre><code>{`// API route setup (required for artifact caching)
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
})`}</code></pre>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-4 my-6">
            <p><strong>Important:</strong> Without <code>experimental_context: {`{ writer }`}</code>:</p>
            <ul>
              <li>✅ Streaming text is cached</li>
              <li>❌ Artifact data (charts, metrics) is missing on cache hits</li>
            </ul>
            <p><strong>With proper setup:</strong></p>
            <ul>
              <li>✅ Complete data preservation - everything cached and restored</li>
            </ul>
          </div>

          <h2>API Reference</h2>

          <h3>cached(tool, options?)</h3>
          <p>Wraps an AI SDK tool with caching capabilities.</p>
          
          <h4>Parameters</h4>
          <ul>
            <li><code>tool</code> - Any AI SDK tool</li>
            <li><code>options</code> - Optional cache configuration</li>
          </ul>

          <h4>Options</h4>
          <ul>
            <li><code>ttl</code> - Time to live in milliseconds (default: 5 minutes)</li>
            <li><code>maxSize</code> - Maximum cache size (default: 1000)</li>
            <li><code>store</code> - Custom cache backend</li>
            <li><code>keyGenerator</code> - Custom key generation function</li>
            <li><code>shouldCache</code> - Conditional caching function</li>
            <li><code>onHit</code> - Cache hit callback</li>
            <li><code>onMiss</code> - Cache miss callback</li>
            <li><code>debug</code> - Enable debug logging</li>
          </ul>

          <h3>createCachedFunction(store)</h3>
          <p>Creates a pre-configured cached function with a specific store.</p>

          <h3>createCacheBackend(config)</h3>
          <p>Creates a cache backend with the specified configuration.</p>

          <h4>Backend Types</h4>
          <ul>
            <li><code>lru</code> - LRU cache (single instance)</li>
            <li><code>redis</code> - Redis cache (distributed)</li>
            <li><code>memory</code> - Simple memory cache</li>
            <li><code>simple</code> - Basic cache implementation</li>
          </ul>

          <h2>Performance Benefits</h2>
          <ul>
            <li><strong>10x faster responses</strong> for repeated requests</li>
            <li><strong>80% cost reduction</strong> by avoiding duplicate calls</li>
            <li><strong>Smooth agent conversations</strong> with instant cached results</li>
            <li><strong>Complete data preservation</strong> - streaming, artifacts, everything</li>
          </ul>

          <h2>Best Practices</h2>
          <ul>
            <li>Use LRU cache for single instance applications</li>
            <li>Use Redis cache for distributed/production applications</li>
            <li>Set appropriate TTL values based on data freshness requirements</li>
            <li>Use environment-aware configuration for seamless dev/prod switching</li>
            <li>Enable debug mode during development to monitor cache behavior</li>
          </ul>

          <div className="flex gap-4 mt-8">
            <a
              href="https://github.com/midday-ai/ai-sdk-tools/tree/main/packages/cache"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
            >
              View on GitHub →
            </a>
            <a
              href="/cache"
              className="px-4 py-2 border border-[#333] hover:border-[#555] transition-colors text-sm"
            >
              Live Examples →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
