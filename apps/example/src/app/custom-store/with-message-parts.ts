"use client";
import type { UIMessage } from "ai";
import type { StateCreator } from "zustand";
import type { StoreState as BaseChatStoreState } from "@ai-sdk-tools/store";

// Helper types to safely derive the message part and part.type types from UI_MESSAGE
type UIMessageParts<UI_MSG> = UI_MSG extends { parts: infer P } ? P : never;
type UIMessagePart<UI_MSG> = UIMessageParts<UI_MSG> extends Array<infer I>
  ? I
  : never;
type UIMessagePartType<UI_MSG> = UIMessagePart<UI_MSG> extends { type: infer T }
  ? T
  : never;

function extractPartTypes<UI_MESSAGE extends UIMessage>(
  message: UI_MESSAGE,
): {
  partsRef: UIMessageParts<UI_MESSAGE>;
  types: UIMessagePartType<UI_MESSAGE>[];
} {
  const partsRef = (message as unknown as { parts: unknown[] })
    .parts as UIMessageParts<UI_MESSAGE>;
  const types = (partsRef as UIMessagePart<UI_MESSAGE>[]).map(
    (part) =>
      (
        part as UIMessagePart<UI_MESSAGE> & {
          type: UIMessagePartType<UI_MESSAGE>;
        }
      ).type,
  ) as UIMessagePartType<UI_MESSAGE>[];
  return { partsRef, types };
}

export type PartsAugmentedState<UM extends UIMessage> =
  BaseChatStoreState<UM> & {
    getMessagePartTypesById: (messageId: string) => UIMessagePartType<UM>[];
    getMessagePartsRangeCached: (
      messageId: string,
      startIdx: number,
      endIdx: number,
      type?: string,
    ) => UIMessageParts<UM>;
    getMessagePartByIdxCached: (
      messageId: string,
      partIdx: number,
    ) => UIMessageParts<UM>[number];
  };

export type PartsSC<UM extends UIMessage> = StateCreator<
  PartsAugmentedState<UM>,
  [],
  []
>;

export const withMessageParts =
  <UI_MESSAGE extends UIMessage, T extends BaseChatStoreState<UI_MESSAGE>>(
    creator: StateCreator<T, [], []>,
  ): StateCreator<T & PartsAugmentedState<UI_MESSAGE>, [], []> =>
  (set, get, api) => {
    const base = creator(set, get, api);
    return {
      ...base,

      getMessagePartTypesById: (messageId: string) => {
        const state = get();
        const message = (state._throttledMessages || state.messages).find(
          (msg) => msg.id === messageId,
        ) as UI_MESSAGE | undefined;
        if (!message) {
          throw new Error(`Message not found for id: ${messageId}`);
        }
        const { types } = extractPartTypes<UI_MESSAGE>(message);
        return types as UIMessagePartType<UI_MESSAGE>[];
      },
      getMessagePartsRangeCached: (
        messageId: string,
        startIdx: number,
        endIdx: number,
        type?: string,
      ) => {
        const state = get();
        const message = (state._throttledMessages || state.messages).find(
          (msg) => msg.id === messageId,
        ) as unknown as { parts: Array<{ type: string }> } | undefined;
        if (!message) {
          throw new Error(`Message not found for id: ${messageId}`);
        }
        const start = Math.max(0, Math.floor(startIdx));
        const end = Math.min(message.parts.length - 1, Math.floor(endIdx));
        if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
          const empty = [] as unknown as UIMessageParts<UI_MESSAGE>;
          return empty;
        }
        const baseSlice = message.parts.slice(start, end + 1);
        const result = (
          type === undefined
            ? baseSlice
            : (baseSlice.filter(
                (p) => p.type === type,
              ) as unknown as UIMessageParts<UI_MESSAGE>)
        ) as UIMessageParts<UI_MESSAGE>;
        return result as UIMessageParts<UI_MESSAGE>;
      },
      getMessagePartByIdxCached: (messageId: string, partIdx: number) => {
        const state = get();
        const message = (state._throttledMessages || state.messages).find(
          (msg) => msg.id === messageId,
        ) as unknown as { parts: unknown[] } | undefined;
        if (!message) {
          throw new Error(`Message not found for id: ${messageId}`);
        }
        const selected = message.parts[partIdx];
        if (selected === undefined) {
          throw new Error(
            `Part not found for id: ${messageId} at partIdx: ${partIdx}`,
          );
        }
        return selected as UIMessageParts<UI_MESSAGE>[number];
      },
    };
  };
