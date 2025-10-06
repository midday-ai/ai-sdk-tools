// Perfect! Now we can use the clean API
import { createCached } from "@ai-sdk-tools/cache";
import { Redis as UpstashRedis } from "@upstash/redis";
import { createClient } from "redis";

// Default LRU cache (zero config)
export const cached = createCached({
  debug: true,
  ttl: 10 * 60 * 1000, // 10 minutes
});

// To use Upstash, just uncomment and pass the client:
export const cachedUpstash = createCached({
  cache: UpstashRedis.fromEnv(), // Just pass any Upstash client!
  ttl: 30 * 60 * 1000,
  debug: true,
  onHit: (key) => console.log(`🟢 REDIS CACHE HIT: ${key.slice(0, 50)}...`),
  onMiss: (key) => console.log(`🔴 REDIS CACHE MISS: ${key.slice(0, 50)}...`),
});

const client =  createClient()

// To use Redis, just uncomment and pass the client:
export const cachedRedis = createCached({
  cache: client, // Just pass any Redis client!
  ttl: 30 * 60 * 1000,
  debug: true,
  onHit: (key) => console.log(`🟢 REDIS CACHE HIT: ${key.slice(0, 50)}...`),
  onMiss: (key) => console.log(`🔴 REDIS CACHE MISS: ${key.slice(0, 50)}...`),
});