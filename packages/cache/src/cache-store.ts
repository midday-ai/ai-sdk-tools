import type { CacheEntry, CacheStore } from "./types";

/**
 * LRU (Least Recently Used) cache implementation
 */
export class LRUCacheStore<T = any> implements CacheStore<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, entry);
    }
    return entry;
  }

  set(key: string, entry: CacheEntry<T>): void {
    // Remove if already exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Evict oldest if at capacity
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, entry);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
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
}

/**
 * Simple Map-based cache store (no LRU eviction)
 */
export class SimpleCacheStore<T = any> implements CacheStore<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry<T> | undefined {
    return this.cache.get(key);
  }

  set(key: string, entry: CacheEntry<T>): void {
    // Simple eviction: clear all if at capacity
    if (this.cache.size >= this.maxSize) {
      this.cache.clear();
    }
    this.cache.set(key, entry);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
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
}
