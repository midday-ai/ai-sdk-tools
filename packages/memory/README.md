# @ai-sdk-tools/memory

Persistent memory system for AI agents with built-in providers for development and production.

## Features

- **Simple API** - Just 4 methods to implement
- **Built-in Providers** - InMemory, Drizzle ORM, and Upstash included
- **TypeScript-first** - Full type safety
- **Flexible Scopes** - Chat-level or user-level memory
- **Conversation History** - Optional message tracking
- **Database Agnostic** - Works with PostgreSQL, MySQL, and SQLite via Drizzle

## Installation

```bash
npm install @ai-sdk-tools/memory
# or
yarn add @ai-sdk-tools/memory
# or
pnpm add @ai-sdk-tools/memory
# or
bun add @ai-sdk-tools/memory
```

### Optional Dependencies

```bash
# For Drizzle ORM provider (PostgreSQL, MySQL, or SQLite)
npm install drizzle-orm

# For Upstash Redis provider
npm install @upstash/redis
```

## Quick Start

### InMemory Provider (Development)

Perfect for local development - works immediately, no setup needed.

```typescript
import { InMemoryProvider } from "@ai-sdk-tools/memory";

const memory = new InMemoryProvider();

// Use with agents
const context = buildAppContext({
  // ...
  memory: {
    provider: memory,
    workingMemory: {
      enabled: true,
      scope: "chat",
    },
  },
});
```

### Drizzle Provider (Production - Any SQL Database)

Works with PostgreSQL, MySQL, and SQLite via Drizzle ORM. Perfect if you already use Drizzle in your project.

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { DrizzleProvider } from "@ai-sdk-tools/memory";

// Define your schema
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
const memory = new DrizzleProvider(db, {
  workingMemoryTable: workingMemory,
  messagesTable: messages,
});
```

**[Full Drizzle documentation →](./DRIZZLE.md)** - Includes PostgreSQL, MySQL, SQLite/Turso examples

### Upstash Provider (Production - Serverless)

Perfect for edge and serverless environments.

```typescript
import { Redis } from "@upstash/redis";
import { UpstashProvider } from "@ai-sdk-tools/memory/upstash";

const redis = Redis.fromEnv();
const memory = new UpstashProvider(redis);
```

## Usage with Agents

```typescript
import { InMemoryProvider } from "@ai-sdk-tools/memory";

const appContext = buildAppContext({
  userId: "user-123",
  // ... other context
  metadata: {
    chatId: "chat_abc123",
    userId: "user-123",
  },
  memory: {
    provider: new InMemoryProvider(),
    workingMemory: {
      enabled: true,
      scope: "chat", // or 'user'
      template: `# Working Memory

## Key Facts
- [Important information]

## Preferences
- [User preferences]
`,
    },
    history: {
      enabled: true,
      limit: 10,
    },
  },
});

// Agent automatically:
// 1. Loads working memory into system prompt
// 2. Injects updateWorkingMemory tool
// 3. Captures conversation messages
```

## Memory Scopes

### Chat Scope (Recommended)

Memory is tied to a specific conversation.

```typescript
workingMemory: {
  enabled: true,
  scope: 'chat',
}
```

### User Scope

Memory persists across all conversations for a user.

```typescript
workingMemory: {
  enabled: true,
  scope: 'user',
}
```

## Custom Provider

Implement the `MemoryProvider` interface:

```typescript
import type {
  MemoryProvider,
  WorkingMemory,
  ConversationMessage,
  MemoryScope,
} from "@ai-sdk-tools/memory";

class MyProvider implements MemoryProvider {
  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    // Your implementation
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    // Your implementation
  }

  // Optional methods
  async saveMessage(message: ConversationMessage): Promise<void> {
    // Your implementation
  }

  async getMessages(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]> {
    // Your implementation
  }
}
```

## API Reference

### Types

#### `WorkingMemory`

```typescript
interface WorkingMemory {
  content: string;
  updatedAt: Date;
}
```

#### `MemoryScope`

```typescript
type MemoryScope = "chat" | "user";
```

#### `ConversationMessage`

```typescript
interface ConversationMessage {
  chatId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}
```

#### `MemoryProvider`

```typescript
interface MemoryProvider {
  getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null>;

  updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void>;

  saveMessage?(message: ConversationMessage): Promise<void>;

  getMessages?(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]>;
}
```

## License

MIT
