import type { Redis } from "@upstash/redis";
import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  WorkingMemory,
} from "../types.js";

/**
 * Upstash Redis provider - serverless edge
 */
export class UpstashProvider implements MemoryProvider {
  constructor(private redis: Redis, private prefix: string = "memory:") {}

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
    const memory: WorkingMemory = {
      content: params.content,
      updatedAt: new Date(),
    };

    // TTL: 30 days for user, 24h for chat
    const ttl = params.scope === "user" ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    await this.redis.setex(key, ttl, memory);
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const key = this.getKey("msg", "chat", message.chatId);
    await this.redis.rpush(key, message);
    await this.redis.ltrim(key, -100, -1); // Keep last 100
    await this.redis.expire(key, 60 * 60 * 24 * 7); // 7 days
  }

  async getMessages(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]> {
    const key = this.getKey("msg", "chat", params.chatId);
    const start = params.limit ? -params.limit : 0;
    const messages = await this.redis.lrange<ConversationMessage>(
      key,
      start,
      -1
    );
    return messages || [];
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

    // If userId exists, add to user's chats sorted set
    if (chat.userId) {
      const userChatsKey = `${this.prefix}chats:${chat.userId}`;
      const score = chat.updatedAt.getTime();
      await this.redis.zadd(userChatsKey, { score, member: chat.chatId });
      await this.redis.expire(userChatsKey, 60 * 60 * 24 * 30); // 30 days
    }
  }

  async getChats(userId?: string): Promise<ChatSession[]> {
    if (userId) {
      // Get chats for specific user from sorted set
      const userChatsKey = `${this.prefix}chats:${userId}`;
      const chatIds = await this.redis.zrange(userChatsKey, 0, -1);

      if (chatIds.length === 0) return [];

      // Fetch all chats in parallel
      const chats = await Promise.all(
        chatIds.map(async (chatId) => {
          const chatKey = `${this.prefix}chat:${chatId}`;
          const data = await this.redis.hgetall<Record<string, any>>(chatKey);
          if (!data) return null;
          // Convert timestamps back to Dates
          return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          } as ChatSession;
        })
      );

      return chats.filter((chat): chat is ChatSession => chat !== null);
    }

    // Return all chats - scan for all chat keys
    const pattern = `${this.prefix}chat:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length === 0) return [];

    const chats = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redis.hgetall<Record<string, any>>(key);
        if (!data) return null;
        // Convert timestamps back to Dates
        return {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } as ChatSession;
      })
    );

    return chats.filter((chat): chat is ChatSession => chat !== null);
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall<Record<string, any>>(chatKey);
    if (!data) return null;
    // Convert timestamps back to Dates
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as ChatSession;
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chatKey = `${this.prefix}chat:${chatId}`;
    const data = await this.redis.hgetall<Record<string, any>>(chatKey);

    if (data) {
      const updatedAt = Date.now();
      const chatData = {
        ...data,
        title,
        updatedAt,
      };
      await this.redis.hset(chatKey, chatData);

      // Update score in user's sorted set if userId exists
      if (data.userId) {
        const userChatsKey = `${this.prefix}chats:${data.userId}`;
        await this.redis.zadd(userChatsKey, {
          score: updatedAt,
          member: chatId,
        });
      }
    }
  }

  async searchMessages(params: {
    chatId?: string;
    userId?: string;
    query: string;
    limit?: number;
  }): Promise<ConversationMessage[]> {
    // For Upstash Redis, we'll fetch messages and filter in memory
    // More advanced implementations could use Redisearch
    if (!params.chatId) {
      throw new Error("chatId is required for searching messages");
    }

    const messages = await this.getMessages({
      chatId: params.chatId,
      limit: params.limit || 100,
    });

    // Filter messages that contain the query
    const filtered = messages.filter((message) =>
      message.content.toLowerCase().includes(params.query.toLowerCase())
    );

    return filtered;
  }

  private getKey(
    type: "wm" | "msg",
    scope: MemoryScope | "chat",
    chatId?: string,
    userId?: string
  ): string {
    const id = scope === "chat" ? chatId : userId;
    return `${this.prefix}${type}:${scope}:${id}`;
  }
}
