import {
  type UIMessage,
  type UseChatHelpers,
  type UseChatOptions,
  useChat as useOriginalChat,
} from "@ai-sdk/react";
import { useCallback, useEffect, useRef } from "react";
import { type StoreState, useChatStoreApi } from "./hooks";

export type { UseChatOptions, UseChatHelpers };

// Type for a compatible chat store
export interface CompatibleChatStore<TMessage extends UIMessage = UIMessage> {
  <T>(selector: (state: StoreState<TMessage>) => T): T;
  setState?: (partial: Partial<StoreState<TMessage>>) => void;
  _syncState?: (partial: Partial<StoreState<TMessage>>) => void;
}

export type UseChatOptionsWithPerformance<
  TMessage extends UIMessage = UIMessage,
> = UseChatOptions<TMessage> & {
  store?: CompatibleChatStore<TMessage>;
  // Additional performance options
  enableBatching?: boolean;
  throttleMs?: number;
};

export function useChat<TMessage extends UIMessage = UIMessage>(
  options: UseChatOptionsWithPerformance<TMessage> = {} as UseChatOptionsWithPerformance<TMessage>,
): UseChatHelpers<TMessage> {
  const {
    store: customStore,
    enableBatching = true,
    throttleMs = 100,
    ...originalOptions
  } = options;

  const chatHelpers = useOriginalChat<TMessage>(originalOptions);

  // Use custom store if provided, otherwise use the context store
  const contextStore = useChatStoreApi<TMessage>();
  const store = customStore || contextStore;

  const storeRef = useRef<CompatibleChatStore<TMessage> | typeof contextStore>(
    store,
  );

  // Memoize the sync function to avoid recreating it on every render
  const syncState = useCallback((chatState: Partial<StoreState<TMessage>>) => {
    if (!storeRef.current) return;

    // Check if store has _syncState method (our internal stores)
    if (typeof (storeRef.current as any).getState === "function") {
      // For vanilla Zustand stores
      const vanillaStore = storeRef.current as any;
      vanillaStore.getState()._syncState(chatState);
    } else if (typeof (storeRef.current as any)._syncState === "function") {
      (storeRef.current as any)._syncState(chatState);
    } else if (typeof (storeRef.current as any).setState === "function") {
      // For standard Zustand stores
      (storeRef.current as any).setState(chatState);
    }
  }, []);

  // Batch state updates if enabled - only sync data, not functions
  useEffect(() => {
    // Only sync state data, not function references to avoid re-render loops
    const stateData = {
      id: chatHelpers.id,
      messages: chatHelpers.messages,
      error: chatHelpers.error,
      status: chatHelpers.status,
    };

    // Sync functions separately and only once
    const functionsData = {
      sendMessage: chatHelpers.sendMessage,
      regenerate: chatHelpers.regenerate,
      stop: chatHelpers.stop,
      resumeStream: chatHelpers.resumeStream,
      addToolResult: chatHelpers.addToolResult,
      setMessages: chatHelpers.setMessages,
      clearError: chatHelpers.clearError,
    };

    const chatState = { ...stateData, ...functionsData };

    if (enableBatching) {
      // Use requestAnimationFrame for batching if available
      if (window?.requestAnimationFrame) {
        window.requestAnimationFrame(() => syncState(chatState));
      } else {
        syncState(chatState);
      }
    } else {
      syncState(chatState);
    }
    }, [
     // Only depend on data that actually changes, not function references
     chatHelpers.id,       
     chatHelpers.messages,       
     chatHelpers.error,       
     chatHelpers.status,       
     syncState,       
     enableBatching,
    ]);

  return chatHelpers;
}
