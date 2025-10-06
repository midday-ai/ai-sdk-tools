# @ai-sdk-tools/cache

[![npm version](https://badge.fury.io/js/@ai-sdk-tools%2Fcache.svg)](https://badge.fury.io/js/@ai-sdk-tools%2Fcache)

Universal caching wrapper for AI SDK tools. Cache expensive tool executions with zero configuration - works with regular tools, streaming tools, and artifacts.

## ⚡ Why Cache Tools?

AI agents repeatedly call expensive tools:
- **Same API calls** across conversation turns (weather, translations)
- **Heavy calculations** with identical parameters (financial analysis)
- **Database queries** that don't change (user profiles, company data)
- **Streaming tools** with complex artifact data (charts, metrics)

Caching provides:
- **10x faster responses** for repeated requests
- **80% cost reduction** by avoiding duplicate calls
- **Smooth agent conversations** with instant cached results
- **Complete data preservation** - streaming, artifacts, everything

## Installation

```bash
npm install @ai-sdk-tools/cache
# or
bun add @ai-sdk-tools/cache
```

## Quick Start

### Basic Usage

```typescript
import { tool } from 'ai';
import { cached } from '@ai-sdk-tools/cache';
import { z } from 'zod';

// Your expensive tool
const expensiveWeatherTool = tool({
  description: 'Get weather data from API',
  parameters: z.object({
    location: z.string(),
  }),
  execute: async ({ location }) => {
    // Expensive API call
    const response = await fetch(`https://api.weather.com/v1/current?location=${location}`);
    return response.json();
  },
});

// Wrap with caching - that's it! 🎉
const weatherTool = cached(expensiveWeatherTool);

// Use normally with AI SDK
const result = await generateText({
  model: openai('gpt-4o'),
  tools: { weather: weatherTool },
  messages: [{ role: 'user', content: 'Weather in NYC?' }],
});
```

**Result**: First call hits the API, subsequent calls return instantly from cache!

### Streaming Tools with Artifacts

```typescript
import { cached } from '@ai-sdk-tools/cache';

// Complex streaming tool with artifacts
const burnRateAnalysis = tool({
  description: 'Generate comprehensive burn rate analysis',
  parameters: z.object({
    companyId: z.string(),
    months: z.number(),
  }),
  execute: async function* ({ companyId, months }) {
    // Create streaming artifact
    const analysis = burnRateArtifact.stream({
      stage: "loading",
      // ... artifact data
    });

    yield { text: "Starting analysis..." };
    
    // Update artifact with charts, metrics
    await analysis.update({
      chart: { monthlyData: [...] },
      metrics: { burnRate: 50000, runway: 18 },
    });
    
    yield { text: "Analysis complete", forceStop: true };
  },
});

// Cache the streaming tool - preserves artifacts AND streaming
const cachedAnalysis = cached(burnRateAnalysis);

// First call: Full streaming + artifact creation
// Cached calls: Instant artifact restoration + streaming replay
```

**Result**: Complete data preservation - charts, metrics, and streaming text all cached and restored perfectly!

### With Custom TTL

```typescript
// Cache for 10 minutes
const weatherTool = cached(expensiveWeatherTool, {
  ttl: 10 * 60 * 1000, // 10 minutes
});

// Cache for 1 hour
const dataAnalysisTool = cached(heavyAnalysisTool, {
  ttl: 60 * 60 * 1000, // 1 hour
});
```

### Multiple Tools

```typescript
import { cacheTools } from '@ai-sdk-tools/cache';

// Cache multiple tools at once
const { weather, calculator, database } = cacheTools({
  weather: weatherTool,
  calculator: calculatorTool,
  database: databaseTool,
}, {
  ttl: 5 * 60 * 1000, // 5 minutes for all
});

// Use with AI SDK
const result = await generateText({
  model: openai('gpt-4o'),
  tools: { weather, calculator, database },
  messages,
});
```

### Cache Backend Configuration

Choose your caching strategy - LRU for single instances, Redis for distributed apps:

#### LRU Cache (Default - Single Instance)

```typescript
import { cached } from '@ai-sdk-tools/cache';

// Uses LRU cache automatically - perfect for single instance apps
const weatherTool = cached(expensiveWeatherTool, {
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 1000, // Max 1000 cached items
});

// Or configure LRU globally
import { createCachedFunction, createCacheBackend } from '@ai-sdk-tools/cache';

const lruBackend = createCacheBackend({
  type: 'lru',
  maxSize: 2000,
  defaultTTL: 15 * 60 * 1000, // 15 minutes
});

export const cached = createCachedFunction(lruBackend);
```

#### Redis Cache (Distributed - Multiple Instances)

```typescript
// src/lib/cache.ts - Redis configuration for production
import { createCachedFunction, createCacheBackend } from '@ai-sdk-tools/cache';
import Redis from 'redis';

const redis = Redis.createClient({
  url: process.env.REDIS_URL,
});

const redisBackend = createCacheBackend({
  type: 'redis',
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  redis: {
    client: redis,
    keyPrefix: 'ai-tools:',
  },
});

// Export your Redis-powered cache function
export const cached = createCachedFunction(redisBackend);

// Throughout your app
import { cached } from '@/lib/cache';

const burnRateAnalysis = cached(expensiveBurnRateAnalysis);
const userProfileTool = cached(expensiveUserProfileTool);
// All tools now use Redis with 30-minute TTL
```

#### Environment-Based Configuration

```typescript
// src/lib/cache.ts - Smart environment-based setup
import { createCachedFunction, createCacheBackend } from '@ai-sdk-tools/cache';

const backend = process.env.REDIS_URL 
  ? createCacheBackend({
      type: 'redis',
      defaultTTL: 30 * 60 * 1000,
      redis: { client: Redis.createClient({ url: process.env.REDIS_URL }) }
    })
  : createCacheBackend({
      type: 'lru',
      maxSize: 1000,
      defaultTTL: 10 * 60 * 1000,
    });

export const cached = createCachedFunction(backend);
// Production: Redis, Development: LRU
```

**Benefits:**
- ✅ **LRU**: Fast, memory-efficient, perfect for single instances
- ✅ **Redis**: Shared cache, persistence, scales across instances
- ✅ **Zero TypeScript complexity** - one-liner setup
- ✅ **Environment-aware** - automatically choose backend

## Cache Backends

### Available Backends

Choose the right cache backend for your needs:

```typescript
import { createCacheBackend, createCachedFunction } from '@ai-sdk-tools/cache';

// 1. LRU Cache (default) - good for most use cases
const lruBackend = createCacheBackend({
  type: 'lru',
  maxSize: 1000,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
});

// 2. Enhanced Memory Cache - better performance monitoring
const memoryBackend = createCacheBackend({
  type: 'memory',
  maxSize: 2000,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
});

// 3. Simple Cache - basic Map-based cache
const simpleBackend = createCacheBackend({
  type: 'simple',
  maxSize: 500,
  defaultTTL: 2 * 60 * 1000, // 2 minutes
});

// 4. Redis Cache - distributed caching
const redisBackend = createCacheBackend({
  type: 'redis',
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  redis: {
    client: redisClient,
    keyPrefix: 'my-app:',
  },
});

// Create your configured cache function
export const cached = createCachedFunction(redisBackend);
```

### Redis Setup

For production applications with multiple instances:

```typescript
import Redis from 'redis';
import { createCacheBackend, createCachedFunction } from '@ai-sdk-tools/cache';

// Create Redis client
const redis = Redis.createClient({
  host: 'localhost',
  port: 6379,
});

await redis.connect();

// Create Redis cache backend
const redisBackend = createCacheBackend({
  type: 'redis',
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  redis: {
    client: redis,
    keyPrefix: 'ai-tools-cache:',
  },
});

// Create your configured cache function
export const cached = createCachedFunction(redisBackend);

// All tools now use Redis with 10-minute TTL
const weatherTool = cached(expensiveWeatherTool);
const calculatorTool = cached(expensiveCalculatorTool);
```

**Redis Benefits:**
- **Shared cache** across multiple application instances
- **Persistence** - cache survives application restarts
- **Scalability** - handle high-traffic applications
- **TTL support** - automatic expiration at Redis level

## Universal Tool Support

### What Tools Are Supported?

**✅ Regular Tools (async function)**
```typescript
const apiTool = cached(tool({
  execute: async ({ query }) => {
    return await api.search(query); // Cached return value
  }
}));
```

**✅ Streaming Tools (async function*)**
```typescript
const streamingTool = cached(tool({
  execute: async function* ({ params }) {
    yield { text: "Processing..." }; // Cached yields
    yield { text: "Complete!" };
  }
}));
```

**✅ Artifact Tools (with writer data)**
```typescript
const artifactTool = cached(tool({
  execute: async function* ({ data }) {
    const analysis = artifact.stream({ ... });
    await analysis.update({ charts, metrics }); // Cached writer messages
    yield { text: "Done" };
  }
}));
```

**✅ Hybrid Tools (streaming + artifacts)**
- Caches yielded chunks AND artifact data
- Replays writer messages to restore charts/metrics
- Preserves complete streaming behavior

### Requirements for Streaming/Artifact Tools

The cache automatically detects and works with artifact tools in multiple ways:

#### Option 1: Using experimental_context (Recommended)
```typescript
// API route setup
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    setContext({ writer, db, user }); // Set up artifacts context
    
    const result = streamText({
      model: openai("gpt-4o"),
      tools: { analysis: cachedAnalysisTool },
      experimental_context: { writer, db, user }, // ← Pass complete context
    });
    
    writer.merge(result.toUIMessageStream());
  },
});
```

#### Option 2: Using Artifacts Context (Auto-detected)
```typescript
// The cache automatically detects artifacts context
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    setContext({ writer, db, user }); // Cache will auto-detect this
    
    const result = streamText({
      model: openai("gpt-4o"),
      tools: { analysis: cachedAnalysisTool },
      // No experimental_context needed - cache finds it automatically
    });
    
    writer.merge(result.toUIMessageStream());
  },
});
```

**Context Detection Priority:**
1. `executionOptions.writer` (direct)
2. `experimental_context.writer` (AI SDK)
3. `getContext().writer` (artifacts context - auto-detected)

**Benefits:**
- ✅ Works with any artifacts setup
- ✅ Automatic context detection
- ✅ Complete data preservation - everything cached and restored
- ✅ Database context preserved through caching

## Advanced Usage

### React Query Style Cache Keys

Cache keys are automatically generated from parameters using React Query style stable serialization:

```typescript
// Automatic key generation (recommended)
const tool = cached(expensiveTool); // Keys generated from params

// Custom key generation
const weatherTool = cached(expensiveWeatherTool, {
  keyGenerator: (params) => `weather:${params.location}:${params.units}`,
});

// Examples of automatic key generation:
// { location: "NYC", units: "celsius" } → "{location:NYC,units:celsius}"
// { companyId: "abc", date: new Date() } → "{companyId:abc,date:2024-01-01T00:00:00.000Z}"
// [1, 2, 3] → "[1,2,3]"
```

### Conditional Caching

Only cache certain results:

```typescript
const apiTool = cached(expensiveApiTool, {
  shouldCache: (params, result) => {
    // Don't cache errors
    return !result.error;
  },
});
```

### Cache Statistics

Monitor cache performance:

```typescript
const weatherTool = cached(expensiveWeatherTool, {
  onHit: (key) => console.log(`Cache hit for ${key}`),
  onMiss: (key) => console.log(`Cache miss for ${key}`),
});

// Get stats
console.log(weatherTool.getStats());
// { hits: 15, misses: 3, hitRate: 0.83 }
```

### Manual Cache Control

```typescript
// Clear specific entries
weatherTool.clearCache('weather:NYC:celsius');

// Clear all cache
weatherTool.clearCache();

// Check if cached
if (weatherTool.isCached({ location: 'NYC' })) {
  console.log('Result is cached!');
}
```

## Configuration Options

```typescript
interface CacheOptions {
  // Cache duration in milliseconds (default: 5 minutes)
  ttl?: number;
  
  // Maximum cache size (default: 1000 entries)
  maxSize?: number;
  
  // Custom cache key generator
  keyGenerator?: (params: any) => string;
  
  // Whether to cache this result
  shouldCache?: (params: any, result: any) => boolean;
  
  // Cache hit callback
  onHit?: (key: string) => void;
  
  // Cache miss callback
  onMiss?: (key: string) => void;
  
  // Enable debug logging
  debug?: boolean;
}
```

## Real-World Examples

### Financial Analysis Tool

```typescript
const burnRateAnalysisTool = cached(
  tool({
    description: 'Analyze company burn rate',
    parameters: z.object({
      companyId: z.string(),
      months: z.number(),
    }),
    execute: async ({ companyId, months }) => {
      // Expensive calculation with database queries
      const data = await fetchFinancialData(companyId, months);
      return analyzeFinancialHealth(data);
    },
  }),
  {
    ttl: 30 * 60 * 1000, // 30 minutes
    keyGenerator: ({ companyId, months }) => `burnrate:${companyId}:${months}`,
    shouldCache: (_, result) => result.success,
  }
);
```

### Database Query Tool

```typescript
const customerDataTool = cached(
  tool({
    description: 'Get customer information',
    parameters: z.object({
      customerId: z.string(),
    }),
    execute: async ({ customerId }) => {
      return await db.customer.findUnique({
        where: { id: customerId },
        include: { orders: true, preferences: true },
      });
    },
  }),
  {
    ttl: 10 * 60 * 1000, // 10 minutes
    onHit: () => metrics.increment('customer_cache_hit'),
    onMiss: () => metrics.increment('customer_cache_miss'),
  }
);
```

### API Integration Tool

```typescript
const translationTool = cached(
  tool({
    description: 'Translate text to different languages',
    parameters: z.object({
      text: z.string(),
      targetLanguage: z.string(),
    }),
    execute: async ({ text, targetLanguage }) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Translate "${text}" to ${targetLanguage}`,
          },
        ],
      });
      return { translation: response.choices[0].message.content };
    },
  }),
  {
    ttl: 24 * 60 * 60 * 1000, // 24 hours (translations don't change)
    keyGenerator: ({ text, targetLanguage }) => 
      `translate:${Buffer.from(text).toString('base64')}:${targetLanguage}`,
  }
);
```

## Performance Tips

### 1. Choose Appropriate TTL

```typescript
// Fast-changing data: short TTL
const stockPriceTool = cached(stockTool, { ttl: 30 * 1000 }); // 30 seconds

// Stable data: long TTL  
const companyInfoTool = cached(companyTool, { ttl: 24 * 60 * 60 * 1000 }); // 24 hours
```

### 2. Optimize Cache Keys

```typescript
// Good: specific, deterministic keys
const goodTool = cached(tool, {
  keyGenerator: ({ userId, date }) => `user:${userId}:${date}`,
});

// Avoid: keys with timestamps or random data
const badTool = cached(tool, {
  keyGenerator: ({ userId }) => `user:${userId}:${Date.now()}`, // Always unique!
});
```

### 3. Monitor Cache Performance

```typescript
const monitoredTool = cached(expensiveTool, {
  onHit: (key) => {
    console.log(`💰 Saved expensive operation: ${key}`);
    metrics.increment('tool_cache_hit');
  },
  onMiss: (key) => {
    console.log(`🔄 Executing expensive operation: ${key}`);
    metrics.increment('tool_cache_miss');
  },
});

// Check performance periodically
setInterval(() => {
  const stats = monitoredTool.getStats();
  console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
}, 60000);
```

## When to Use

**Perfect for:**
- Individual tools that need caching
- Zero configuration setup
- Simple performance optimization
- API call reduction
- Expensive computation caching

**Great for scenarios like:**
- Weather API calls that don't change frequently
- Database queries with stable results
- Heavy financial calculations
- Translation services
- Document processing

## API Reference

### `createCachedFunction(store)`

Creates a pre-configured cache function with a specific backend. This is the **recommended approach** for custom configurations.

**Parameters:**
- `store`: Cache backend created with `createCacheBackend()`

**Returns:** A configured cache function with the same signature as `cached()`

**Example:**
```typescript
const backend = createCacheBackend({ type: 'redis', defaultTTL: 600000 });
const cached = createCachedFunction(backend);

// Use like the regular cached function
const weatherTool = cached(expensiveWeatherTool);
```

### `cached(tool, options?)`

Wraps an AI SDK tool with caching.

**Parameters:**
- `tool`: AI SDK tool to wrap
- `options`: Optional cache configuration

**Returns:** Cached tool with additional methods

### `cacheTools(tools, options?)`

Wraps multiple tools with the same cache configuration.

**Parameters:**
- `tools`: Object of AI SDK tools
- `options`: Cache configuration for all tools

**Returns:** Object of cached tools

### Cache Methods

Each cached tool has these additional methods:

- `getStats()`: Get cache statistics
- `clearCache(key?)`: Clear cache (specific key or all)
- `isCached(params)`: Check if parameters are cached

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT © [AI SDK Tools](https://github.com/ai-sdk-tools/ai-sdk-tools)
