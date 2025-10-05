import type { Tool } from "ai";
import type { CacheOptions, CachedTool, CacheStats, CacheEntry, CacheStore } from "./types";
import { LRUCacheStore } from "./cache-store";

/**
 * React Query style cache key generator - stable and deterministic
 */
function defaultKeyGenerator(params: any): string {
  // Handle different parameter types like React Query
  if (params === null || params === undefined) {
    return 'null';
  }
  
  if (typeof params === 'string' || typeof params === 'number' || typeof params === 'boolean') {
    return String(params);
  }
  
  if (params instanceof Date) {
    return params.toISOString();
  }
  
  if (Array.isArray(params)) {
    return `[${params.map(defaultKeyGenerator).join(',')}]`;
  }
  
  if (typeof params === 'object') {
    // Sort keys for deterministic serialization (like React Query)
    const sortedKeys = Object.keys(params).sort();
    const pairs = sortedKeys.map(key => `${key}:${defaultKeyGenerator(params[key])}`);
    return `{${pairs.join(',')}}`;
  }
  
  return String(params);
}

export function cached<T extends Tool>(
  tool: T,
  options?: CacheOptions
): CachedTool {
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 1000,
    store,
    keyGenerator = defaultKeyGenerator,
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
      const key = keyGenerator(params);
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
      return keyGenerator(params);
    },
  };

  const cachedTool = new Proxy(tool, {
    get(target, prop) {
      if (prop === 'execute') {
        // Preserve the original function type
        if (target.execute?.constructor?.name === 'AsyncGeneratorFunction') {
          return async function* (...args: any[]) {
          const [params, executionOptions] = args;
          const key = keyGenerator(params);
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
            for await (const chunk of result as any) {
              streamResults.push(chunk);
            }
            
            const completeResult = {
              streamResults,
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

            // Return generator that yields results
            return (async function* () {
              for (const chunk of streamResults) {
                yield chunk;
              }
            })();
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
            const key = keyGenerator(params);
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
 * Creates a pre-configured cached function with a specific store
 */
export function createCachedFunction(store: CacheStore) {
  return <T extends Tool>(
    tool: T, 
    options: Omit<CacheOptions, 'store'> = {}
  ): CachedTool => {
    return cached(tool, { ...options, store });
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
