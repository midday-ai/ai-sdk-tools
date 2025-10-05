import type { CacheStore } from "../types";
import { LRUCacheStore, SimpleCacheStore } from "../cache-store";
import { MemoryCacheStore } from "./memory";
import { RedisCacheStore } from "./redis";

/**
 * Cache backend configuration
 */
export interface CacheBackendConfig {
  type: "memory" | "lru" | "simple" | "redis";
  maxSize?: number;
  defaultTTL?: number;
  redis?: {
    client: any;
    keyPrefix?: string;
  };
}

/**
 * Factory function to create cache backends
 */
export function createCacheBackend<T = any>(config: CacheBackendConfig): CacheStore<T> {
  let store: CacheStore<T>;
  
  switch (config.type) {
    case "memory":
      store = new MemoryCacheStore<T>(config.maxSize);
      break;
    
    case "lru":
      store = new LRUCacheStore<T>(config.maxSize);
      break;
    
    case "simple":
      store = new SimpleCacheStore<T>(config.maxSize);
      break;
    
    case "redis":
      if (!config.redis?.client) {
        throw new Error("Redis client is required for redis cache backend");
      }
      store = new RedisCacheStore<T>(config.redis.client, config.redis.keyPrefix);
      break;
    
    default:
      throw new Error(`Unknown cache backend type: ${(config as any).type}`);
  }
  
  // Add default TTL support if configured
  if (config.defaultTTL) {
    (store as any).getDefaultTTL = () => config.defaultTTL;
  }
  
  return store;
}

/**
 * Global cache backend configuration
 */
let globalCacheBackend: CacheStore | null = null;

/**
 * Configure global cache backend
 */
export function configureCacheBackend(config: CacheBackendConfig): void {
  globalCacheBackend = createCacheBackend(config);
}

/**
 * Get the global cache backend
 */
export function getGlobalCacheBackend<T = any>(): CacheStore<T> | null {
  return globalCacheBackend as CacheStore<T> | null;
}

/**
 * Reset global cache backend
 */
export function resetCacheBackend(): void {
  globalCacheBackend = null;
}
