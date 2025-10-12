# Drizzle Provider for Memory

The Drizzle provider enables persistent memory storage using [Drizzle ORM](https://orm.drizzle.team/), supporting PostgreSQL, MySQL, and SQLite.

> **Note:** This provider replaces the previous LibSQL provider. Use Drizzle for SQLite/Turso/LibSQL databases.

## Features

- **Database Agnostic** - Works with PostgreSQL, MySQL, and SQLite
- **Type Safe** - Full TypeScript support
- **Flexible Schema** - Use your existing tables or create new ones
- **Edge Compatible** - Works with serverless/edge databases (Vercel Postgres, Neon, PlanetScale, Turso)

## Installation

```bash
npm install @ai-sdk-tools/memory drizzle-orm
# or
bun add @ai-sdk-tools/memory drizzle-orm
```

You'll also need a database driver:

```bash
# PostgreSQL
npm install @vercel/postgres
# or
npm install @neondatabase/serverless

# MySQL
npm install @planetscale/database

# SQLite
npm install better-sqlite3
```

## Quick Start

### PostgreSQL (Vercel Postgres)

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

// Define schema
const workingMemory = pgTable("working_memory", {
  id: text("id").primaryKey(),
  scope: text("scope").notNull(),
  chatId: text("chat_id"),
  userId: text("user_id"),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

const messages = pgTable("conversation_messages", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  userId: text("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

// Initialize
const db = drizzle(sql);
const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

### PostgreSQL (Neon)

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Use same schema as above
const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

### MySQL (PlanetScale)

```typescript
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const connection = connect({ url: process.env.DATABASE_URL });
const db = drizzle(connection);

const workingMemory = mysqlTable("working_memory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  scope: varchar("scope", { length: 50 }).notNull(),
  chatId: varchar("chat_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

const messages = mysqlTable("conversation_messages", {
  id: int("id").primaryKey().autoincrement(),
  chatId: varchar("chat_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

### SQLite (Local)

```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const sqlite = new Database("memory.db");
const db = drizzle(sqlite);

const workingMemory = sqliteTable("working_memory", {
  id: text("id").primaryKey(),
  scope: text("scope").notNull(),
  chatId: text("chat_id"),
  userId: text("user_id"),
  content: text("content").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

const messages = sqliteTable("conversation_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: text("chat_id").notNull(),
  userId: text("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});

const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

### SQLite with Turso (Edge/Serverless)

```typescript
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

// Connect to Turso
const client = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
});

const db = drizzle(client);

// Use same schema as local SQLite above
const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

## Using with Agents

```typescript
import { Agent } from "@ai-sdk-tools/agents";
import { openai } from "@ai-sdk/openai";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});

const agent = new Agent({
  name: "assistant",
  model: openai("gpt-4o"),
  instructions: "You are a helpful assistant with memory.",
  memory: {
    provider: memoryProvider,
    workingMemory: {
      enabled: true,
      scope: "chat", // Per-conversation memory
    },
    history: {
      enabled: true,
      limit: 50,
    },
  },
});
```

## Schema Requirements

Your tables must have the following columns:

### Working Memory Table

| Column      | Type                | Required | Description                    |
| ----------- | ------------------- | -------- | ------------------------------ |
| `id`        | text/varchar        | Yes      | Primary key                    |
| `scope`     | text/varchar        | Yes      | "chat" or "user"               |
| `chatId`    | text/varchar        | No       | Chat identifier (nullable)     |
| `userId`    | text/varchar        | No       | User identifier (nullable)     |
| `content`   | text                | Yes      | Memory content                 |
| `updatedAt` | timestamp/integer   | Yes      | Last update timestamp          |

### Messages Table

| Column      | Type               | Required | Description                    |
| ----------- | ------------------ | -------- | ------------------------------ |
| `id`        | serial/int/integer | Yes      | Primary key (auto-increment)   |
| `chatId`    | text/varchar       | Yes      | Chat identifier                |
| `userId`    | text/varchar       | No       | User identifier (nullable)     |
| `role`      | text/varchar       | Yes      | "user", "assistant", "system"  |
| `content`   | text               | Yes      | Message content                |
| `timestamp` | timestamp/integer  | Yes      | Message timestamp              |

## Using Existing Schema

If you already have Drizzle tables in your project, just pass them to the provider:

```typescript
import { db } from "./db";
import { myWorkingMemory, myMessages } from "./schema";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: myWorkingMemory,
  messagesTable: myMessages,
});
```

The provider will work as long as your tables have the required columns (they can have additional columns too).

## Database Migrations

### Using Drizzle Kit (Recommended)

```bash
npm install -D drizzle-kit
```

Create `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // or "mysql" or "sqlite"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Generate and run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Manual SQL

<details>
<summary>PostgreSQL</summary>

```sql
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
```

</details>

<details>
<summary>MySQL</summary>

```sql
CREATE TABLE IF NOT EXISTS working_memory (
  id VARCHAR(255) PRIMARY KEY,
  scope VARCHAR(50) NOT NULL,
  chat_id VARCHAR(255),
  user_id VARCHAR(255),
  content TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_working_memory_scope ON working_memory(scope, chat_id, user_id);
CREATE INDEX idx_messages_chat ON conversation_messages(chat_id, timestamp DESC);
```

</details>

<details>
<summary>SQLite</summary>

```sql
CREATE TABLE IF NOT EXISTS working_memory (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  chat_id TEXT,
  user_id TEXT,
  content TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT NOT NULL,
  user_id TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_working_memory_scope 
  ON working_memory(scope, chat_id, user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat 
  ON conversation_messages(chat_id, timestamp DESC);
```

</details>

## Common Use Cases

### Vercel AI SDK with Vercel Postgres

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { DrizzleProvider } from "@ai-sdk-tools/memory";
import { Agent } from "@ai-sdk-tools/agents";

const db = drizzle(sql);
const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});

const agent = new Agent({
  name: "assistant",
  // ... config
  memory: { provider: memoryProvider },
});
```

### Next.js with Neon

```typescript
// lib/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// lib/memory.ts
import { DrizzleProvider } from "@ai-sdk-tools/memory";
import { db } from "./db";
import { workingMemory, messages } from "./schema";

export const memoryProvider = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

## Troubleshooting

### Type Errors

Make sure your table definitions match the expected schema. The provider accepts any Drizzle table as long as it has the required columns.

### Connection Issues

Ensure your database URL is correct and the database is accessible:

```typescript
// Test connection
try {
  await db.select().from(workingMemory).limit(1);
  console.log("✅ Database connected");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}
```

### Missing Tables

The provider doesn't auto-create tables. Run migrations first:

```bash
npx drizzle-kit migrate
```

Or create tables manually using the SQL scripts above.

## API Reference

### `DrizzleProvider`

```typescript
class DrizzleProvider<TWM, TMsg> implements MemoryProvider {
  constructor(
    db: any, // Drizzle database instance
    config: {
      workingMemoryTable: TWM;
      messagesTable: TMsg;
    },
  );
}
```

### Methods

- `getWorkingMemory(params)` - Retrieve working memory
- `updateWorkingMemory(params)` - Update working memory
- `saveMessage(message)` - Save a conversation message
- `getMessages(params)` - Retrieve conversation messages

See the [main README](./README.md) for full API documentation.

## Comparison with Other Providers

| Feature            | Drizzle | Upstash |
| ------------------ | ------- | ------- |
| Type Safety        | ✅      | ✅      |
| PostgreSQL         | ✅      | ❌      |
| MySQL              | ✅      | ❌      |
| SQLite/Turso       | ✅      | ❌      |
| Redis              | ❌      | ✅      |
| Edge Compatible    | ✅      | ✅      |
| ORM Integration    | ✅      | ❌      |
| Existing Schema    | ✅      | ❌      |
| Multi-Database     | ✅      | ❌      |

**Choose Drizzle if:**
- You already use Drizzle in your project
- You need PostgreSQL, MySQL, or SQLite support
- You want to reuse existing database tables
- You prefer type-safe ORM queries
- You use Turso for edge SQLite

**Choose Upstash if:**
- You want Redis for caching/sessions
- You need ultra-low latency at edge
- You don't need relational queries
- You prefer key-value storage

## Examples

See [examples/drizzle-example.ts](./src/examples/drizzle-example.ts) for complete working examples with all supported databases.

## License

MIT

