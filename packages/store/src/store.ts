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

// Global store instances map that works across bundles
const getGlobalStoreInstances = (): Map<string, any> => {
  if (typeof window !== 'undefined') {
    if (!(window as any).__AI_SDK_TOOLS_STORE_INSTANCES__) {
      (window as any).__AI_SDK_TOOLS_STORE_INSTANCES__ = new Map();
    }
    return (window as any).__AI_SDK_TOOLS_STORE_INSTANCES__;
  }
  // Fallback for server-side or when window is not available
  if (!(globalThis as any).__AI_SDK_TOOLS_STORE_INSTANCES__) {
    (globalThis as any).__AI_SDK_TOOLS_STORE_INSTANCES__ = new Map();
  }
  return (globalThis as any).__AI_SDK_TOOLS_STORE_INSTANCES__;
};

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
  const storeInstances = getGlobalStoreInstances();
  if (!storeInstances.has(storeId)) {
    storeInstances.set(storeId, createChatStore<TMessage>());
  }
  return storeInstances.get(storeId)!;
}

export function clearChatStore(storeId: string = "default"): void {
  const storeInstances = getGlobalStoreInstances();
  storeInstances.delete(storeId);
}

export function clearAllChatStores(): void {
  const storeInstances = getGlobalStoreInstances();
  storeInstances.clear();
}

export function getChatStoreIds(): string[] {
  const storeInstances = getGlobalStoreInstances();
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
