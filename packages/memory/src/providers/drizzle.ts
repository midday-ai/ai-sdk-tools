import { and, desc, eq, like, or } from "drizzle-orm";
import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  UIMessage,
  WorkingMemory,
} from "../types.js";

/**
 * Generic Drizzle table interface for working memory
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
export interface WorkingMemoryTable {
  id: any;
  scope: any;
  chatId: any;
  userId: any;
  content: any;
  updatedAt: any;
}

/**
 * Generic Drizzle table interface for conversation messages
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
export interface ConversationMessagesTable {
  id: any;
  chatId: any;
  userId: any;
  role: any;
  content: any;
  timestamp: any;
}

/**
 * Generic Drizzle table interface for chat sessions
 *
 * Uses `any` for column types to support all Drizzle table definitions across
 * PostgreSQL, MySQL, and SQLite. This is intentional and necessary for maximum
 * flexibility with different database schemas and Drizzle adapters.
 */
export interface ChatsTable {
  chatId: any;
  userId: any;
  title: any;
  createdAt: any;
  updatedAt: any;
  messageCount: any;
}

/**
 * Configuration for Drizzle provider
 */
export interface DrizzleProviderConfig<
  TWM extends WorkingMemoryTable,
  TMsg extends ConversationMessagesTable,
  TChat extends ChatsTable = ChatsTable,
> {
  /** Working memory table */
  workingMemoryTable: TWM;
  /** Conversation messages table */
  messagesTable: TMsg;
  /** Chat sessions table (optional) */
  chatsTable?: TChat;
}

/**
 * Drizzle ORM provider - works with PostgreSQL, MySQL, and SQLite
 *
 * @example
 * ```ts
 * import { drizzle } from 'drizzle-orm/postgres-js';
 * import { createWorkingMemoryTable, createMessagesTable } from '@ai-sdk-tools/memory';
 *
 * const db = drizzle(client);
 * const provider = new DrizzleProvider(db, {
 *   workingMemoryTable: createWorkingMemoryTable('working_memory'),
 *   messagesTable: createMessagesTable('conversation_messages')
 * });
 * ```
 */
export class DrizzleProvider<
  TWM extends WorkingMemoryTable,
  TMsg extends ConversationMessagesTable,
  TChat extends ChatsTable = ChatsTable,
> implements MemoryProvider
{
  constructor(
    // Accepts any Drizzle database instance (postgres, mysql, sqlite adapters all have different types)
    private db: any,
    private config: DrizzleProviderConfig<TWM, TMsg, TChat>,
  ) {}

  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const id = this.getId(params.scope, params.chatId, params.userId);
    const { workingMemoryTable } = this.config;

    const result = await this.db
      .select()
      .from(workingMemoryTable)
      .where(eq(workingMemoryTable.id, id))
      .limit(1);

    if (!result.length) return null;

    const row = result[0];
    return {
      content: row.content,
      updatedAt: new Date(row.updatedAt),
    };
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    const id = this.getId(params.scope, params.chatId, params.userId);
    const { workingMemoryTable } = this.config;

    const now = new Date();

    // Try to update first
    const existing = await this.db
      .select()
      .from(workingMemoryTable)
      .where(eq(workingMemoryTable.id, id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await this.db
        .update(workingMemoryTable)
        .set({
          content: params.content,
          updatedAt: now,
        })
        .where(eq(workingMemoryTable.id, id));
    } else {
      // Insert new
      await this.db.insert(workingMemoryTable).values({
        id,
        scope: params.scope,
        chatId: params.chatId || null,
        userId: params.userId || null,
        content: params.content,
        updatedAt: now,
      });
    }
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const { messagesTable } = this.config;

    await this.db.insert(messagesTable).values({
      chatId: message.chatId,
      userId: message.userId || null,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    });
  }

  async getMessages<T = UIMessage>(params: {
    chatId: string;
    userId?: string;
    limit?: number;
  }): Promise<T[]> {
    const { messagesTable } = this.config;

    // Build WHERE conditions
    const whereConditions: ReturnType<typeof eq>[] = [
      eq(messagesTable.chatId, params.chatId),
    ];

    // Filter by userId if provided
    // Include messages where userId matches OR userId is null (legacy messages)
    if (params.userId) {
      whereConditions.push(
        or(
          eq(messagesTable.userId, params.userId),
          eq(messagesTable.userId, null),
        )!,
      );
    }

    const whereCondition =
      whereConditions.length === 1
        ? whereConditions[0]
        : and(...whereConditions);

    const result = await this.db
      .select()
      .from(messagesTable)
      .where(whereCondition)
      .orderBy(desc(messagesTable.timestamp))
      .limit(params.limit || 100);

    return (
      result
        // Drizzle query results have dynamic types based on table schema
        .map((row: any) => {
          let content: string | unknown = row.content;

          // Always attempt to parse content as JSON
          try {
            if (typeof row.content === "string") {
              const parsed = JSON.parse(row.content);
              content = parsed; // Replace content with parsed value
            }
          } catch {
            // If parsing fails, keep original content
          }

          // Return the content field directly (UIMessage format)
          return content as T;
        })
        .reverse()
    );
  }

  async saveChat(chat: ChatSession): Promise<void> {
    const { chatsTable } = this.config;
    if (!chatsTable) return;

    // Check if chat exists
    const existing = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.chatId, chat.chatId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing - preserve title if new chat doesn't have one
      await this.db
        .update(chatsTable)
        .set({
          userId: chat.userId || null,
          title: chat.title || existing[0].title || null,
          updatedAt: chat.updatedAt,
          messageCount: chat.messageCount,
        })
        .where(eq(chatsTable.chatId, chat.chatId));
    } else {
      // Insert new
      await this.db.insert(chatsTable).values({
        chatId: chat.chatId,
        userId: chat.userId || null,
        title: chat.title || null,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat.messageCount,
      });
    }
  }

  async getChats(params: {
    userId?: string;
    search?: string;
    limit?: number;
  }): Promise<ChatSession[]> {
    const { chatsTable } = this.config;
    if (!chatsTable) return [];

    // Build WHERE conditions
    const conditions = [];

    if (params.userId) {
      conditions.push(eq(chatsTable.userId, params.userId));
    }

    if (params.search) {
      // Use LIKE for case-insensitive search
      // For MySQL/SQLite, we'll handle case-insensitivity in the filter
      conditions.push(like(chatsTable.title, `%${params.search}%`));
    }

    let query = this.db.select().from(chatsTable);

    if (conditions.length > 0) {
      const whereCondition =
        conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
    }

    // Order by updatedAt descending (most recent first)
    query = query.orderBy(desc(chatsTable.updatedAt));

    // Apply limit at database level (most efficient)
    if (params.limit) {
      query = query.limit(params.limit);
    }

    const result = await query;

    let chats = result.map((row: any) => ({
      chatId: row.chatId,
      userId: row.userId || undefined,
      title: row.title || undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      messageCount: row.messageCount,
    }));

    // For MySQL/SQLite, apply case-insensitive filter if search was used
    // (PostgreSQL ILIKE handles it, but LIKE doesn't)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      chats = chats.filter((chat: ChatSession) =>
        chat.title?.toLowerCase().includes(searchLower),
      );
    }

    return chats;
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    const { chatsTable } = this.config;
    if (!chatsTable) return null;

    const result = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.chatId, chatId))
      .limit(1);

    if (!result.length) return null;

    const row = result[0];
    return {
      chatId: row.chatId,
      userId: row.userId || undefined,
      title: row.title || undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      messageCount: row.messageCount,
    };
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const { chatsTable } = this.config;
    if (!chatsTable) return;

    // Check if chat exists
    const existing = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.chatId, chatId))
      .limit(1);

    if (existing.length > 0) {
      // Chat exists, update it
      await this.db
        .update(chatsTable)
        .set({
          title,
          updatedAt: new Date(),
        })
        .where(eq(chatsTable.chatId, chatId));
    } else {
      // Chat doesn't exist yet, create it with the title
      // This can happen if title generation completes before the chat is saved
      await this.saveChat({
        chatId,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
      });
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    const { chatsTable, messagesTable } = this.config;

    // Delete messages first (if messagesTable exists)
    if (messagesTable) {
      await this.db
        .delete(messagesTable)
        .where(eq(messagesTable.chatId, chatId));
    }

    // Delete chat (if chatsTable exists)
    if (chatsTable) {
      await this.db.delete(chatsTable).where(eq(chatsTable.chatId, chatId));
    }
  }

  private getId(scope: MemoryScope, chatId?: string, userId?: string): string {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
}

// Re-export schema helpers under drizzle subpath
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
} from "./drizzle-schema.js";
