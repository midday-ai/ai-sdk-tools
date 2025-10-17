import type { Redis } from "@upstash/redis";
import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  WorkingMemory,
} from "../types.js";
import { createLogger } from "@ai-sdk-tools/debug";

const logger = createLogger('UPSTASH');

/**
 * Upstash Redis provider - serverless edge
 */
export class UpstashProvider implements MemoryProvider {
  constructor(
    private redis: Redis,
    private prefix: string = "memory:",
  ) {}

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
      contentLength: params.content.length 
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
      key 
    });
    await this.redis.rpush(key, message);
    await this.redis.ltrim(key, -100, -1); // Keep last 100
    await this.redis.expire(key, 60 * 60 * 24 * 7); // 7 days
    logger.debug(`saveMessage complete for ${message.chatId}`, { chatId: message.chatId });
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
      -1,
    );
    
    // Debug: Check what we actually retrieved
    logger.debug(`getMessages for ${params.chatId}`, { 
      chatId: params.chatId, 
      key, 
      start, 
      found: messages?.length || 0 
    });
    if (messages && messages.length > 0) {
      logger.debug(`Messages retrieved`, { 
        messages: messages.map(m => ({ role: m.role, content: m.content?.substring(0, 50) })) 
      });
    }
    
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
        }),
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
      }),
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
