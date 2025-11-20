# @ai-sdk-tools/memory

## 2.0.0

### Minor Changes

- Release version 1.1.0

## 1.0.8

### Patch Changes

- - Fix RedisClient type to include RedisClientType from redis package
  - Add redis and ioredis as optional peer dependencies

## 1.0.7

### Patch Changes

- - Add userId filtering to getMessages for improved security
  - Add search and limit parameters to getChats
  - Add deleteChat method to MemoryProvider interface
  - Optimize Redis/Upstash providers with sorted sets for efficient queries
  - Improve chat title generation and persistence
  - Add chat history UI component with search and overlay sidebar

## 1.0.6

### Patch Changes

- - Fix `updateChatTitle` to create chat if it doesn't exist yet, ensuring generated titles are always saved
  - Handle race condition where title generation completes before chat is saved

## 1.0.5

### Patch Changes

- - Fix `updateChatTitle` to create chat if it doesn't exist yet, ensuring generated titles are always saved
  - Handle race condition where title generation completes before chat is saved

## 1.0.4

### Patch Changes

- - Add `limit` parameter to `getChats()` for efficient pagination
  - Optimize Redis/Upstash providers to use global sorted set for efficient sorting and limiting (no more SCAN/KEYS)
  - Fix Upstash provider to use SCAN instead of KEYS to avoid errors with many keys
  - Improve search performance by fetching optimized number of chats before filtering

## 1.0.3

### Patch Changes

- - Add `limit` parameter to `getChats()` for efficient pagination
  - Optimize Redis/Upstash providers to use global sorted set for efficient sorting and limiting (no more SCAN/KEYS)
  - Fix Upstash provider to use SCAN instead of KEYS to avoid errors with many keys
  - Improve search performance by fetching optimized number of chats before filtering

## 1.0.2

### Patch Changes

- Add Redis provider support for self-hosted Redis instances and make message TTL configurable for both Redis and Upstash providers
- Update getMessages to return UIMessage[] format (Vercel AI SDK) and add deleteChat method

## 1.0.1

### Patch Changes

- Add Redis provider support for self-hosted Redis instances and make message TTL configurable for both Redis and Upstash providers

## 1.0.0

### Minor Changes

- Synchronize all package versions.

### Patch Changes

- Updated dependencies
  - @ai-sdk-tools/debug@1.0.0

## 0.9.1

### Patch Changes

- Routine release.
- Updated dependencies
  - @ai-sdk-tools/debug@0.9.1

## 0.1.0

### Minor Changes

- Initial release of `@ai-sdk-tools/memory` package
- Persistent working memory system for AI agents
- Three built-in providers:
  - `InMemoryProvider` - Zero setup, perfect for development
  - `LibSQLProvider` - Local file or Turso cloud persistence
  - `UpstashProvider` - Serverless Redis for edge environments
- Simple 4-method `MemoryProvider` interface
- Flexible memory scopes: chat-level or user-level
- Optional conversation history tracking
- Automatic integration with `@ai-sdk-tools/agents`
- Auto-injection of `updateWorkingMemory` tool
- TypeScript-first design with full type safety
