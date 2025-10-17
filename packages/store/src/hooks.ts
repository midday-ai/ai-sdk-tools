"use client";

import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import type { ChatStatus } from "ai";
import * as React from "react";
import { createContext, useCallback, useContext, useRef } from "react";
import { useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { createStore, type StateCreator } from "zustand/vanilla";
import { debug } from "./debug";

// --- Performance monitoring and batching ---
let __freezeDetectorStarted = false;
let __freezeRafId = 0;
let __freezeLastTs = 0;
let __lastActionLabel: string | undefined;
let __clearLastActionTimer: ReturnType<typeof setTimeout> | null = null;

// Batched updates queue with priority
const __updateQueue: Array<{ callback: () => void; priority: number }> = [];
let __batchedUpdateScheduled = false;

function markLastAction(label: string) {
  __lastActionLabel = label;
  if (typeof window !== "undefined") {
    if (__clearLastActionTimer) clearTimeout(__clearLastActionTimer);
    __clearLastActionTimer = setTimeout(() => {
      if (__lastActionLabel === label) __lastActionLabel = undefined;
    }, 250);
  }
}

function batchUpdates(callback: () => void, priority = 0) {
  if (typeof window === "undefined") {
    callback();
    return;
  }

  __updateQueue.push({ callback, priority });

  if (!__batchedUpdateScheduled) {
    __batchedUpdateScheduled = true;

    // Use scheduler if available, otherwise fallback to rAF
    const scheduler = (window as any).scheduler;
    const schedule = scheduler?.postTask
      ? scheduler.postTask.bind(scheduler)
      : window.requestAnimationFrame?.bind(window) ||
        ((fn: () => void) => setTimeout(fn, 0));

    schedule(() => {
      const updates = __updateQueue.splice(0);
      __batchedUpdateScheduled = false;

      // Sort by priority (higher priority first) and execute
      updates.sort((a, b) => b.priority - a.priority);
      updates.forEach((update) => {
        update.callback();
      });
    });
  }
}

function startFreezeDetector({
  thresholdMs = 80,
}: {
  thresholdMs?: number;
} = {}): void {
  if (typeof window === "undefined" || __freezeDetectorStarted) return;
  __freezeDetectorStarted = true;
  __freezeLastTs = performance.now();

  const tick = (now: number) => {
    const expected = __freezeLastTs + 16.7;
    const blockedMs = now - expected;
    if (blockedMs > thresholdMs) {
      debug.warn(
        "[Freeze]",
        `${Math.round(blockedMs)}ms`,
        "lastAction=",
        __lastActionLabel,
      );
    }
    __freezeLastTs = now;
    __freezeRafId = window.requestAnimationFrame(tick);
  };

  __freezeRafId = window.requestAnimationFrame(tick);
  window.addEventListener("beforeunload", () => {
    if (__freezeRafId) cancelAnimationFrame(__freezeRafId);
  });
}

if (typeof window !== "undefined") {
  startFreezeDetector({ thresholdMs: 80 });
}

// Enhanced throttle with requestIdleCallback support
function enhancedThrottle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  let pendingArgs: Parameters<T> | null = null;

  const execute = () => {
    if (pendingArgs) {
      func.apply(null, pendingArgs);
      pendingArgs = null;
    }
  };

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    pendingArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;

      // Use requestIdleCallback if available for better performance
      if (
        typeof window !== "undefined" &&
        (window as any).requestIdleCallback
      ) {
        (window as any).requestIdleCallback(execute, { timeout: 50 });
      } else {
        execute();
      }
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;

        if (
          typeof window !== "undefined" &&
          (window as any).requestIdleCallback
        ) {
          (window as any).requestIdleCallback(execute, { timeout: 50 });
        } else {
          execute();
        }
      }, remaining);
    }
  }) as T;
}

// Message indexing for O(1) lookups
class MessageIndex<TMessage extends UIMessage> {
  private idToMessage = new Map<string, TMessage>();
  private idToIndex = new Map<string, number>();

  update(messages: TMessage[]) {
    this.idToMessage.clear();
    this.idToIndex.clear();

    messages.forEach((message, index) => {
      this.idToMessage.set(message.id, message);
      this.idToIndex.set(message.id, index);
    });
  }

  getById(id: string): TMessage | undefined {
    return this.idToMessage.get(id);
  }

  getIndexById(id: string): number | undefined {
    return this.idToIndex.get(id);
  }

  has(id: string): boolean {
    return this.idToMessage.has(id);
  }
}

export interface StoreState<TMessage extends UIMessage = UIMessage> {
  id: string | undefined;
  messages: TMessage[];
  status: ChatStatus;
  error: Error | undefined;

  // Performance optimizations
  _throttledMessages: TMessage[] | null;
  _messageIndex: MessageIndex<TMessage>;
  _memoizedSelectors: Map<string, { result: any; deps: any[] }>;
  
  // Transient data parts (not persisted in messages)
  _transientDataParts: Map<string, any>;

  // Actions with batching
  setId: (id: string | undefined) => void;
  setMessages: (messages: TMessage[]) => void;
  setStatus: (status: ChatStatus) => void;
  setError: (error: Error | undefined) => void;
  setNewChat: (id: string, messages: TMessage[]) => void;
  pushMessage: (message: TMessage) => void;
  popMessage: () => void;
  replaceMessage: (index: number, message: TMessage) => void;
  replaceMessageById: (id: string, message: TMessage) => void;

  // Chat helpers
  sendMessage?: UseChatHelpers<TMessage>["sendMessage"];
  regenerate?: UseChatHelpers<TMessage>["regenerate"];
  stop?: UseChatHelpers<TMessage>["stop"];
  resumeStream?: UseChatHelpers<TMessage>["resumeStream"];
  addToolResult?: UseChatHelpers<TMessage>["addToolResult"];
  clearError?: UseChatHelpers<TMessage>["clearError"];

  // Internal sync method
  _syncState: (newState: Partial<StoreState<TMessage>>) => void;

  // Reset method
  reset: () => void;

  // Optimized getters
  getLastMessageId: () => string | null;
  getMessageIds: () => string[];
  getThrottledMessages: () => TMessage[];
  getInternalMessages: () => TMessage[];
  getMessageById: (id: string) => TMessage | undefined;
  getMessageIndexById: (id: string) => number | undefined;
  getMessagesSlice: (start: number, end?: number) => TMessage[];
  getMessageCount: () => number;

  // Memoized complex selectors
  getMemoizedSelector: <T>(key: string, selector: () => T, deps: any[]) => T;

  // Effects
  registerThrottledMessagesEffect: (effect: () => void) => () => void;
  
  // Transient data methods
  setTransientDataPart: (type: string, data: any) => void;
  getTransientDataPart: (type: string) => any;
  removeTransientDataPart: (type: string) => void;
  clearTransientDataParts: () => void;
}

const MESSAGES_THROTTLE_MS = 16; // ~60fps for smooth streaming

export function createChatStoreCreator<TMessage extends UIMessage>(
  initialMessages: TMessage[] = [],
): StateCreator<StoreState<TMessage>, [], []> {
  let throttledMessagesUpdater: (() => void) | null = null;
  const messageIndex = new MessageIndex<TMessage>();
  const throttledEffects = new Set<() => void>();

  messageIndex.update(initialMessages);
  return (set, get) => {
    if (!throttledMessagesUpdater) {
      throttledMessagesUpdater = enhancedThrottle(() => {
        batchUpdates(() => {
          const state = get();
          const newThrottledMessages = [...state.messages];
          state._messageIndex.update(newThrottledMessages);

          set({
            _throttledMessages: newThrottledMessages,
          });

          throttledEffects.forEach((cb) => {
            try {
              cb();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.warn("[chat-store-base] throttled effect error", err);
            }
          });
        });
      }, MESSAGES_THROTTLE_MS);
    }

    return {
      id: undefined,
      messages: initialMessages,
      status: "ready" as const,
      error: undefined,
      _throttledMessages: [...initialMessages],
      _messageIndex: messageIndex,
      _memoizedSelectors: new Map(),
      _transientDataParts: new Map(),

      // Chat helpers
      sendMessage: undefined,
      regenerate: undefined,
      stop: undefined,
      resumeStream: undefined,
      addToolResult: undefined,
      clearError: undefined,

      setId: (id) => {
        markLastAction("chat:setId");
        batchUpdates(() => set({ id }));
      },

      setMessages: (messages) => {
        markLastAction("chat:setMessages");
        batchUpdates(() => {
          // Avoid unnecessary work if messages haven't changed
          const currentState = get();
          if (messages === currentState.messages) return;

          set({
            messages: messages,
            _memoizedSelectors: new Map(), // Clear memoized selectors
          });

          // During streaming, update immediately for smooth text rendering
          if (currentState.status === "streaming") {
            batchUpdates(() => {
              const state = get();
              const newThrottledMessages = [...state.messages];
              state._messageIndex.update(newThrottledMessages);

              set({
                _throttledMessages: newThrottledMessages,
              });
            }, 1); // High priority for streaming updates
          } else {
            throttledMessagesUpdater?.();
          }
        });
      },

      setStatus: (status) => {
        markLastAction("chat:setStatus");
        batchUpdates(() => set({ status }));
      },

      setError: (error) => {
        markLastAction("chat:setError");
        batchUpdates(() => set({ error }));
      },

      setNewChat: (id, messages) => {
        markLastAction("chat:setNewChat");
        batchUpdates(() => {
          set({
            messages: messages,
            status: "ready",
            error: undefined,
            id,
            _memoizedSelectors: new Map(),
          });
          throttledMessagesUpdater?.();
        });
      },

      pushMessage: (message) => {
        markLastAction("chat:pushMessage");
        batchUpdates(() => {
          const currentState = get();
          set((state) => ({
            messages: [...state.messages, message],
            _memoizedSelectors: new Map(),
          }));

          // During streaming, update immediately for smooth text rendering
          if (currentState.status === "streaming") {
            batchUpdates(() => {
              const state = get();
              const newThrottledMessages = [...state.messages];
              state._messageIndex.update(newThrottledMessages);

              set({
                _throttledMessages: newThrottledMessages,
              });
            }, 1); // High priority for streaming updates
          } else {
            throttledMessagesUpdater?.();
          }
        });
      },

      popMessage: () => {
        markLastAction("chat:popMessage");
        batchUpdates(() => {
          set((state) => ({
            messages: state.messages.slice(0, -1),
            _memoizedSelectors: new Map(),
          }));
          throttledMessagesUpdater?.();
        });
      },

      replaceMessage: (index, message) => {
        markLastAction("chat:replaceMessage");
        batchUpdates(() => {
          const currentState = get();
          set((state) => {
            const newMessages = [...state.messages];
            newMessages[index] = structuredClone(message);
            return {
              messages: newMessages,
              _memoizedSelectors: new Map(),
            };
          });

          // During streaming, update immediately for smooth text rendering
          if (currentState.status === "streaming") {
            batchUpdates(() => {
              const state = get();
              const newThrottledMessages = [...state.messages];
              state._messageIndex.update(newThrottledMessages);

              set({
                _throttledMessages: newThrottledMessages,
              });
            }, 1); // High priority for streaming updates
          } else {
            throttledMessagesUpdater?.();
          }
        });
      },

      replaceMessageById: (id, message) => {
        markLastAction("chat:replaceMessageById");
        batchUpdates(() => {
          const currentState = get();
          set((state) => {
            const index = state._messageIndex.getIndexById(id);
            if (index === undefined) return state;

            const newMessages = [...state.messages];
            newMessages[index] = structuredClone(message);
            return {
              messages: newMessages,
              _memoizedSelectors: new Map(),
            };
          });

          // During streaming, update immediately for smooth text rendering
          if (currentState.status === "streaming") {
            batchUpdates(() => {
              const state = get();
              const newThrottledMessages = [...state.messages];
              state._messageIndex.update(newThrottledMessages);

              set({
                _throttledMessages: newThrottledMessages,
              });
            }, 1); // High priority for streaming updates
          } else {
            throttledMessagesUpdater?.();
          }
        });
      },

      _syncState: (newState) => {
        markLastAction("chat:_syncState");
        batchUpdates(() => {
          set(
            {
              ...newState,
              _memoizedSelectors: new Map(), // Clear memoized selectors on sync
            },
            false,
            // 'syncFromUseChat',
          );
          if (newState.messages) {
            throttledMessagesUpdater?.();
          }
        });
      },

      reset: () => {
        markLastAction("chat:reset");
        batchUpdates(() => {
          const state = get();
          const newMessageIndex = new MessageIndex<TMessage>();
          newMessageIndex.update([]);

          // Also clear messages via setMessages if available (to sync with chat helpers)
          if (state.setMessages) {
            state.setMessages([]);
          }

          set({
            id: undefined,
            messages: [],
            status: "ready" as const,
            error: undefined,
            _throttledMessages: [],
            _messageIndex: newMessageIndex,
            _memoizedSelectors: new Map(),
            _transientDataParts: new Map(),
          });
        });
      },

      // Optimized getters
      getLastMessageId: () => {
        const state = get();
        return state.messages.length > 0
          ? state.messages[state.messages.length - 1].id
          : null;
      },

      getMessageIds: () => {
        const state = get();
        return (state._throttledMessages || state.messages).map((m) => m.id);
      },

      getThrottledMessages: () => {
        const state = get();
        return state._throttledMessages || state.messages;
      },

      getInternalMessages: () => {
        const state = get();
        return state.messages;
      },

      getMessageById: (id) => {
        const state = get();
        return state._messageIndex.getById(id);
      },

      getMessageIndexById: (id) => {
        const state = get();
        return state._messageIndex.getIndexById(id);
      },

      getMessagesSlice: (start, end) => {
        const state = get();
        const messages = state._throttledMessages || state.messages;
        return messages.slice(start, end);
      },

      getMessageCount: () => {
        const state = get();
        const messages = state._throttledMessages || state.messages;
        return messages.length;
      },

      getMemoizedSelector: <T>(
        key: string,
        selector: () => T,
        deps: any[],
      ): T => {
        const state = get();
        const cached = state._memoizedSelectors.get(key);

        // Fast dependency comparison using length + JSON for complex objects
        if (
          cached &&
          cached.deps.length === deps.length &&
          (deps.length === 0 ||
            JSON.stringify(cached.deps) === JSON.stringify(deps))
        ) {
          return cached.result;
        }

        const result = selector();
        state._memoizedSelectors.set(key, { result, deps: [...deps] });
        return result;
      },

      // Effects
      registerThrottledMessagesEffect: (effect: () => void) => {
        throttledEffects.add(effect);
        return () => {
          throttledEffects.delete(effect);
        };
      },
      
      // Transient data methods
      setTransientDataPart: (type, data) => {
        markLastAction("chat:setTransientDataPart");
        batchUpdates(() => {
          set((state) => {
            const newTransientDataParts = new Map(state._transientDataParts);
            newTransientDataParts.set(type, data);
            return { _transientDataParts: newTransientDataParts };
          });
        });
      },
      
      getTransientDataPart: (type) => {
        const state = get();
        return state._transientDataParts.get(type);
      },
      
      removeTransientDataPart: (type) => {
        markLastAction("chat:removeTransientDataPart");
        batchUpdates(() => {
          set((state) => {
            const newTransientDataParts = new Map(state._transientDataParts);
            newTransientDataParts.delete(type);
            return { _transientDataParts: newTransientDataParts };
          });
        });
      },
      
      clearTransientDataParts: () => {
        markLastAction("chat:clearTransientDataParts");
        batchUpdates(() => set({ _transientDataParts: new Map() }));
      },
    };
  };
}

export function createChatStore<TMessage extends UIMessage = UIMessage>(
  initialMessages: TMessage[] = [],
) {
  return createStore<StoreState<TMessage>>()(
    devtools(
      subscribeWithSelector(createChatStoreCreator<TMessage>(initialMessages)),
      { name: "chat-store" },
    ),
  );
}

type ChatStoreApi<TMessage extends UIMessage = UIMessage> = ReturnType<
  typeof createChatStore<TMessage>
>;

export const ChatStoreContext = createContext<ChatStoreApi<any> | undefined>(
  undefined,
);

export function Provider<TMessage extends UIMessage = UIMessage>({
  children,
  initialMessages = [],
}: {
  children: React.ReactNode;
  initialMessages?: TMessage[];
}) {
  const storeRef = useRef<ChatStoreApi<TMessage> | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createChatStore<TMessage>(initialMessages);
  }

  return React.createElement(
    ChatStoreContext.Provider,
    { value: storeRef.current },
    children,
  );
}

// Standard Zustand v5 store hook
export function useChatStore<T, TMessage extends UIMessage = UIMessage>(
  selector: (store: StoreState<TMessage>) => T,
): T;
export function useChatStore<
  TMessage extends UIMessage = UIMessage,
>(): StoreState<TMessage>;
export function useChatStore<
  T = StoreState<UIMessage>,
  TMessage extends UIMessage = UIMessage,
>(selector?: (store: StoreState<TMessage>) => T) {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error("useChatStore must be used within Provider");

  const selectorOrIdentity =
    selector || ((s: StoreState<TMessage>) => s as unknown as T);

  // Use Zustand's built-in useStore
  return useStore(store, selectorOrIdentity as (state: any) => T);
}

export function useChatStoreApi<TMessage extends UIMessage = UIMessage>() {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error("useChatStoreApi must be used within Provider");
  return store as ChatStoreApi<TMessage>;
}

// Optimized selector hooks with memoization
export const useChatMessages = <TMessage extends UIMessage = UIMessage>() => {
  return useChatStore(
    useShallow((state: StoreState<TMessage>) => state.getThrottledMessages()),
  );
};

// Stable selector functions to avoid recreation
const statusSelector = (state: StoreState<any>) => state.status;
const errorSelector = (state: StoreState<any>) => state.error;
const idSelector = (state: StoreState<any>) => state.id;
const messageCountSelector = (state: StoreState<any>) =>
  state.getMessageCount();

export const useChatStatus = () => useChatStore(statusSelector);
export const useChatError = () => useChatStore(errorSelector);
export const useChatId = () => useChatStore(idSelector);
export const useMessageIds = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore(
    useShallow((state: StoreState<TMessage>) => state.getMessageIds()),
  );

// Optimized message selector with O(1) lookup
export const useMessageById = <TMessage extends UIMessage = UIMessage>(
  messageId: string,
) => {
  return useChatStore(
    useCallback(
      (state: StoreState<TMessage>) => {
        const message = state.getMessageById(messageId);
        if (!message) throw new Error(`Message not found for id: ${messageId}`);
        return message;
      },
      [messageId],
    ),
  );
};

// Virtualization helper for large message lists
export const useVirtualMessages = <TMessage extends UIMessage = UIMessage>(
  start: number,
  end?: number,
) => {
  return useChatStore(
    useCallback(
      (state: StoreState<TMessage>) => state.getMessagesSlice(start, end),
      [start, end],
    ),
  );
};

export const useMessageCount = () => useChatStore(messageCountSelector);

// Reset hook for convenience
export const useChatReset = () => useChatStore((state) => state.reset);
// Stable fallback functions to prevent infinite loops
const fallbackSendMessage = async () => {
  debug.warn(
    "sendMessage not configured - make sure useChat is called with transport",
  );
};
const fallbackRegenerate = async () => {
  debug.warn(
    "regenerate not configured - make sure useChat is called with transport",
  );
};
const fallbackStop = async () => {
  debug.warn(
    "stop not configured - make sure useChat is called with transport",
  );
};
const fallbackResumeStream = async () => {
  debug.warn(
    "resumeStream not configured - make sure useChat is called with transport",
  );
};
const fallbackAddToolResult = async () => {
  debug.warn(
    "addToolResult not configured - make sure useChat is called with transport",
  );
};
const fallbackClearError = () => {
  debug.warn(
    "clearError not configured - make sure useChat is called with transport",
  );
};

export type ChatActions<TMessage extends UIMessage = UIMessage> = {
  setMessages: (messages: TMessage[]) => void;
  pushMessage: (message: TMessage) => void;
  popMessage: () => void;
  replaceMessage: (index: number, message: TMessage) => void;
  replaceMessageById: (id: string, message: TMessage) => void;
  setStatus: (status: ChatStatus) => void;
  setError: (error: Error | undefined) => void;
  setId: (id: string | undefined) => void;
  setNewChat: (id: string, messages: TMessage[]) => void;
  reset: () => void;
  sendMessage: UseChatHelpers<TMessage>["sendMessage"];
  regenerate: UseChatHelpers<TMessage>["regenerate"];
  stop: UseChatHelpers<TMessage>["stop"];
  resumeStream: UseChatHelpers<TMessage>["resumeStream"];
  addToolResult: UseChatHelpers<TMessage>["addToolResult"];
  clearError: UseChatHelpers<TMessage>["clearError"];
};

export const useChatActions = <
  TMessage extends UIMessage = UIMessage,
>(): ChatActions<TMessage> =>
  useChatStore(
    useShallow((state: StoreState<TMessage>) => ({
      setMessages: state.setMessages,
      pushMessage: state.pushMessage,
      popMessage: state.popMessage,
      replaceMessage: state.replaceMessage,
      replaceMessageById: state.replaceMessageById,
      setStatus: state.setStatus,
      setError: state.setError,
      setId: state.setId,
      setNewChat: state.setNewChat,
      reset: state.reset,
      sendMessage: state.sendMessage || fallbackSendMessage,
      regenerate: state.regenerate || fallbackRegenerate,
      stop: state.stop || fallbackStop,
      resumeStream: state.resumeStream || fallbackResumeStream,
      addToolResult: state.addToolResult || fallbackAddToolResult,
      clearError: state.clearError || fallbackClearError,
    })),
  );

// Memoized complex selector hook
export const useSelector = <TMessage extends UIMessage = UIMessage, T = any>(
  key: string,
  selector: (messages: TMessage[]) => T,
  deps: any[] = [],
) => {
  return useChatStore(
    useCallback(
      (state: StoreState<TMessage>) =>
        state.getMemoizedSelector(
          key,
          () => selector(state.getThrottledMessages()),
          [state.getMessageCount(), ...deps],
        ),
      [key, selector, deps],
    ),
  );
};
