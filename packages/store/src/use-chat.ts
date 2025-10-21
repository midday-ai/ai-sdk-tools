import {
  type UIMessage,
  type UseChatHelpers,
  type UseChatOptions,
  useChat as useOriginalChat,
} from "@ai-sdk/react";
import { useCallback, useEffect, useRef } from "react";
import { useStore } from "zustand";
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
};

export function useChat<TMessage extends UIMessage = UIMessage>(
  options: UseChatOptionsWithPerformance<TMessage> = {} as UseChatOptionsWithPerformance<TMessage>,
): UseChatHelpers<TMessage> {
  const {
    store: customStore,
    enableBatching = true,
    ...originalOptions
  } = options;

  const originalOnData = (options as any).onData;

  // Use custom store if provided, otherwise use the context store
  const contextStore = useChatStoreApi<TMessage>();
  const store = customStore || contextStore;

  // Wrap onData to capture transient data parts
  const wrappedOnData = useCallback(
    (dataPart: any) => {
      // Check if it's a data part (starts with 'data-')
      if (dataPart.type?.startsWith("data-")) {
        // Store transient data parts in the store
        if (typeof (store as any).getState === "function") {
          const storeState = (store as any).getState();
          // If data is null or undefined, remove the transient data part
          if (dataPart.data === null || dataPart.data === undefined) {
            if (storeState.removeTransientDataPart) {
              storeState.removeTransientDataPart(dataPart.type);
            }
          } else if (storeState.setTransientDataPart) {
            storeState.setTransientDataPart(dataPart.type, dataPart.data);
          }
        }
      }

      // Call original onData handler if provided
      if (originalOnData) {
        originalOnData(dataPart);
      }
    },
    [store, originalOnData],
  );

  const chatHelpers = useOriginalChat<TMessage>({
    ...originalOptions,
    onData: wrappedOnData,
  });

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

  // Simple sync - but don't overwrite store messages if chat has no messages
  // This preserves server-side messages during hydration
  useEffect(() => {
    const currentStoreState = (store as any).getState?.() || { messages: [] };

    // Skip syncing messages if store has messages but chat doesn't
    // This prevents clearing server-side messages on hydration
    const shouldSyncMessages = !(
      currentStoreState.messages?.length > 0 &&
      chatHelpers.messages.length === 0
    );

    // Only sync state data
    const stateData: any = {
      id: chatHelpers.id,
      error: chatHelpers.error,
      status: chatHelpers.status,
    };

    // Only add messages to sync object if we should sync them
    if (shouldSyncMessages) {
      stateData.messages = chatHelpers.messages;
    }

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
    chatHelpers.resumeStream,
    chatHelpers.clearError,
    chatHelpers.sendMessage,
    store,
    chatHelpers.setMessages,
    chatHelpers.stop,
    chatHelpers.regenerate,
    chatHelpers.addToolResult,
  ]);

  // Return the store's messages as the source of truth, not chatHelpers.messages
  // Subscribe to store messages so this is reactive
  const storeMessages = useStore(
    store as any,
    (state: any) => state.messages as TMessage[],
  );

  return {
    ...chatHelpers,
    messages: storeMessages || chatHelpers.messages,
  };
}
