# @ai-sdk-tools/memory

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

