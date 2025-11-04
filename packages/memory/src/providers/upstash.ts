import { createLogger } from "@ai-sdk-tools/debug";
import type { Redis } from "@upstash/redis";
import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  UIMessage,
  WorkingMemory,
} from "../types.js";

const logger = createLogger("UPSTASH");

/**
 * Configuration options for UpstashProvider
 */
export interface UpstashProviderOptions {
  /** Key prefix for all Redis keys (default: "memory:") */
  prefix?: string;
  /** TTL in seconds for message lists (default: no expiration) */
  messageTtl?: number;
}

/**
 * Upstash Redis provider - serverless edge
 */
export class UpstashProvider implements MemoryProvider {
  private readonly messageTtl?: number;
  private readonly prefix: string;

  constructor(
    private redis: Redis,
    options?: UpstashProviderOptions,
  ) {
    this.prefix = options?.prefix ?? "memory:";
    this.messageTtl = options?.messageTtl;
  }

  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    return await this.redis.get<WorkingMemory>(key);
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    logger.debug("updateWorkingMemory called", {
      key,
      scope: params.scope,
      chatId: params.chatId,
      userId: params.userId,
      contentLength: params.content.length,
    });

    const memory: WorkingMemory = {
      content: params.content,
      updatedAt: new Date(),
    };

    // TTL: 30 days for user, 24h for chat
    const ttl = params.scope === "user" ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    await this.redis.setex(key, ttl, memory);
    logger.debug("updateWorkingMemory complete", { key });
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const key = this.getKey("msg", "chat", message.chatId);
    logger.debug(`saveMessage: chatId=${message.chatId}`, {
      chatId: message.chatId,
      role: message.role,
      key,
    });
    await this.redis.rpush(key, message);
    await this.redis.ltrim(key, -100, -1); // Keep last 100

    // Only set TTL if configured
    if (this.messageTtl !== undefined) {
      await this.redis.expire(key, this.messageTtl);
    }

    logger.debug(`saveMessage complete for ${message.chatId}`, {
      chatId: message.chatId,
    });
  }

  async getMessages<T = UIMessage>(params: {
    chatId: string;
    userId?: string;
    limit?: number;
  }): Promise<T[]> {
    const key = this.getKey("msg", "chat", params.chatId);
    const start = params.limit ? -params.limit : 0;
    const messages = await this.redis.lrange<ConversationMessage>(
      key,
      start,
      -1,
    );

    // Debug: Check what we actually retrieved
    logger.debug(`getMessages for ${params.chatId}`, {
      chatId: params.chatId,
      key,
      start,
      found: messages?.length || 0,
    });

    if (!messages || messages.length === 0) return [];

    // Filter by userId if provided and parse content, then extract content field
    const filtered = messages
      .filter((msg) => {
        // Filter by userId if provided
        if (params.userId) {
          return !msg.userId || msg.userId === params.userId;
        }
        return true;
      })
      .map((msg) => {
        // Always attempt to parse content as JSON
        let content: string | unknown = msg.content;
        try {
          if (typeof msg.content === "string") {
            const parsed = JSON.parse(msg.content);
            content = parsed; // Replace content with parsed value
          }
        } catch {
          // If parsing fails, keep original content
        }
        // Return the content field directly (UIMessage format)
        return content as T;
      });

    if (filtered.length > 0) {
      logger.debug(`Messages retrieved`, {
        count: filtered.length,
      });
    }

    return filtered;
  }

  async saveChat(chat: ChatSession): Promise<void> {
    const chatKey = `${this.prefix}chat:${chat.chatId}`;
    // Convert Dates to timestamps for Redis storage
    const chatData = {
      ...chat,
      createdAt: chat.createdAt.getTime(),
      updatedAt: chat.updatedAt.getTime(),
    };
    await this.redis.hset(chatKey, chatData);
    await this.redis.expire(chatKey, 60 * 60 * 24 * 30); // 30 days

    // Add to global sorted set (for efficient sorting/limiting when no userId)
    const globalChatsKey = `${this.prefix}chats:global`;
    const score = chat.updatedAt.getTime();
    await this.redis.zadd(globalChatsKey, { score, member: chat.chatId });
    await this.redis.expire(globalChatsKey, 60 * 60 * 24 * 30); // 30 days

    // If userId exists, add to user's chats sorted set
    if (chat.userId) {
      const userChatsKey = `${this.prefix}chats:${chat.userId}`;
      await this.redis.zadd(userChatsKey, { score, member: chat.chatId });
      await this.redis.expire(userChatsKey, 60 * 60 * 24 * 30); // 30 days
    }
  }

  async getChats(params: {
    userId?: string;
    search?: string;
    limit?: number;
  }): Promise<ChatSession[]> {
    let chats: ChatSession[] = [];

    if (params.userId) {
      // Get chats for specific user from sorted set (already sorted by updatedAt desc)
      const userChatsKey = `${this.prefix}chats:${params.userId}`;
      // Use limit to fetch most recent chats first (reduce data fetching)
      // If search is needed, we may need to fetch more to find enough matches
      const fetchLimit = params.search ? undefined : params.limit;
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.redis.zrange(userChatsKey, 0, endIndex, {
        rev: true, // Most recent first (highest score = most recent)
      });

      if (chatIds.length === 0) return [];

      // Fetch all chats in parallel
      const userChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data =
            await this.redis.hgetall<Record<string, unknown>>(chatKey);
          if (!data) return null;
          // Convert timestamps back to Dates
          return {
            ...data,
            createdAt: new Date(data.createdAt as number),
            updatedAt: new Date(data.updatedAt as number),
          } as ChatSession;
        }),
      );

      chats = userChats.filter((chat): chat is ChatSession => chat !== null);
    } else {
      // Use global sorted set for efficient sorting and limiting
      const globalChatsKey = `${this.prefix}chats:global`;
      // Fetch chat IDs from global sorted set (most recent first)
      // If search is needed, fetch more to find matches (fetch 3x limit if limit provided)
      const fetchLimit =
        params.search && params.limit
          ? params.limit * 3 // Fetch more to account for filtering
          : params.search
            ? undefined // No limit, fetch all for search
            : params.limit; // No search, use exact limit
      const endIndex = fetchLimit ? fetchLimit - 1 : -1;
      const chatIds = await this.redis.zrange(globalChatsKey, 0, endIndex, {
        rev: true, // Most recent first (highest score = most recent)
      });

      if (chatIds.length === 0) return [];

      // Fetch all chats in parallel
      const allChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data =
            await this.redis.hgetall<Record<string, unknown>>(chatKey);
          if (!data) return null;
          // Convert timestamps back to Dates
          return {
            ...data,
            createdAt: new Date(data.createdAt as number),
            updatedAt: new Date(data.updatedAt as number),
          } as ChatSession;
        }),
      );

      chats = allChats.filter((chat): chat is ChatSession => chat !== null);
    }

    // Filter by search term (title) if provided
    // Note: Redis doesn't support searching hash field values natively.
    // For database-level search, consider using RediSearch module or Drizzle provider.
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      chats = chats.filter((chat) =>
        chat.title?.toLowerCase().includes(searchLower),
      );
    }

    // Apply limit after filtering (to ensure we respect limit even with search)
    if (params.limit) {
      chats = chats.slice(0, params.limit);
    }

    return chats;
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall<Record<string, unknown>>(chatKey);
    if (!data) return null;
    // Convert timestamps back to Dates
    return {
      ...data,
      createdAt: new Date(data.createdAt as number),
      updatedAt: new Date(data.updatedAt as number),
    } as ChatSession;
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall<Record<string, unknown>>(chatKey);

    if (data) {
      const updatedAt = Date.now();
      const chatData = {
        ...data,
        title,
        updatedAt,
      };
      await this.redis.hset(chatKey, chatData);

      // Update score in global sorted set
      const globalChatsKey = `${this.prefix}chats:global`;
      await this.redis.zadd(globalChatsKey, {
        score: updatedAt,
        member: chatId,
      });

      // Update score in user's sorted set if userId exists
      if (data.userId) {
        const userChatsKey = `${this.prefix}chats:${data.userId as string}`;
        await this.redis.zadd(userChatsKey, {
          score: updatedAt,
          member: chatId,
        });
      }
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const messageKey = this.getKey("msg", "chat", chatId);

    // Get chat data to find userId before deleting
    const chatData = await this.redis.hgetall<Record<string, unknown>>(chatKey);
    const userId = chatData?.userId as string | undefined;

    // Delete chat
    await this.redis.del(chatKey);

    // Delete messages
    await this.redis.del(messageKey);

    // Remove from global sorted set
    const globalChatsKey = `${this.prefix}chats:global`;
    await this.redis.zrem(globalChatsKey, chatId);

    // Remove from user's sorted set if userId exists
    if (userId) {
      const userChatsKey = `${this.prefix}chats:${userId}`;
      await this.redis.zrem(userChatsKey, chatId);
    }

    logger.debug(`Deleted chat ${chatId}`, { chatId, userId });
  }

  private getKey(
    type: "wm" | "msg",
    scope: MemoryScope | "chat",
    chatId?: string,
    userId?: string,
  ): string {
    const id = scope === "chat" ? chatId : userId;
    return `${this.prefix}${type}:${scope}:${id}`;
  }
}
