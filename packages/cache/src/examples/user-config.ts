/**
 * Example showing how users can create their own configured cache function
 * This is the recommended pattern for configuring cache backends
 */

import type { Tool } from "ai";
import Redis from "redis"; // User installs this
import { createCacheBackend } from "../backends";
import type { CacheOptions } from "../index";
import { cached as baseCached } from "../index";

// ===== User's cache configuration file (e.g., src/lib/cache.ts) =====

// 1. Create your cache backend
const redisClient = Redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  }
});

const redisBackend = createCacheBackend({
  type: "redis",
  redis: {
    client: redisClient,
    storeName: "my-app",
  },
});

// 2. Export your configured cache function
export function cached<T extends Tool>(
  tool: T,
  options: Omit<CacheOptions, "store"> = {},
) {
  return baseCached(tool, {
    ...options,
    store: redisBackend, // Always use Redis
  });
}

// ===== Alternative: Multiple preset functions =====

export const redisCached = <T extends Tool>(
  tool: T,
  options: Omit<CacheOptions, "store"> = {},
) => {
  return baseCached(tool, { ...options, store: redisBackend });
};

export const lruCached = <T extends Tool>(
  tool: T,
  options: Omit<CacheOptions, "store"> = {},
) => {
  const lruBackend = createCacheBackend({ type: "lru", maxSize: 1000 });
  return baseCached(tool, { ...options, store: lruBackend });
};

export const memoryCached = <T extends Tool>(
  tool: T,
  options: Omit<CacheOptions, "store"> = {},
) => {
  const memoryBackend = createCacheBackend({ type: "memory", maxSize: 2000 });
  return baseCached(tool, { ...options, store: memoryBackend });
};

// ===== Context-Aware Caching =====

// Use cacheKey function to include user/team context in cache keys

// ===== Usage throughout the app =====

// In your tools files:
// import { cached } from '@ai-sdk-tools/cache';
// import { getContext } from '@/ai/context';
//
// // Global tools (no context needed)
// const weatherTool = cached(expensiveWeatherTool, {
//   ttl: 10 * 60 * 1000, // 10 minutes
// });
//
// // User/team-specific tools (with context)
// const burnRateTool = cached(burnRateAnalysisTool, {
//   cacheKey: () => {
//     const ctx = getContext();
//     return `team:${ctx.user.teamId}:user:${ctx.user.id}`;
//   },
//   ttl: 30 * 60 * 1000, // 30 minutes
// });

// ===== Even simpler: Environment-based configuration =====

function createAppCacheBackend() {
  if (process.env.REDIS_URL) {
    const redis = Redis.createClient({ url: process.env.REDIS_URL });
    return createCacheBackend({
      type: "redis",
      redis: { client: redis, storeName: "app" },
    });
  }

  // Fallback to memory cache in development
  return createCacheBackend({
    type: "memory",
    maxSize: 1000,
  });
}

const appCacheBackend = createAppCacheBackend();

export const appCached = <T extends Tool>(
  tool: T,
  options: Omit<CacheOptions, "store"> = {},
) => {
  return baseCached(tool, { ...options, store: appCacheBackend });
};
