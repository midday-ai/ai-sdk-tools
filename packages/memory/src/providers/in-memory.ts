import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  UIMessage,
  WorkingMemory,
} from "../types.js";

/**
 * In-memory provider - perfect for development
 */
export class InMemoryProvider implements MemoryProvider {
  private workingMemory = new Map<string, WorkingMemory>();
  private messages = new Map<string, ConversationMessage[]>();
  private chats = new Map<string, ChatSession>();

  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const key = this.getKey(params.scope, params.chatId, params.userId);
    return this.workingMemory.get(key) || null;
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    const key = this.getKey(params.scope, params.chatId, params.userId);
    this.workingMemory.set(key, {
      content: params.content,
      updatedAt: new Date(),
    });
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    const msgs = this.messages.get(message.chatId) || [];
    msgs.push(message);
    this.messages.set(message.chatId, msgs);
  }

  async getMessages<T = UIMessage>(params: {
    chatId: string;
    userId?: string;
    limit?: number;
  }): Promise<T[]> {
    let msgs = this.messages.get(params.chatId) || [];

    // Filter by userId if provided
    if (params.userId) {
      msgs = msgs.filter((msg) => !msg.userId || msg.userId === params.userId);
    }

    // Apply limit
    const limited = params.limit ? msgs.slice(-params.limit) : msgs;

    // Always attempt to parse content as JSON, then extract content field
    return limited.map((msg) => {
      let content: string | unknown = msg.content;
      try {
        // Try to parse as JSON (only if content is a string)
        if (typeof msg.content === "string") {
          const parsed = JSON.parse(msg.content);
          content = parsed; // Replace content with parsed value
        }
      } catch {
        // If parsing fails, keep original content string
      }
      // Return the content field directly (UIMessage format)
      return content as T;
    });
  }

  async saveChat(chat: ChatSession): Promise<void> {
    this.chats.set(chat.chatId, chat);
  }

  async getChats(params: {
    userId?: string;
    search?: string;
    limit?: number;
  }): Promise<ChatSession[]> {
    let allChats = Array.from(this.chats.values());

    // Filter by userId if provided
    if (params.userId) {
      allChats = allChats.filter((chat) => chat.userId === params.userId);
    }

    // Sort by updatedAt descending (most recent first)
    allChats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // Filter by search term (title) if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      allChats = allChats.filter((chat) =>
        chat.title?.toLowerCase().includes(searchLower),
      );
    }

    // Apply limit
    if (params.limit) {
      allChats = allChats.slice(0, params.limit);
    }

    return allChats;
  }

  async getChat(chatId: string): Promise<ChatSession | null> {
    return this.chats.get(chatId) || null;
  }

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.title = title;
      chat.updatedAt = new Date();
      this.chats.set(chatId, chat);
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    // Delete chat
    this.chats.delete(chatId);
    // Delete associated messages
    this.messages.delete(chatId);
  }

  private getKey(scope: MemoryScope, chatId?: string, userId?: string): string {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
}
