import type { CacheEntry, CacheStore } from "../types";

/**
 * Redis cache store implementation
 * Requires redis client to be provided
 */
export class RedisCacheStore<T = any> implements CacheStore<T> {
  private redis: any;
  private keyPrefix: string;

  constructor(redisClient: any, keyPrefix = "ai-tools-cache:") {
    this.redis = redisClient;
    this.keyPrefix = keyPrefix;
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get(key: string): Promise<CacheEntry<T> | undefined> {
    try {
      const data = await this.redis.get(this.getKey(key));
      if (!data) return undefined;
      
      // Handle different Redis client return types
      let jsonString: string;
      if (typeof data === 'string') {
        jsonString = data;
      } else if (typeof data === 'object') {
        // Some Redis clients return objects directly
        return {
          result: data.result,
          timestamp: data.timestamp,
          key: data.key,
        };
      } else {
        // Convert other types to string
        jsonString = String(data);
      }
      
      const parsed = JSON.parse(jsonString);
      return {
        result: parsed.result,
        timestamp: parsed.timestamp,
        key: parsed.key,
      };
    } catch (error) {
      console.warn(`Redis cache get error for key ${key}:`, error);
      return undefined;
    }
  }

  async set(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const data = JSON.stringify({
        result: entry.result,
        timestamp: entry.timestamp,
        key: entry.key,
      });
      
      await this.redis.set(this.getKey(key), data);
    } catch (error) {
      console.warn(`Redis cache set error for key ${key}:`, error);
    }
  }

  async setWithTTL(key: string, entry: CacheEntry<T>, ttlSeconds: number): Promise<void> {
    try {
      const data = JSON.stringify({
        result: entry.result,
        timestamp: entry.timestamp,
        key: entry.key,
      });
      
      await this.redis.setex(this.getKey(key), ttlSeconds, data);
    } catch (error) {
      console.warn(`Redis cache setex error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.warn(`Redis cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.warn("Redis cache clear error:", error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(this.getKey(key));
      return exists > 0;
    } catch (error) {
      console.warn(`Redis cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async size(): Promise<number> {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      return keys.length;
    } catch (error) {
      console.warn("Redis cache size error:", error);
      return 0;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      return keys.map((key: string) => key.replace(this.keyPrefix, ""));
    } catch (error) {
      console.warn("Redis cache keys error:", error);
      return [];
    }
  }

  getDefaultTTL?(): number | undefined {
    return undefined;
  }
}
