import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import { create, type StoreApi } from "zustand";
import { devtools } from "zustand/middleware";

export interface ChatStore<TMessage extends UIMessage = UIMessage>
  extends UseChatHelpers<TMessage> {}

// Internal sync method for connecting with useChat
export interface ChatStoreWithSync<TMessage extends UIMessage = UIMessage>
  extends ChatStore<TMessage> {
  _syncState: (newState: Partial<ChatStore<TMessage>>) => void;
}

// Store instances map (using any for simplicity due to generic constraints)
const storeInstances = new Map<string, any>();

function createChatStore<TMessage extends UIMessage = UIMessage>(): StoreApi<
  ChatStoreWithSync<TMessage>
> {
  return create<ChatStoreWithSync<TMessage>>()(
    devtools(
      (set) => ({
        // Default state matching UseChatHelpers interface
        id: "",
        messages: [] as TMessage[],
        error: undefined,
        status: "ready" as const,

        // Default no-op functions (will be replaced by useChat)
        sendMessage: async () => {},
        regenerate: async () => {},
        stop: async () => {},
        resumeStream: async () => {},
        addToolResult: async () => {},
        setMessages: () => {},
        clearError: () => {},

        // Internal sync method for useChat integration
        _syncState: (newState: Partial<ChatStore<TMessage>>) => {
          set(newState, false, "syncFromUseChat");
        },
      }),
      {
        name: "ai-chat-store",
      },
    ),
  );
}

export function getChatStore<TMessage extends UIMessage = UIMessage>(
  storeId: string = "default",
): any {
  if (!storeInstances.has(storeId)) {
    storeInstances.set(storeId, createChatStore<TMessage>());
  }
  return storeInstances.get(storeId)!;
}

export function clearChatStore(storeId: string = "default"): void {
  storeInstances.delete(storeId);
}

export function clearAllChatStores(): void {
  storeInstances.clear();
}

export function getChatStoreIds(): string[] {
  return Array.from(storeInstances.keys());
}

/**
 * Create a custom chat store with optional middleware
 * @param middleware Optional Zustand middleware to apply
 * @returns A new chat store instance
 */
export function createCustomChatStore<TMessage extends UIMessage = UIMessage>(
  middleware?: any,
): StoreApi<ChatStore<TMessage>> {
  const storeConfig = (_set: any) => ({
    id: "",
    messages: [] as TMessage[],
    error: undefined as Error | undefined,
    status: "ready" as const,
    sendMessage: async () => {},
    regenerate: async () => {},
    stop: async () => {},
    resumeStream: async () => {},
    addToolResult: async () => {},
    setMessages: () => {},
    clearError: () => {},
  });

  return create<ChatStore<TMessage>>()(
    middleware ? middleware(storeConfig) : storeConfig,
  );
}
