import type { UIMessage } from "@ai-sdk/react";
import { useChatStore } from "./hooks";
import type { ChatStore } from "./store";

export function useChatProperty<
  TMessage extends UIMessage = UIMessage,
  T = any,
>(selector: (state: ChatStore<TMessage>) => T, storeId: string = "default"): T {
  return useChatStore<TMessage, T>(selector, storeId);
}

export function useChatMessages<TMessage extends UIMessage = UIMessage>(
  storeId: string = "default",
): TMessage[] {
  return useChatStore<TMessage>((state) => state.messages, storeId);
}

export function useChatStatus(
  storeId: string = "default",
): "submitted" | "streaming" | "ready" | "error" {
  return useChatStore((state) => state.status, storeId);
}

export function useChatError(storeId: string = "default"): Error | undefined {
  return useChatStore((state) => state.error, storeId);
}

export function useChatSendMessage(storeId: string = "default") {
  return useChatStore((state) => state.sendMessage, storeId);
}

export function useChatMessageCount(storeId: string = "default"): number {
  return useChatStore((state) => state.messages.length, storeId);
}

export function useChatId(storeId: string = "default"): string {
  return useChatStore((state) => state.id, storeId);
}

export function useChatActions(storeId: string = "default") {
  return useChatStore(
    (state) => ({
      sendMessage: state.sendMessage,
      regenerate: state.regenerate,
      stop: state.stop,
      setMessages: state.setMessages,
      clearError: state.clearError,
    }),
    storeId,
  );
}
