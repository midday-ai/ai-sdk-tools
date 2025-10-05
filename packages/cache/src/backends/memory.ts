import type { CacheEntry, CacheStore } from "../types";

/**
 * Enhanced memory cache store with better performance characteristics
 */
export class MemoryCacheStore<T = any> implements CacheStore<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private maxSize: number;
  private accessCounter = 0;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      // Update access order for LRU
      this.accessOrder.set(key, ++this.accessCounter);
    }
    return entry;
  }

  set(key: string, entry: CacheEntry<T>): void {
    // If key already exists, just update it
    if (this.cache.has(key)) {
      this.cache.set(key, entry);
      this.accessOrder.set(key, ++this.accessCounter);
      return;
    }

    // If at capacity, evict least recently used
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessOrder.delete(key);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getDefaultTTL?(): number | undefined {
    return undefined;
  }

  private evictLRU(): void {
    let oldestKey: string | undefined;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: this.cache.size / this.maxSize,
    };
  }

  /**
   * Clean up expired entries based on TTL
   */
  cleanup(ttl: number): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > ttl) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}
