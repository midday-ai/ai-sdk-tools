import type { Tool } from "ai";

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Cache duration in milliseconds (default: 5 minutes) */
  ttl?: number;

  /** Maximum cache size (default: 1000 entries) */
  maxSize?: number;

  /** Custom cache store backend */
  store?: CacheStore;

  /**
   * Optional tool name to prefix cache keys with.
   * Prevents collisions between tools using similar parameters.
   */
  toolName?: string;

  /**
   * Separator used between cache key components.
   *
   * @default ':'
   */
  keySeparator?: string;

  /** Custom cache key generator */
  keyGenerator?: (options: {
    params: any;
    context?: any;
    toolName?: string;
    keySeparator?: string;
  }) => string;

  /**
   * Function to generate dynamic cache key context suffix.
   * Appended to the end of the cache key with separator in between.
   * Use for multi-tenant apps to isolate cache by user/team.
   */
  cacheKeyContext?: () => string;

  /**
   * @deprecated Use `cacheKeyContext` instead.
   *
   * Function to generate cache key context suffix.
   */
  cacheKey?: () => string;

  /** Whether to cache this result */
  shouldCache?: (params: any, result: any) => boolean;

  /** Cache hit callback */
  onHit?: (key: string) => void;

  /** Cache miss callback */
  onMiss?: (key: string) => void;

  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T = any> {
  /** Cached result */
  result: T;

  /** Timestamp when cached */
  timestamp: number;

  /** Cache key */
  key: string;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Number of cache hits */
  hits: number;

  /** Number of cache misses */
  misses: number;

  /** Hit rate (0-1) */
  hitRate: number;

  /** Current cache size */
  size: number;

  /** Maximum cache size */
  maxSize: number;
}

/**
 * Cached tool interface - combines CoreTool with cache methods
 */
export type CachedTool<T extends Tool = Tool> = T & {
  /** Get cache statistics */
  getStats(): CacheStats;

  /** Clear cache entries */
  clearCache(key?: string): void;

  /** Check if parameters are cached */
  isCached(params: any): boolean | Promise<boolean>;

  /** Get cache key for parameters */
  getCacheKey(params: any): string;
};

/**
 * Internal cache store interface
 * Supports both sync and async operations for different backends
 */
export interface CacheStore<T = any> {
  /** Get cached entry */
  get(
    key: string,
  ): CacheEntry<T> | undefined | Promise<CacheEntry<T> | undefined>;

  /** Set cache entry */
  set(key: string, entry: CacheEntry<T>): void | Promise<void>;

  /** Delete cache entry */
  delete(key: string): boolean | Promise<boolean>;

  /** Clear all entries */
  clear(): void | Promise<void>;

  /** Check if key exists */
  has(key: string): boolean | Promise<boolean>;

  /** Get current size */
  size(): number | Promise<number>;

  /** Get all keys */
  keys(): string[] | Promise<string[]>;

  /** Get default TTL if configured */
  getDefaultTTL?(): number | undefined;
}
