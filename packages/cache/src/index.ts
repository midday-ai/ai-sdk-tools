/**
 * @ai-sdk-tools/cache
 * 
 * Simple caching wrapper for AI SDK tools. Cache expensive tool executions 
 * with zero configuration.
 */

export { cached, createCached, cacheTools } from "./cache";
export type {
  CacheOptions,
  CachedTool,
} from "./types";

// Re-export useful types from ai package
export type { Tool } from "ai";
