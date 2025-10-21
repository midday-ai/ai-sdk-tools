/**
 * Schema helpers for Drizzle provider
 *
 * These helpers make it easy to create compatible table schemas
 * for any database backend (PostgreSQL, MySQL, SQLite).
 *
 * Note: These functions use `any` types because they accept Drizzle's
 * table builder objects which have different types for each database.
 * This is intentional to support all database backends.
 */

// PostgreSQL Schema Helpers
/**
 * Create a working memory table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable } from 'drizzle-orm/pg-core';
 * import { createPgWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = pgTable('working_memory', createPgWorkingMemorySchema());
 * ```
 */
export function createPgWorkingMemorySchema() {
  // Import types will be resolved at runtime by user
  // This returns the schema object that works with pgTable
  return {
    id: (t: any) => t.text("id").primaryKey(),
    scope: (t: any) => t.text("scope").notNull(),
    chatId: (t: any) => t.text("chat_id"),
    userId: (t: any) => t.text("user_id"),
    content: (t: any) => t.text("content").notNull(),
    updatedAt: (t: any) => t.timestamp("updated_at").notNull(),
  };
}

/**
 * Create a conversation messages table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable, serial } from 'drizzle-orm/pg-core';
 * import { createPgMessagesSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const messages = pgTable('conversation_messages', createPgMessagesSchema());
 * ```
 */
export function createPgMessagesSchema() {
  return {
    id: (t: any) => t.serial("id").primaryKey(),
    chatId: (t: any) => t.text("chat_id").notNull(),
    userId: (t: any) => t.text("user_id"),
    role: (t: any) => t.text("role").notNull(),
    content: (t: any) => t.text("content").notNull(),
    timestamp: (t: any) => t.timestamp("timestamp").notNull(),
  };
}

// MySQL Schema Helpers
/**
 * Create a working memory table schema for MySQL
 *
 * @example
 * ```ts
 * import { mysqlTable } from 'drizzle-orm/mysql-core';
 * import { createMysqlWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = mysqlTable('working_memory', createMysqlWorkingMemorySchema());
 * ```
 */
export function createMysqlWorkingMemorySchema() {
  return {
    id: (t: any) => t.varchar("id", { length: 255 }).primaryKey(),
    scope: (t: any) => t.varchar("scope", { length: 50 }).notNull(),
    chatId: (t: any) => t.varchar("chat_id", { length: 255 }),
    userId: (t: any) => t.varchar("user_id", { length: 255 }),
    content: (t: any) => t.text("content").notNull(),
    updatedAt: (t: any) => t.timestamp("updated_at").notNull(),
  };
}

/**
 * Create a conversation messages table schema for MySQL
 */
export function createMysqlMessagesSchema() {
  return {
    id: (t: any) => t.int("id").primaryKey().autoincrement(),
    chatId: (t: any) => t.varchar("chat_id", { length: 255 }).notNull(),
    userId: (t: any) => t.varchar("user_id", { length: 255 }),
    role: (t: any) => t.varchar("role", { length: 50 }).notNull(),
    content: (t: any) => t.text("content").notNull(),
    timestamp: (t: any) => t.timestamp("timestamp").notNull(),
  };
}

// SQLite Schema Helpers
/**
 * Create a working memory table schema for SQLite
 *
 * @example
 * ```ts
 * import { sqliteTable } from 'drizzle-orm/sqlite-core';
 * import { createSqliteWorkingMemorySchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const workingMemory = sqliteTable('working_memory', createSqliteWorkingMemorySchema());
 * ```
 */
export function createSqliteWorkingMemorySchema() {
  return {
    id: (t: any) => t.text("id").primaryKey(),
    scope: (t: any) => t.text("scope").notNull(),
    chatId: (t: any) => t.text("chat_id"),
    userId: (t: any) => t.text("user_id"),
    content: (t: any) => t.text("content").notNull(),
    updatedAt: (t: any) =>
      t.integer("updated_at", { mode: "timestamp" }).notNull(),
  };
}

/**
 * Create a conversation messages table schema for SQLite
 */
export function createSqliteMessagesSchema() {
  return {
    id: (t: any) => t.integer("id").primaryKey({ autoIncrement: true }),
    chatId: (t: any) => t.text("chat_id").notNull(),
    userId: (t: any) => t.text("user_id"),
    role: (t: any) => t.text("role").notNull(),
    content: (t: any) => t.text("content").notNull(),
    timestamp: (t: any) =>
      t.integer("timestamp", { mode: "timestamp" }).notNull(),
  };
}

// Chat Sessions Schema Helpers

/**
 * Create a chat sessions table schema for PostgreSQL
 *
 * @example
 * ```ts
 * import { pgTable } from 'drizzle-orm/pg-core';
 * import { createPgChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = pgTable('chat_sessions', createPgChatsSchema());
 * ```
 */
export function createPgChatsSchema() {
  return {
    chatId: (t: any) => t.text("chat_id").primaryKey(),
    userId: (t: any) => t.text("user_id"),
    title: (t: any) => t.text("title"),
    createdAt: (t: any) => t.timestamp("created_at").notNull(),
    updatedAt: (t: any) => t.timestamp("updated_at").notNull(),
    messageCount: (t: any) => t.integer("message_count").notNull().default(0),
  };
}

/**
 * Create a chat sessions table schema for MySQL
 *
 * @example
 * ```ts
 * import { mysqlTable } from 'drizzle-orm/mysql-core';
 * import { createMysqlChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = mysqlTable('chat_sessions', createMysqlChatsSchema());
 * ```
 */
export function createMysqlChatsSchema() {
  return {
    chatId: (t: any) => t.varchar("chat_id", { length: 255 }).primaryKey(),
    userId: (t: any) => t.varchar("user_id", { length: 255 }),
    title: (t: any) => t.varchar("title", { length: 500 }),
    createdAt: (t: any) => t.timestamp("created_at").notNull(),
    updatedAt: (t: any) => t.timestamp("updated_at").notNull(),
    messageCount: (t: any) => t.int("message_count").notNull().default(0),
  };
}

/**
 * Create a chat sessions table schema for SQLite
 *
 * @example
 * ```ts
 * import { sqliteTable } from 'drizzle-orm/sqlite-core';
 * import { createSqliteChatsSchema } from '@ai-sdk-tools/memory/drizzle';
 *
 * export const chats = sqliteTable('chat_sessions', createSqliteChatsSchema());
 * ```
 */
export function createSqliteChatsSchema() {
  return {
    chatId: (t: any) => t.text("chat_id").primaryKey(),
    userId: (t: any) => t.text("user_id"),
    title: (t: any) => t.text("title"),
    createdAt: (t: any) =>
      t.integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: (t: any) =>
      t.integer("updated_at", { mode: "timestamp" }).notNull(),
    messageCount: (t: any) => t.integer("message_count").notNull().default(0),
  };
}

/**
 * Example SQL for manual schema creation
 */
export const SQL_SCHEMAS = {
  postgresql: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id TEXT PRIMARY KEY,
        scope TEXT NOT NULL,
        chat_id TEXT,
        user_id TEXT,
        content TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id SERIAL PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        message_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `,
  },
  mysql: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id VARCHAR(255) PRIMARY KEY,
        scope VARCHAR(50) NOT NULL,
        chat_id VARCHAR(255),
        user_id VARCHAR(255),
        content TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        chat_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        title VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        message_count INT NOT NULL DEFAULT 0
      );
      CREATE INDEX idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `,
  },
  sqlite: {
    workingMemory: `
      CREATE TABLE IF NOT EXISTS working_memory (
        id TEXT PRIMARY KEY,
        scope TEXT NOT NULL,
        chat_id TEXT,
        user_id TEXT,
        content TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
    `,
    messages: `
      CREATE TABLE IF NOT EXISTS conversation_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
    `,
    chats: `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        chat_id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        message_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_chats_user ON chat_sessions(user_id, updated_at DESC);
    `,
  },
} as const;
