import { useStoreWithEqualityFn } from "zustand/traditional";
import type { AgentUIMessage as ChatMessage } from "@/types/agents";
import {
  useCustomChatStoreApi,
  type CustomChatStoreState,
} from "./custom-store-provider";
export function useMarkdownStore<T>(
  selector: (store: CustomChatStoreState<ChatMessage>) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T {
  const store = useCustomChatStoreApi<ChatMessage>();
  if (!store) {
    throw new Error("useMarkdownStore must be used within ChatStoreProvider");
  }
  return useStoreWithEqualityFn(store, selector, equalityFn);
}

export const useMarkdownBlocksForPart = (messageId: string, partIdx: number) =>
  useMarkdownStore((state) =>
    state.getMarkdownBlocksForPart(messageId, partIdx),
  );

export const useMarkdownBlockIndexesForPart = (
  messageId: string,
  partIdx: number,
) =>
  useMarkdownStore((state) =>
    state.getMarkdownBlockCountForPart(messageId, partIdx),
  );

export const useMarkdownBlockCountForPart = (
  messageId: string,
  partIdx: number,
) =>
  useMarkdownStore((state) =>
    state.getMarkdownBlockCountForPart(messageId, partIdx),
  );

export const useMarkdownBlockByIndex = (
  messageId: string,
  partIdx: number,
  blockIdx: number,
) =>
  useMarkdownStore((state) =>
    state.getMarkdownBlockByIndex(messageId, partIdx, blockIdx),
  );
