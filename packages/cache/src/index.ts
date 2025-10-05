/**
 * @ai-sdk-tools/cache
 * 
 * Simple caching wrapper for AI SDK tools. Cache expensive tool executions 
 * with zero configuration.
 */

export { cached, createCachedFunction, cacheTools } from "./cache";
export { LRUCacheStore, SimpleCacheStore } from "./cache-store";
export { createCacheBackend } from "./backends/factory";
export { MemoryCacheStore } from "./backends/memory";
export { RedisCacheStore } from "./backends/redis";
export type {
  CacheOptions,
  CachedTool,
  CacheStats,
  CacheEntry,
  CacheStore,
} from "./types";
export type { CacheBackendConfig } from "./backends/factory";

// Re-export useful types from ai package
export type { Tool } from "ai";
