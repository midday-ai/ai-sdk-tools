"use client";

import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import * as React from "react";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { createStore } from "zustand/vanilla";

// --- Performance monitoring and batching ---
let __freezeDetectorStarted = false;
let __freezeRafId = 0;
let __freezeLastTs = 0;
let __lastActionLabel: string | undefined;
let __clearLastActionTimer: ReturnType<typeof setTimeout> | null = null;

// Batched updates queue
const __updateQueue: Array<() => void> = [];
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

function batchUpdates(callback: () => void) {
  if (typeof window === "undefined") {
    callback();
    return;
  }

  __updateQueue.push(callback);

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

      // Execute all updates in a single batch
      updates.forEach((update) => {
        update();
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
      console.warn(
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
  status: "ready" | "loading" | "streaming" | "error" | "submitted";
  error: Error | undefined;

  // Performance optimizations
  _throttledMessages: TMessage[] | null;
  _messageIndex: MessageIndex<TMessage>;
  _lastMessageCount: number;
  _memoizedSelectors: Map<string, { result: any; deps: any[] }>;

  // Actions with batching
  setId: (id: string | undefined) => void;
  setMessages: (messages: TMessage[]) => void;
  setStatus: (
    status: "ready" | "loading" | "streaming" | "error" | "submitted",
  ) => void;
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
}

const MESSAGES_THROTTLE_MS = 100;

export function createChatStore<TMessage extends UIMessage = UIMessage>(
  initialMessages: TMessage[] = [],
) {
  let throttledMessagesUpdater: (() => void) | null = null;
  const messageIndex = new MessageIndex<TMessage>();
  messageIndex.update(initialMessages);

  return createStore<StoreState<TMessage>>()(
    devtools(
      subscribeWithSelector((set, get) => {
        if (!throttledMessagesUpdater) {
          throttledMessagesUpdater = enhancedThrottle(() => {
            batchUpdates(() => {
              const state = get();
              const newThrottledMessages = [...state.messages];
              state._messageIndex.update(newThrottledMessages);

              set({
                _throttledMessages: newThrottledMessages,
                _lastMessageCount: newThrottledMessages.length,
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
          _lastMessageCount: initialMessages.length,
          _memoizedSelectors: new Map(),

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
              throttledMessagesUpdater?.();
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
              set((state) => ({
                messages: [...state.messages, message],
                _memoizedSelectors: new Map(),
              }));
              throttledMessagesUpdater?.();
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
              set((state) => {
                const newMessages = [...state.messages];
                newMessages[index] = structuredClone(message);
                return {
                  messages: newMessages,
                  _memoizedSelectors: new Map(),
                };
              });
              throttledMessagesUpdater?.();
            });
          },

          replaceMessageById: (id, message) => {
            markLastAction("chat:replaceMessageById");
            batchUpdates(() => {
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
              throttledMessagesUpdater?.();
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
                "syncFromUseChat",
              );
              if (newState.messages) {
                throttledMessagesUpdater?.();
              }
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
            return (state._throttledMessages || state.messages).map(
              (m) => m.id,
            );
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
            return state._lastMessageCount;
          },

          getMemoizedSelector: <T>(
            key: string,
            selector: () => T,
            deps: any[],
          ): T => {
            const state = get();
            const cached = state._memoizedSelectors.get(key);

            if (cached && equal(cached.deps, deps)) {
              return cached.result;
            }

            const result = selector();
            state._memoizedSelectors.set(key, { result, deps: [...deps] });
            return result;
          },
        };
      }),
      { name: "experimental-chat-store" },
    ),
  );
}

type ChatStoreApi<TMessage extends UIMessage = UIMessage> = ReturnType<
  typeof createChatStore<TMessage>
>;

const ChatStoreContext = createContext<ChatStoreApi<any> | undefined>(
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

export function useChatStore<T, TMessage extends UIMessage = UIMessage>(
  selector: (store: StoreState<TMessage>) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T;
export function useChatStore<
  TMessage extends UIMessage = UIMessage,
>(): StoreState<TMessage>;
export function useChatStore<
  T = StoreState<UIMessage>,
  TMessage extends UIMessage = UIMessage,
>(
  selector?: (store: StoreState<TMessage>) => T,
  equalityFn?: (a: T, b: T) => boolean,
) {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error("useChatStore must be used within Provider");

  const selectorOrIdentity =
    (selector as (store: StoreState<TMessage>) => T) ??
    ((s: StoreState<TMessage>) => s as unknown as T);

  return useStoreWithEqualityFn(
    store,
    selectorOrIdentity as (state: any) => T,
    equalityFn || equal,
  );
}

export function useChatStoreApi<TMessage extends UIMessage = UIMessage>() {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error("useChatStoreApi must be used within Provider");
  return store as ChatStoreApi<TMessage>;
}

// Optimized selector hooks with memoization
export const useChatMessages = <TMessage extends UIMessage = UIMessage>() => {
  const store = useChatStore((state: StoreState<TMessage>) =>
    state.getThrottledMessages(),
  );

  return useMemo(() => store, [store]);
};

export const useChatStatus = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore((state: StoreState<TMessage>) => state.status);

export const useChatError = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore((state: StoreState<TMessage>) => state.error);

export const useChatId = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore((state: StoreState<TMessage>) => state.id);

export const useMessageIds = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore((state: StoreState<TMessage>) => state.getMessageIds(), shallow);

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
    equal,
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
    shallow,
  );
};

export const useMessageCount = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore((state: StoreState<TMessage>) => state.getMessageCount());

export const useChatActions = <TMessage extends UIMessage = UIMessage>() =>
  useChatStore(
    (state: StoreState<TMessage>) => ({
      setMessages: state.setMessages,
      pushMessage: state.pushMessage,
      popMessage: state.popMessage,
      replaceMessage: state.replaceMessage,
      replaceMessageById: state.replaceMessageById,
      setStatus: state.setStatus,
      setError: state.setError,
      setId: state.setId,
      setNewChat: state.setNewChat,
      sendMessage: state.sendMessage,
      regenerate: state.regenerate,
      stop: state.stop,
      resumeStream: state.resumeStream,
      addToolResult: state.addToolResult,
      clearError: state.clearError,
    }),
    shallow,
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
    equal,
  );
};
