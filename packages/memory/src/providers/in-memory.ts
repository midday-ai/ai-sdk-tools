import type {
  ChatSession,
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
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

  async getMessages(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]> {
    const msgs = this.messages.get(params.chatId) || [];
    return params.limit ? msgs.slice(-params.limit) : msgs;
  }

  async saveChat(chat: ChatSession): Promise<void> {
    this.chats.set(chat.chatId, chat);
  }

  async getChats(userId?: string): Promise<ChatSession[]> {
    const allChats = Array.from(this.chats.values());

    if (userId) {
      // Filter by userId if provided
      return allChats.filter((chat) => chat.userId === userId);
    }

    // Return all chats if no userId
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

  private getKey(scope: MemoryScope, chatId?: string, userId?: string): string {
    const id = scope === "chat" ? chatId : userId;
    return `${scope}:${id}`;
  }
}
