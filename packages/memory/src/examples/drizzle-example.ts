/**
 * Drizzle Provider Usage Examples
 *
 * This file demonstrates how to use the DrizzleProvider with different databases.
 */

// ============================================================================
// Example 1: PostgreSQL with Vercel Postgres
// ============================================================================
/*
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

// Define your schema
export const workingMemory = pgTable("working_memory", {
  id: text("id").primaryKey(),
  scope: text("scope").notNull(),
  chatId: text("chat_id"),
  userId: text("user_id"),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const conversationMessages = pgTable("conversation_messages", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  userId: text("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

// Initialize database
const db = drizzle(sql);

// Create provider
export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});
*/

// ============================================================================
// Example 2: PostgreSQL with Neon
// ============================================================================
/*
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Use the same schema as Example 1
export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});
*/

// ============================================================================
// Example 3: MySQL with PlanetScale
// ============================================================================
/*
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const connection = connect({
  url: process.env.DATABASE_URL,
});

const db = drizzle(connection);

export const workingMemory = mysqlTable("working_memory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  scope: varchar("scope", { length: 50 }).notNull(),
  chatId: varchar("chat_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const conversationMessages = mysqlTable("conversation_messages", {
  id: int("id").primaryKey().autoincrement(),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});
*/

// ============================================================================
// Example 4: SQLite with local file
// ============================================================================
/*
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const sqlite = new Database("memory.db");
const db = drizzle(sqlite);

export const workingMemory = sqliteTable("working_memory", {
  id: text("id").primaryKey(),
  scope: text("scope").notNull(),
  chatId: text("chat_id"),
  userId: text("user_id"),
  content: text("content").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const conversationMessages = sqliteTable("conversation_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: text("chat_id").notNull(),
  userId: text("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});

export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});
*/

// ============================================================================
// Example 4b: SQLite with Turso (Edge/Serverless)
// ============================================================================
/*
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

// Connect to Turso (or local file with "file:memory.db")
const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

const db = drizzle(client);

// Use same schema as local SQLite above
export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});
*/

// ============================================================================
// Example 5: Using with existing schema (recommended)
// ============================================================================
/*
// If you already have a Drizzle schema, just pass your tables:
import { db } from "./db";
import { myWorkingMemory, myMessages } from "./schema";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: myWorkingMemory,
  messagesTable: myMessages,
});
*/

// ============================================================================
// Example 6: Complete Agent Setup
// ============================================================================
/*
import { Agent } from "@ai-sdk-tools/agents";
import { openai } from "@ai-sdk/openai";
import { DrizzleProvider } from "@ai-sdk-tools/memory";
import { db, workingMemory, conversationMessages } from "./db";

const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: conversationMessages,
});

export const myAgent = new Agent({
  name: "assistant",
  model: openai("gpt-4o"),
  instructions: "You are a helpful assistant.",
  memory: {
    provider: memoryProvider,
    workingMemory: {
      enabled: true,
      scope: "chat", // or "user" for user-level memory
    },
    history: {
      enabled: true,
      limit: 50,
    },
  },
});
*/

// ============================================================================
// Migration Example: Create tables manually
// ============================================================================
/*
import { sql } from "drizzle-orm";
import { db } from "./db";

// PostgreSQL
await db.execute(sql`
  CREATE TABLE IF NOT EXISTS working_memory (
    id TEXT PRIMARY KEY,
    scope TEXT NOT NULL,
    chat_id TEXT,
    user_id TEXT,
    content TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS conversation_messages (
    id SERIAL PRIMARY KEY,
    chat_id TEXT NOT NULL,
    user_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_working_memory_scope 
    ON working_memory(scope, chat_id, user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_chat 
    ON conversation_messages(chat_id, timestamp DESC);
`);
*/

export {};
