import { createLogger } from "@ai-sdk-tools/debug";
import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  UIMessage,
  WorkingMemory,
} from "../types.js";

const logger = createLogger("REDIS");

/**
 * ioredis client interface
 */
interface IORedisClient {
  get(key: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<string>;
  rpush(key: string, ...values: string[]): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<string>;
  expire(key: string, seconds: number): Promise<number>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  hset(key: string, data: Record<string, unknown>): Promise<number>;
  hgetall(key: string): Promise<Record<string, string> | null>;
  zadd(
    key: string,
    ...args: Array<{ score: number; member: string }>
  ): Promise<number>;
  zrange(key: string, start: number, stop: number): Promise<string[]>;
  keys(pattern: string): Promise<string[]>;
  del(key: string): Promise<number>;
  zrem(key: string, member: string): Promise<number>;
}

/**
 * redis package (v4+) client interface
 */
interface RedisPackageClient {
  get(key: string): Promise<string | null>;
  setEx(key: string, seconds: number, value: string): Promise<string>;
  rPush(key: string, ...values: string[]): Promise<number>;
  lTrim(key: string, start: number, stop: number): Promise<string>;
  expire(key: string, seconds: number): Promise<number>;
  lRange(key: string, start: number, stop: number): Promise<string[]>;
  hSet(key: string, data: Record<string, unknown>): Promise<number>;
  hGetAll(key: string): Promise<Record<string, string> | null>;
  zAdd(
    key: string,
    ...args: Array<{ score: number; value: string }>
  ): Promise<number>;
  zRange(key: string, start: number, stop: number): Promise<string[]>;
  keys(pattern: string): Promise<string[]>;
  del(key: string): Promise<number>;
  zRem(key: string, member: string): Promise<number>;
}

/**
 * Supported Redis client types (ioredis or redis package)
 */
type RedisClient = IORedisClient | RedisPackageClient;

/**
 * Configuration options for RedisProvider
 */
export interface RedisProviderOptions {
  /** Key prefix for all Redis keys (default: "memory:") */
  prefix?: string;
  /** TTL in seconds for message lists (default: no expiration) */
  messageTtl?: number;
}

/**
 * Redis provider - standard Redis client (ioredis or redis package)
 *
 * Supports both `ioredis` and `redis` npm packages for traditional Redis instances.
 * Use this provider when you have a self-hosted Redis server or Redis Cloud instance.
 *
 * @example With ioredis
 * ```typescript
 * import Redis from "ioredis";
 * import { RedisProvider } from "@ai-sdk-tools/memory/redis";
 *
 * const redis = new Redis(process.env.REDIS_URL);
 * const memory = new RedisProvider(redis);
 * ```
 *
 * @example With redis package and custom options
 * ```typescript
 * import { createClient } from "redis";
 * import { RedisProvider } from "@ai-sdk-tools/memory/redis";
 *
 * const redis = createClient({ url: process.env.REDIS_URL });
 * await redis.connect();
 * const memory = new RedisProvider(redis, {
 *   prefix: "my-app:memory:",
 *   messageTtl: 60 * 60 * 24 * 30, // 30 days (optional, default: no expiration)
 * });
 * ```
 */
export class RedisProvider implements MemoryProvider {
  private readonly isRedisPackage: boolean;
  private readonly ioredis: IORedisClient | null;
  private readonly redisPkg: RedisPackageClient | null;
  private readonly messageTtl?: number;
  private readonly prefix: string;

  constructor(redis: RedisClient, options?: RedisProviderOptions) {
    this.prefix = options?.prefix ?? "memory:";
    this.messageTtl = options?.messageTtl;
    // Detect which package is being used by checking for camelCase methods
    // redis package uses camelCase (setEx, rPush, etc.)
    // ioredis uses lowercase (setex, rpush, etc.)
    this.isRedisPackage =
      "setEx" in redis || "rPush" in redis || "hSet" in redis;

    // Store typed references for better type safety
    if (this.isRedisPackage) {
      this.redisPkg = redis as RedisPackageClient;
      this.ioredis = null;
    } else {
      this.ioredis = redis as IORedisClient;
      this.redisPkg = null;
    }
  }

  // Typed wrapper methods to avoid 'as any' casts
  private async setex(
    key: string,
    seconds: number,
    value: string,
  ): Promise<string> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.setEx(key, seconds, value);
    }
    if (this.ioredis) {
      return this.ioredis.setex(key, seconds, value);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async rpush(key: string, ...values: string[]): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.rPush(key, ...values);
    }
    if (this.ioredis) {
      return this.ioredis.rpush(key, ...values);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async ltrim(
    key: string,
    start: number,
    stop: number,
  ): Promise<string> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.lTrim(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.ltrim(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async lrange(
    key: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.lRange(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.lrange(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async hset(
    key: string,
    data: Record<string, unknown>,
  ): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.hSet(key, data);
    }
    if (this.ioredis) {
      return this.ioredis.hset(key, data);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async hgetall(key: string): Promise<Record<string, string> | null> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.hGetAll(key);
    }
    if (this.ioredis) {
      return this.ioredis.hgetall(key);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async zadd(
    key: string,
    score: number,
    member: string,
  ): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zAdd(key, { score, value: member });
    }
    if (this.ioredis) {
      return this.ioredis.zadd(key, { score, member });
    }
    throw new Error("Redis client not properly initialized");
  }

  private async zrange(
    key: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zRange(key, start, stop);
    }
    if (this.ioredis) {
      return this.ioredis.zrange(key, start, stop);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async get(key: string): Promise<string | null> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.get(key);
    }
    if (this.ioredis) {
      return this.ioredis.get(key);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async expire(key: string, seconds: number): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.expire(key, seconds);
    }
    if (this.ioredis) {
      return this.ioredis.expire(key, seconds);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async keys(pattern: string): Promise<string[]> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.keys(pattern);
    }
    if (this.ioredis) {
      return this.ioredis.keys(pattern);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async del(key: string): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.del(key);
    }
    if (this.ioredis) {
      return this.ioredis.del(key);
    }
    throw new Error("Redis client not properly initialized");
  }

  private async zrem(key: string, member: string): Promise<number> {
    if (this.isRedisPackage && this.redisPkg) {
      return this.redisPkg.zRem(key, member);
    }
    if (this.ioredis) {
      return this.ioredis.zrem(key, member);
    }
    throw new Error("Redis client not properly initialized");
  }

  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const key = this.getKey("wm", params.scope, params.chatId, params.userId);
    const value = await this.get(key);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value) as WorkingMemory;
      // Convert updatedAt timestamp to Date
      return {
        ...parsed,
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (error) {
      logger.error("Failed to parse working memory", { key, error });
      return null;
    }
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
    const value = JSON.stringify(memory);

    await this.setex(key, ttl, value);

    logger.debug("updateWorkingMemory complete", { key });
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const key = this.getKey("msg", "chat", message.chatId);
    logger.debug(`saveMessage: chatId=${message.chatId}`, {
      chatId: message.chatId,
      role: message.role,
      key,
    });

    // Serialize message to JSON string
    const serialized = JSON.stringify({
      ...message,
      timestamp: message.timestamp.getTime(),
    });

    await this.rpush(key, serialized);
    await this.ltrim(key, -100, -1); // Keep last 100

    // Only set TTL if configured
    if (this.messageTtl !== undefined) {
      await this.expire(key, this.messageTtl);
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

    const rawMessages = await this.lrange(key, start, -1);

    logger.debug(`getMessages for ${params.chatId}`, {
      chatId: params.chatId,
      key,
      start,
      found: rawMessages?.length || 0,
    });

    if (!rawMessages || rawMessages.length === 0) return [];

    // Parse each message from JSON and extract content field
    const messages: T[] = [];
    for (const raw of rawMessages) {
      try {
        const parsed = JSON.parse(raw);
        const message: ConversationMessage = {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        };

        // Filter by userId if provided
        if (params.userId) {
          if (message.userId && message.userId !== params.userId) {
            continue; // Skip messages that don't match userId
          }
        }

        // Always attempt to parse content as JSON
        let content: string | unknown = message.content;
        try {
          if (typeof message.content === "string") {
            const parsedContent = JSON.parse(message.content);
            content = parsedContent; // Replace content with parsed value
          }
        } catch {
          // If parsing fails, keep original content
        }

        // Return the content field directly (UIMessage format)
        messages.push(content as T);
      } catch (error) {
        logger.error("Failed to parse message", { error, raw });
      }
    }

    if (messages.length > 0) {
      logger.debug(`Messages retrieved`, {
        count: messages.length,
      });
    }

    return messages;
  }

  async saveChat(chat: ChatSession): Promise<void> {
    const chatKey = `${this.prefix}chat:${chat.chatId}`;

    // Get existing chat to preserve title if it exists
    const existing = await this.hgetall(chatKey);

    // Convert Dates to timestamps for Redis storage
    const chatData: Record<string, string> = {
      chatId: chat.chatId,
      userId: chat.userId || "",
      // Preserve existing title if new chat doesn't have one
      title: chat.title || existing?.title || "",
      createdAt: chat.createdAt.getTime().toString(),
      updatedAt: chat.updatedAt.getTime().toString(),
      messageCount: chat.messageCount.toString(),
    };

    // Remove empty string values
    Object.keys(chatData).forEach((key) => {
      if (chatData[key] === "") {
        delete chatData[key];
      }
    });

    await this.hset(chatKey, chatData);
    await this.expire(chatKey, 60 * 60 * 24 * 30); // 30 days

    // Add to global sorted set (for efficient sorting/limiting when no userId)
    const globalChatsKey = `${this.prefix}chats:global`;
    const score = chat.updatedAt.getTime();
    await this.zadd(globalChatsKey, score, chat.chatId);
    await this.expire(globalChatsKey, 60 * 60 * 24 * 30); // 30 days

    // If userId exists, add to user's chats sorted set
    if (chat.userId) {
      const userChatsKey = `${this.prefix}chats:${chat.userId}`;
      await this.zadd(userChatsKey, score, chat.chatId);
      await this.expire(userChatsKey, 60 * 60 * 24 * 30); // 30 days
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
      const chatIds = await this.zrange(userChatsKey, 0, endIndex);

      if (chatIds.length === 0) return [];

      // Fetch all chats in parallel
      const userChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.hgetall(chatKey);
          if (!data || Object.keys(data).length === 0) return null;
          // Convert timestamps back to Dates
          return {
            ...data,
            chatId: data.chatId || chatId,
            userId: data.userId || undefined,
            title: data.title || undefined,
            createdAt: new Date(parseInt(data.createdAt, 10)),
            updatedAt: new Date(parseInt(data.updatedAt, 10)),
            messageCount: parseInt(data.messageCount || "0", 10),
          } as ChatSession;
        }),
      );

      chats = userChats.filter(
        (chat: ChatSession | null): chat is ChatSession => chat !== null,
      );

      // Reverse to get most recent first (sorted sets store by score = updatedAt)
      chats.reverse();
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
      const chatIds = await this.zrange(globalChatsKey, 0, endIndex);

      if (chatIds.length === 0) return [];

      // Reverse to get most recent first (sorted sets store by score = updatedAt)
      chatIds.reverse();

      // Fetch all chats in parallel
      const allChats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.hgetall(chatKey);
          if (!data || Object.keys(data).length === 0) return null;
          // Convert timestamps back to Dates
          return {
            ...data,
            chatId: data.chatId || chatId,
            userId: data.userId || undefined,
            title: data.title || undefined,
            createdAt: new Date(parseInt(data.createdAt, 10)),
            updatedAt: new Date(parseInt(data.updatedAt, 10)),
            messageCount: parseInt(data.messageCount || "0", 10),
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
    const data = await this.hgetall(chatKey);
    if (!data || Object.keys(data).length === 0) return null;
    // Convert timestamps back to Dates
    return {
      ...data,
      chatId: data.chatId || chatId,
      userId: data.userId || undefined,
      title: data.title || undefined,
      createdAt: new Date(parseInt(data.createdAt, 10)),
      updatedAt: new Date(parseInt(data.updatedAt, 10)),
      messageCount: parseInt(data.messageCount || "0", 10),
    } as ChatSession;
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.hgetall(chatKey);

    const updatedAt = Date.now();

    if (data && Object.keys(data).length > 0) {
      // Chat exists, update it
      const chatData: Record<string, string> = {
        ...data,
        title,
        updatedAt: updatedAt.toString(),
      };

      await this.hset(chatKey, chatData);

      // Update score in global sorted set
      const globalChatsKey = `${this.prefix}chats:global`;
      await this.zadd(globalChatsKey, updatedAt, chatId);

      // Update score in user's sorted set if userId exists
      if (data.userId) {
        const userChatsKey = `${this.prefix}chats:${data.userId}`;
        await this.zadd(userChatsKey, updatedAt, chatId);
      }
    } else {
      // Chat doesn't exist yet, create it with the title
      // This can happen if title generation completes before the chat is saved
      const now = Date.now();
      const chatData: ChatSession = {
        chatId,
        title,
        createdAt: new Date(now),
        updatedAt: new Date(updatedAt),
        messageCount: 0,
      };
      await this.saveChat(chatData);
      return; // saveChat already handles sorted sets, so we can return early
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const messageKey = this.getKey("msg", "chat", chatId);

    // Get chat data to find userId before deleting
    const chatData = await this.hgetall(chatKey);
    const userId = chatData?.userId;

    // Delete chat
    await this.del(chatKey);

    // Delete messages
    await this.del(messageKey);

    // Remove from global sorted set
    const globalChatsKey = `${this.prefix}chats:global`;
    await this.zrem(globalChatsKey, chatId);

    // Remove from user's sorted set if userId exists
    if (userId) {
      const userChatsKey = `${this.prefix}chats:${userId}`;
      await this.zrem(userChatsKey, chatId);
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
