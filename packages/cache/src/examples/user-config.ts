/**
 * Example showing how users can create their own configured cache function
 * This is the recommended pattern for configuring cache backends
 */

import { cached as baseCached, createCacheBackend } from '../index';
import type { CoreTool, CacheOptions } from '../index';
import Redis from 'redis'; // User installs this

// ===== User's cache configuration file (e.g., src/lib/cache.ts) =====

// 1. Create your cache backend
const redisClient = Redis.createClient({
  host: 'localhost',
  port: 6379,
});

const redisBackend = createCacheBackend({
  type: 'redis',
  redis: {
    client: redisClient,
    keyPrefix: 'my-app:',
  },
});

// 2. Export your configured cache function
export function cached<T extends CoreTool>(
  tool: T, 
  options: Omit<CacheOptions, 'store'> = {}
) {
  return baseCached(tool, {
    ...options,
    store: redisBackend, // Always use Redis
  });
}

// ===== Alternative: Multiple preset functions =====

export const redisCached = <T extends CoreTool>(
  tool: T, 
  options: Omit<CacheOptions, 'store'> = {}
) => {
  return baseCached(tool, { ...options, store: redisBackend });
};

export const lruCached = <T extends CoreTool>(
  tool: T, 
  options: Omit<CacheOptions, 'store'> = {}
) => {
  const lruBackend = createCacheBackend({ type: 'lru', maxSize: 1000 });
  return baseCached(tool, { ...options, store: lruBackend });
};

export const memoryCached = <T extends CoreTool>(
  tool: T, 
  options: Omit<CacheOptions, 'store'> = {}
) => {
  const memoryBackend = createCacheBackend({ type: 'memory', maxSize: 2000 });
  return baseCached(tool, { ...options, store: memoryBackend });
};

// ===== Usage throughout the app =====

// In your tools files:
// import { cached } from '@/lib/cache'; // Your configured version
// 
// const weatherTool = cached(expensiveWeatherTool, {
//   ttl: 10 * 60 * 1000, // 10 minutes
// });
//
// const analysisTools = cacheTools({
//   burnRate: burnRateAnalysisTool,
//   growth: growthAnalysisTool,
// }, {
//   ttl: 30 * 60 * 1000, // 30 minutes
// });

// ===== Even simpler: Environment-based configuration =====

function createAppCacheBackend() {
  if (process.env.REDIS_URL) {
    const redis = Redis.createClient({ url: process.env.REDIS_URL });
    return createCacheBackend({
      type: 'redis',
      redis: { client: redis, keyPrefix: 'app:' },
    });
  }
  
  // Fallback to memory cache in development
  return createCacheBackend({
    type: 'memory',
    maxSize: 1000,
  });
}

const appCacheBackend = createAppCacheBackend();

export const cached = <T extends CoreTool>(
  tool: T, 
  options: Omit<CacheOptions, 'store'> = {}
) => {
  return baseCached(tool, { ...options, store: appCacheBackend });
};
