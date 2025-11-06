# @ai-sdk-tools/cache

[![npm version](https://badge.fury.io/js/@ai-sdk-tools%2Fcache.svg)](https://badge.fury.io/js/@ai-sdk-tools%2Fcache)

Universal caching wrapper for AI SDK tools. Cache expensive tool executions with zero configuration - works with regular tools, streaming tools, and artifacts.

## Why Cache Tools?

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

### Basic Usage (LRU Cache)

```typescript
import { tool } from 'ai';
import { createCached } from '@ai-sdk-tools/cache';
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

// Create cached function (uses LRU by default)
const cached = createCached();

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

### Redis/Upstash Cache (Production)

```typescript
import { Redis } from "@upstash/redis";
import { createCached } from '@ai-sdk-tools/cache';

// Just pass your Redis client!
const cached = createCached({
  cache: Redis.fromEnv(), // That's it!
  ttl: 30 * 60 * 1000, // 30 minutes
});

const weatherTool = cached(expensiveWeatherTool);
```

### Standard Redis

```typescript
import Redis from "redis";
import { createCached } from '@ai-sdk-tools/cache';

const cached = createCached({
  cache: Redis.createClient({ url: "redis://localhost:6379" }),
  storeName: "my-app",
  ttl: 30 * 60 * 1000,
});
```

### IORedis

```typescript
import IORedis from "ioredis";
import { createCached } from '@ai-sdk-tools/cache';

const cached = createCached({
  cache: new IORedis("redis://localhost:6379"),
  storeName: "my-app",
  ttl: 30 * 60 * 1000,
});
```

## Universal Redis Support

Works with **any Redis client** that implements:
- `get(key: string): Promise<string | null>`
- `set(key: string, value: string): Promise<void>`
- `del(key: string): Promise<void>`
- `setex?(key: string, seconds: number, value: string): Promise<void>` (optional)

Supported clients:
- ✅ **Upstash Redis** - `@upstash/redis`
- ✅ **Standard Redis** - `redis`
- ✅ **IORedis** - `ioredis`
- ✅ **Redis Clusters** - Any cluster client
- ✅ **Custom Redis clients** - As long as they implement the interface

## Configuration Options

```typescript
const cached = createCached({
  cache?: any;                      // Redis client (optional, defaults to LRU)
  storeName?: string;               // Redis store name (default: "ai-tools-cache")
  ttl?: number;                     // Time to live in ms (default: 10min LRU, 30min Redis)
  toolName?: string;                // Tool name prefix for cache keys
  keySeparator?: string;            // Separator between key components (default: ':')
  cacheKeyContext?: () => string;   // Generate dynamic context suffix (multi-tenant)
  debug?: boolean;                  // Debug logging (default: false)
  onHit?: (key: string) => void;    // Cache hit callback
  onMiss?: (key: string) => void;   // Cache miss callback
});
```

**`toolName`** - Prefix cache keys with tool name to prevent collisions between tools using similar parameters.

**`keySeparator`** - Customize separator between key components (default: `':'`). Useful for specific storage backend requirements.

**`cacheKeyContext`** - Function to generate dynamic context suffix for multi-tenant apps. The context is appended to the end of the cache key with a separator in between. Isolates cache by user, team, or other contextual data.

## Per-Tool Cache Key Prefixing

When multiple tools use similar parameters, they can create identical cache keys causing collisions. Use `toolName` to namespace your cache keys:

```typescript
const cached = createCached({ cache: Redis.fromEnv() });

const weatherTool = cached(originalWeatherTool, {
  toolName: 'weatherTool',
});

const translationTool = cached(originalTranslationTool, {
  toolName: 'translationTool',
});
```

This creates a clear Redis key hierarchy:

```
// Without toolName (collision risk)
ai-tools-cache:{city:"NYC"}

// With toolName (no collisions)
ai-tools-cache:weatherTool:{city:"NYC"}
ai-tools-cache:translationTool:{city:"NYC"}
```

## Multi-Tenant Apps (Context-Aware Caching)

For multi-tenant apps, isolate cache by user/team using `cacheKeyContext`:

```typescript
import { cached } from '@ai-sdk-tools/cache';

const burnRateAnalysisTool = tool({
  description: 'Analyze burn rate',
  parameters: z.object({
    from: z.string(),
    to: z.string(),
  }),
  execute: async ({ from, to }) => {
    const currentUser = getCurrentUser();
    return await db.getBurnRate({
      teamId: currentUser.teamId,
      from,
      to,
    });
  },
});

export const cachedBurnRateTool = cached(burnRateAnalysisTool, {
  cacheKeyContext: () => {
    const currentUser = getCurrentUser();
    return `team:${currentUser.teamId}:user:${currentUser.id}`;
  },
  ttl: 30 * 60 * 1000,
});
```

**Result**: Cache keys automatically include `teamId` and `userId` - no collisions between users/teams!

## Reusable Cache Configuration

For consistent setup across your app, create a configured cache function:

```typescript
// src/lib/cache.ts
import { cached as baseCached, createCacheBackend } from '@ai-sdk-tools/cache';
import { getContext } from '@/ai/context';

// Create cache backend
const cacheBackend = createCacheBackend({
  type: 'redis',
  redis: {
    client: Redis.createClient({ url: process.env.REDIS_URL }),
    storeName: 'my-app',
  },
});

// Export configured cache function
export function cached<T extends Tool>(tool: T, toolName?: string, options = {}) {
  return baseCached(tool, {
    store: cacheBackend,
    toolName,  // Per-tool prefix
    cacheKeyContext: () => {
      const currentUser = getCurrentUser();
      return `team:${currentUser.teamId}:user:${currentUser.id}`;
    },
    ttl: 30 * 60 * 1000, // 30 minutes
    debug: process.env.NODE_ENV === 'development',
    ...options,
  });
}

// Throughout your app - each tool gets its own prefix
import { cached } from '@/lib/cache';
export const weatherTool = cached(originalWeatherTool, 'weatherTool');
export const translateTool = cached(originalTranslateTool, 'translateTool');
```

## Streaming Tools with Artifacts

```typescript
import { createCached } from '@ai-sdk-tools/cache';

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

const cached = createCached({ cache: Redis.fromEnv() });
const cachedAnalysis = cached(burnRateAnalysis);

// First call: Full streaming + artifact creation
// Cached calls: Instant artifact restoration + complete result
```

## Multiple Tools

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
```

## Custom Callbacks

```typescript
const cached = createCached({
  cache: Redis.fromEnv(),
  onHit: (key) => {
    console.log(`✨ Cache hit: ${key}`);
    analytics.track('cache_hit', { key });
  },
  onMiss: (key) => {
    console.log(`💫 Cache miss: ${key}`);
    analytics.track('cache_miss', { key });
  },
});
```

## Cache Statistics

```typescript
const weatherTool = cached(expensiveWeatherTool);

// Get stats
console.log(weatherTool.getStats());
// { hits: 15, misses: 3, hitRate: 0.83, size: 18, maxSize: 100 }

// Clear cache
weatherTool.clearCache(); // Clear all
weatherTool.clearCache('specific-key'); // Clear specific

// Check if cached
if (await weatherTool.isCached({ location: 'NYC' })) {
  console.log('Result is cached!');
}
```

## API Reference

### `createCached(options?)`

Creates a cached function with optional Redis client.

**Parameters:**
- `options.cache` - Redis client (optional, defaults to LRU)
- `options.keyPrefix` - Cache key prefix
- `options.ttl` - Time to live in milliseconds
- `options.debug` - Enable debug logging
- `options.onHit` - Cache hit callback
- `options.onMiss` - Cache miss callback

**Returns:** A function that wraps tools with caching

### `cached(tool, options?)`

Basic caching function with automatic context detection.

**Parameters:**
- `tool` - AI SDK tool to cache
- `options.cacheKey` - Function to generate cache key context
- `options.ttl` - Time to live in milliseconds
- `options.store` - Cache store backend
- `options.debug` - Enable debug logging
- `options.onHit` - Cache hit callback
- `options.onMiss` - Cache miss callback

### `cacheTools(tools, options?)`

Cache multiple tools with the same configuration.

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT © [AI SDK Tools](https://github.com/ai-sdk-tools/ai-sdk-tools)
