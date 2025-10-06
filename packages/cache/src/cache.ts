import type { Tool } from "ai";
import type { CacheOptions, CachedTool, CacheStats, CacheStore } from "./types";
import { LRUCacheStore } from "./cache-store";
import { createCacheBackend } from "./backends/factory";



/**
 * Default cache key generator - stable and deterministic
 */
function defaultKeyGenerator(params: any, context?: any): string {
  const paramsKey = serializeValue(params);
  
  if (context) {
    return `${paramsKey}|${context}`;
  }
  
  return paramsKey;
}

/**
 * Serialize a value to a stable string representation
 */
function serializeValue(value: any): string {
  // Handle different parameter types like React Query
  if (value === null || value === undefined) {
    return 'null';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  if (Array.isArray(value)) {
    return `[${value.map(serializeValue).join(',')}]`;
  }
  
  if (typeof value === 'object') {
    // Sort keys for deterministic serialization (like React Query)
    const sortedKeys = Object.keys(value).sort();
    const pairs = sortedKeys.map(key => `${key}:${serializeValue(value[key])}`);
    return `{${pairs.join(',')}}`;
  }
  
  return String(value);
}

/**
 * Simple streaming tool cache - just adds cache API methods without interfering
 */
function createStreamingCachedTool<T extends Tool>(
  tool: T,
  options: CacheOptions
): CachedTool {
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 1000,
    store,
    keyGenerator = defaultKeyGenerator,
    cacheKey,
    shouldCache = () => true,
    onHit,
    onMiss,
    debug = false,
  } = options;

  const cacheStore = store || new LRUCacheStore(maxSize);
  let hits = 0;
  let misses = 0;

  // Add cache API methods and override execute with caching logic
  return {
    ...tool,
    execute: async function* (...args: any[]) {
      const [params, executionOptions] = args;
      // Get context from cacheKey function
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const now = Date.now();

      // Check cache first
      const cached = await cacheStore.get(key);
      if (cached && (now - cached.timestamp) < ttl) {
        hits++;
        onHit?.(key);
        
        const result = cached.result;
        
        if (debug) {
          const yields = result?.streamResults?.length || 0;
          const artifacts = result?.messages?.length || 0;
          const hasReturn = result?.returnValue !== undefined;
          
          console.log(`\n🎯 Cache HIT - Streaming Tool`);
          console.log(`┌─ Key: ${key.slice(0, 60)}${key.length > 60 ? '...' : ''}`);
          console.log(`├─ Streaming yields: ${yields}`);
          console.log(`├─ Artifact messages: ${artifacts}`);
          console.log(`├─ Return value: ${hasReturn ? 'yes' : 'no'}`);
          console.log(`└─ Restoring cached results...\n`);
        }
        
        // Replay artifact messages first
        if (result?.messages?.length > 0) {
          let writer = executionOptions?.writer || 
                     (executionOptions as any)?.experimental_context?.writer;
          
          if (!writer) {
            try {
              const { artifacts } = await import('@ai-sdk-tools/artifacts');
              if (artifacts.isActive()) {
                const context = artifacts.getContext();
                writer = context?.writer;
              }
            } catch {
              // Artifacts not available
            }
          }
          
          if (writer) {
            if (debug) console.log(`   Replaying ${result.messages.length} artifact messages...`);
            for (const msg of result.messages) {
              writer.write(msg);
            }
            if (debug) console.log(`   Artifacts restored`);
          }
        }
        
        // Replay streaming yields
        if (result?.streamResults) {
          if (debug) console.log(`   Replaying ${result.streamResults.length} streaming yields...`);
          for (const item of result.streamResults) {
            yield item;
          }
          if (debug) console.log(`   Streaming content restored`);
        }
        
        return result.returnValue;
      }

      // Cache miss - execute original and capture
      misses++;
      onMiss?.(key);
      if (debug) {
        console.log(`\n🔄 Cache MISS - Streaming Tool`);
        console.log(`┌─ Key: ${key.slice(0, 60)}${key.length > 60 ? '...' : ''}`);
        console.log(`├─ Will capture: streaming yields + artifact messages + return value`);
        console.log(`└─ Executing tool and capturing results...\n`);
      }

      // Capture writer messages
      let writer = executionOptions?.writer || 
                  (executionOptions as any)?.experimental_context?.writer;
      
      if (!writer) {
        try {
          const { artifacts } = await import('@ai-sdk-tools/artifacts');
          if (artifacts.isActive()) {
            const context = artifacts.getContext();
            writer = context?.writer;
          }
        } catch {
          // Artifacts not available
        }
      }
      
      const capturedMessages: any[] = [];
      
      if (writer) {
        const originalWrite = writer.write;
        writer.write = (data: any) => {
          capturedMessages.push(data);
          return originalWrite.call(writer, data);
        };
      }

      // Execute original tool
      const originalResult = await tool.execute?.(params, executionOptions);
      
      // Create tee generator that streams and caches
      let lastChunk: any = null;
      let finalReturnValue: any = undefined;
      let chunkCount = 0;
      
      if (originalResult && typeof originalResult[Symbol.asyncIterator] === 'function') {
        const iterator = originalResult[Symbol.asyncIterator]();
        let iterResult = await iterator.next();
        
        while (!iterResult.done) {
          lastChunk = iterResult.value; // Just keep the last chunk (it has full text)
          chunkCount++;
          
          // Debug logging only for first few yields to avoid spam
          if (debug && chunkCount <= 3) {
            console.log(`   Capturing yield #${chunkCount}:`, lastChunk?.text?.slice(0, 40) + '...');
          }
          yield iterResult.value; // Stream immediately
          iterResult = await iterator.next();
        }
        
        finalReturnValue = iterResult.value;
      }
      
      queueMicrotask(() => {
        // This runs after all current synchronous operations and promises
        queueMicrotask(async () => {
          try {
            // Store only the final chunk (it already has the complete text)
            const completeResult = {
              streamResults: lastChunk ? [lastChunk] : [], // Only final chunk
              messages: capturedMessages,
              returnValue: finalReturnValue,
              type: 'streaming'
            };
            
            if (shouldCache(params, completeResult)) {
              await cacheStore.set(key, {
                result: completeResult,
                timestamp: now,
                key,
              });
              if (debug) {
                const cacheItems = typeof cacheStore.size === 'function' ? await cacheStore.size() : 'unknown';
                
                // Calculate approximate memory usage
                const estimatedSize = JSON.stringify(completeResult).length;
                const sizeKB = Math.round(estimatedSize / 1024 * 100) / 100;
                
                console.log(`\n💾 Cache STORED - Streaming Tool`);
                console.log(`┌─ Streaming yields: ${chunkCount}`);
                console.log(`├─ Artifact messages: ${capturedMessages.length}`);
                console.log(`├─ Return value: ${finalReturnValue !== undefined ? 'yes' : 'no'}`);
                console.log(`├─ Entry size: ~${sizeKB}KB`);
                console.log(`├─ Cache items: ${cacheItems}/${maxSize}`);
                console.log(`└─ Ready for instant replay!\n`);
              }
            }
          } catch (error) {
            if (debug) console.log(`[Cache] Microtask caching failed:`, error);
          }
        });
      });
      
      return finalReturnValue;
    },
    getStats() {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
        size: typeof cacheStore.size === 'function' ? (cacheStore.size() as any) : 0,
        maxSize,
      };
    },
    clearCache(key?: string) {
      if (key) {
        cacheStore.delete(key);
      } else {
        cacheStore.clear();
      }
    },
    async isCached(params: any) {
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const cached = await cacheStore.get(key);
      if (!cached) return false;
      
      const now = Date.now();
      const isValid = (now - cached.timestamp) < ttl;
      
      if (!isValid) {
        await cacheStore.delete(key);
        return false;
      }
      
      return true;
    },
    getCacheKey(params: any) {
      const context = cacheKey?.();
      return keyGenerator(params, context);
    },
  } as unknown as CachedTool;
}

export function cached<T extends Tool>(
  tool: T,
  options?: CacheOptions
): CachedTool {
  // For streaming tools, implement proper caching
  if (tool.execute?.constructor?.name === 'AsyncGeneratorFunction') {
    return createStreamingCachedTool(tool, options || {});
  }
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 1000,
    store,
    keyGenerator = defaultKeyGenerator,
    cacheKey,
    shouldCache = () => true,
    onHit,
    onMiss,
    debug = false,
  } = options || {};

  const cacheStore = store || new LRUCacheStore(maxSize);
  const effectiveTTL = ttl ?? cacheStore.getDefaultTTL?.() ?? 5 * 60 * 1000;
  let hits = 0;
  let misses = 0;

  const log = debug ? console.log : () => {};

  const cacheApi = {
    getStats(): CacheStats {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total > 0 ? hits / total : 0,
        size: typeof cacheStore.size === 'function' ? (cacheStore.size() as any) : 0,
        maxSize,
      };
    },

    clearCache(key?: string): void {
      if (key) {
        cacheStore.delete(key);
      } else {
        cacheStore.clear();
      }
    },

    async isCached(params: any): Promise<boolean> {
      const context = cacheKey?.();
      const key = keyGenerator(params, context);
      const cached = await cacheStore.get(key);
      if (!cached) return false;
      
      const now = Date.now();
      const isValid = (now - cached.timestamp) < effectiveTTL;
      
      if (!isValid) {
        await cacheStore.delete(key);
        return false;
      }
      
      return true;
    },

    getCacheKey(params: any): string {
      const context = cacheKey?.();
      return keyGenerator(params, context);
    },
  };

  const cachedTool = new Proxy(tool, {
    get(target, prop) {
      if (prop === 'execute') {
        // Preserve the original function type
        if (target.execute?.constructor?.name === 'AsyncGeneratorFunction') {
          return async function* (...args: any[]) {
          const [params, executionOptions] = args;
          const context = cacheKey?.();
          const key = keyGenerator(params, context);
          const now = Date.now();

          // Check cache
          const cached = await cacheStore.get(key);
          if (cached && (now - cached.timestamp) < effectiveTTL) {
            hits++;
            onHit?.(key);
            log(`[Cache] HIT`);
            
            const result = cached.result;
            
            // For streaming tools, replay messages immediately then return generator
            if (target.execute?.constructor?.name === 'AsyncGeneratorFunction') {
              // Replay messages IMMEDIATELY to restore artifact data
              if (result?.messages?.length > 0) {
                const writer = executionOptions?.writer || 
                             (executionOptions as any)?.experimental_context?.writer;
                
                if (writer) {
                  log(`[Cache] Replaying ${result.messages.length} messages`);
                  for (const msg of result.messages) {
                    writer.write(msg);
                  }
                }
              }
              
              // Then return generator that yields stream results
              return (async function* () {
                if (result?.streamResults) {
                  for (const item of result.streamResults) {
                    yield item;
                  }
                } else if (Array.isArray(result)) {
                  for (const item of result) {
                    yield item;
                  }
                } else {
                  yield result;
                }
              })();
            }
            
            return result;
          }

          // Execute original
          misses++;
          onMiss?.(key);
          log(`[Cache] MISS`);

          // Capture messages if writer available
          const writer = executionOptions?.writer || 
                        (executionOptions as any)?.experimental_context?.writer;
          
          const capturedMessages: any[] = [];
          
          if (writer) {
            const originalWrite = writer.write;
            writer.write = (data: any) => {
              capturedMessages.push(data);
              return originalWrite.call(writer, data);
            };
          }

          const result = await target.execute?.(params, executionOptions);

          // Handle streaming tools
          if (result && typeof (result as any)[Symbol.asyncIterator] === 'function') {
            const streamResults: any[] = [];
            let lastChunk: any = null;
            
            // Stream to user immediately while capturing
            const streamGenerator = (async function* () {
              for await (const chunk of result as any) {
                streamResults.push(chunk);
                lastChunk = chunk;
                yield chunk; // Stream immediately to user
              }
              
              // After streaming completes, cache only the final chunk
              queueMicrotask(async () => {
                const completeResult = {
                  streamResults: lastChunk ? [lastChunk] : [], // Only store final chunk
                  messages: capturedMessages,
                  type: 'streaming'
                };
                
                if (shouldCache(params, completeResult)) {
                  await cacheStore.set(key, {
                    result: completeResult,
                    timestamp: now,
                    key,
                  });
                  log(`[Cache] STORED streaming result with ${capturedMessages.length} messages`);
                }
              });
            })();
            
            return streamGenerator;
          }

          // Regular tool
          if (shouldCache(params, result)) {
            await cacheStore.set(key, {
              result,
              timestamp: now,
              key,
            });
            log(`[Cache] STORED result`);
          }

          return result;
          };
        } else {
          // Regular async function
          return async (...args: any[]) => {
            const [params, executionOptions] = args;
            const context = cacheKey?.();
            const key = keyGenerator(params, context);
            const now = Date.now();

            // Check cache
            const cached = await cacheStore.get(key);
            if (cached && (now - cached.timestamp) < effectiveTTL) {
              hits++;
              onHit?.(key);
              log(`[Cache] HIT`);
              return cached.result;
            }

            // Execute original
            misses++;
            onMiss?.(key);
            log(`[Cache] MISS`);

            const result = await target.execute?.(params, executionOptions);

            if (shouldCache(params, result)) {
              await cacheStore.set(key, {
                result,
                timestamp: now,
                key,
              });
              log(`[Cache] STORED result`);
            }

            return result;
          };
        }
      }
      
      if (prop in cacheApi) {
        return cacheApi[prop as keyof typeof cacheApi];
      }
      
      return target[prop as keyof typeof target];
    }
  }) as unknown as CachedTool;

  return cachedTool;
}

/**
 * Creates a pre-configured cached function with default options
 */
export function createCachedFunction(
  store: CacheStore,
  defaultOptions: Omit<CacheOptions, 'store'> = {}
) {
  return <T extends Tool>(
    tool: T, 
    options: Omit<CacheOptions, 'store'> = {}
  ): CachedTool => {
    return cached(tool, { ...defaultOptions, ...options, store });
  };
}

/**
 * Cache multiple tools with the same configuration
 */
export function cacheTools<T extends Record<string, Tool>>(
  tools: T,
  options: CacheOptions = {}
): { [K in keyof T]: CachedTool } {
  const cachedTools = {} as { [K in keyof T]: CachedTool };

  for (const [name, tool] of Object.entries(tools)) {
    cachedTools[name as keyof T] = cached(tool, options);
  }

  return cachedTools;
}



/**
 * Create a cached function with Redis client or default LRU
 * 
 * Example usage:
 * ```ts
 * import { Redis } from "@upstash/redis";
 * import { createCached } from "@ai-sdk-tools/cache";
 * 
 * // Upstash Redis
 * const cached = createCached({ cache: Redis.fromEnv() });
 * 
 * // Standard Redis  
 * const cached = createCached({ cache: Redis.createClient() });
 * 
 * // Default LRU (no cache client)
 * const cached = createCached();
 * ```
 */
export function createCached(options: {
  cache?: any; // User's Redis client - we pass it directly
  keyPrefix?: string;
  ttl?: number;
  debug?: boolean;
  cacheKey?: () => string;
  onHit?: (key: string) => void;
  onMiss?: (key: string) => void;
} = {}) {
  // If no cache provided, use default LRU
  if (!options.cache) {
    const lruStore = createCacheBackend({
      type: "lru",
      maxSize: 100,
      defaultTTL: options.ttl || 10 * 60 * 1000, // 10 minutes default
    });

  return createCachedFunction(lruStore, {
    debug: options.debug || false,
    cacheKey: options.cacheKey,
    onHit: options.onHit,
    onMiss: options.onMiss,
  });
  }

  // Use Redis client directly - no adapter needed!
  const redisStore = createCacheBackend({
    type: "redis",
    defaultTTL: options.ttl || 30 * 60 * 1000, // 30 minutes default
    redis: {
      client: options.cache, // Pass user's Redis client directly
      keyPrefix: options.keyPrefix || "ai-tools-cache:",
    },
  });

  return createCachedFunction(redisStore, {
    debug: options.debug || false,
    cacheKey: options.cacheKey,
    onHit: options.onHit,
    onMiss: options.onMiss,
  });
}
