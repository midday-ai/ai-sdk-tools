/**
 * @ai-sdk-tools/cache
 *
 * Simple caching wrapper for AI SDK tools. Cache expensive tool executions
 * with zero configuration.
 */

export { cached, cacheTools, createCached, serializeValue } from "./cache";
export type {
  CachedTool,
  CacheOptions,
} from "./types";
