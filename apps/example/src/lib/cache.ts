import { createCachedFunction, LRUCacheStore } from "@ai-sdk-tools/cache";

// Create a pre-configured cache store
const cacheStore = new LRUCacheStore(100); // Max 100 items

// Create a pre-configured cached function with your settings
export const cached = createCachedFunction(cacheStore, {
  debug: false,
  ttl: 10 * 60 * 1000, // 10 minutes
  onHit: (key) => console.log(`🎯 CACHE HIT: ${key.slice(0, 50)}...`),
  onMiss: (key) => console.log(`🔄 CACHE MISS: ${key.slice(0, 50)}...`),
});

// Export the store for advanced usage
export { cacheStore };
