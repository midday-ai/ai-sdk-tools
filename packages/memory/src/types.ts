/**
 * Persistent working memory that agents maintain
 */
export interface WorkingMemory {
  content: string;
  updatedAt: Date;
}

/**
 * Memory scope
 * - chat: Per-conversation (recommended)
 * - user: Per-user across all chats (optional)
 */
export type MemoryScope = "chat" | "user";

/**
 * Conversation message for history
 */
export interface ConversationMessage {
  chatId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

/**
 * Chat session metadata for persistence and organization
 */
export interface ChatSession {
  chatId: string;
  userId?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

/**
 * Configuration for automatic title generation
 */
export interface GenerateTitleConfig {
  model: any; // Use 'any' to avoid AI SDK dependency
  instructions?: string;
}

/**
 * Configuration for automatic prompt suggestions generation
 */
export interface GenerateSuggestionsConfig {
  enabled: boolean | ((params: { messages: any[]; context?: Record<string, unknown> }) => boolean | Promise<boolean>);
  model?: any; // Use 'any' to avoid AI SDK dependency
  instructions?: string;
  limit?: number; // Max number of suggestions (default: 5)
  minResponseLength?: number; // Minimum assistant response length to generate suggestions (default: 100)
  contextWindow?: number; // Number of recent message exchanges to use as context (default: 1)
}

/**
 * Configuration for chat session management
 */
export interface ChatsConfig {
  enabled: boolean;
  generateTitle?: boolean | GenerateTitleConfig;
  generateSuggestions?: boolean | GenerateSuggestionsConfig;
}

/**
 * Memory Provider Interface
 *
 * Simple 4-method API for any storage backend.
 */
export interface MemoryProvider {
  /** Get persistent working memory */
  getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null>;

  /** Update persistent working memory */
  updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void>;

  /**
   * Add message to history (optional)
   * Note: This does NOT replace the messages array.
   * Use for analytics, retrieval, or cross-session context.
   */
  saveMessage?(message: ConversationMessage): Promise<void>;

  /** Get recent messages (optional) */
  getMessages?(params: {
    chatId: string;
    limit?: number;
  }): Promise<ConversationMessage[]>;

  /** Save or update chat session (optional) */
  saveChat?(chat: ChatSession): Promise<void>;

  /** Get chat sessions for a user (optional, returns all if userId omitted) */
  getChats?(userId?: string): Promise<ChatSession[]>;

  /** Get specific chat session (optional) */
  getChat?(chatId: string): Promise<ChatSession | null>;

  /** Update chat title (optional) */
  updateChatTitle?(chatId: string, title: string): Promise<void>;
}

/**
 * Memory configuration for agents
 */
export interface MemoryConfig {
  /** Storage provider */
  provider: MemoryProvider;

  /** Working memory (learned facts) */
  workingMemory?: {
    enabled: boolean;
    scope: MemoryScope;
    /** Markdown template structure */
    template?: string;
  };

  /**
   * Conversation history (optional analytics)
   * Note: Agent still receives full messages array from frontend
   */
  history?: {
    enabled: boolean;
    /** Max messages to load */
    limit?: number;
  };

  /** Chat session management and title generation */
  chats?: ChatsConfig;
}
