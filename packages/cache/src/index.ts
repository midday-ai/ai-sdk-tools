/**
 * @ai-sdk-tools/cache
 * 
 * Simple caching wrapper for AI SDK tools. Cache expensive tool executions 
 * with zero configuration.
 */

export { cached, createCached, cacheTools } from "./cache";
export type {
  CacheOptions,
  CachedTool,
  CacheStore,
  CacheEntry,
} from "./types";

export { createCacheBackend } from "./backends/factory";
export type { CacheBackendConfig } from "./backends/factory";
export { LRUCacheStore, SimpleCacheStore, RedisCacheStore, MemoryCacheStore } from "./backends/index";

// Re-export useful types from ai package
export type { Tool } from "ai";
