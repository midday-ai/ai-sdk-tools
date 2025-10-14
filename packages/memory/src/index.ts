// Providers

export type {
  ChatsTable,
  ConversationMessagesTable,
  DrizzleProviderConfig,
  WorkingMemoryTable,
} from "./providers/drizzle.js";
export { DrizzleProvider } from "./providers/drizzle.js";
// Schema Helpers
export {
  createMysqlChatsSchema,
  createMysqlMessagesSchema,
  createMysqlWorkingMemorySchema,
  createPgChatsSchema,
  createPgMessagesSchema,
  createPgWorkingMemorySchema,
  createSqliteChatsSchema,
  createSqliteMessagesSchema,
  createSqliteWorkingMemorySchema,
  SQL_SCHEMAS,
} from "./providers/drizzle-schema.js";
export { ChromaMemoryProvider } from "./providers/chroma.js";
export { InMemoryProvider } from "./providers/in-memory.js";
export { UpstashProvider } from "./providers/upstash.js";

export type {
  ChatSession,
  ChatsConfig,
  ConversationMessage,
  GenerateTitleConfig,
  MemoryConfig,
  MemoryProvider,
  MemoryScope,
  WorkingMemory,
} from "./types.js";

// Utils
export {
  DEFAULT_TEMPLATE,
  formatHistory,
  formatWorkingMemory,
  getWorkingMemoryInstructions,
} from "./utils.js";
