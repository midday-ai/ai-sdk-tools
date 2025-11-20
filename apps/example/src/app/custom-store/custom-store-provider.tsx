"use client";

import {
  Provider as ChatProvider,
  ChatStoreContext,
  createChatStoreCreator,
} from "@ai-sdk-tools/store";
import type { UIMessage } from "@ai-sdk/react";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { useContext, useRef, type PropsWithChildren } from "react";
import {
  type PartsAugmentedState,
  withMessageParts,
} from "@/app/custom-store/with-message-parts";
import {
  type MarkdownMemoAugmentedState,
  withMarkdownMemo,
} from "@/app/custom-store/with-markdown-memo";

export type NewChatStoreProviderProps<TMessage extends UIMessage = UIMessage> =
  PropsWithChildren<{
    initialMessages?: TMessage[];
    chatKey: string;
  }>;

export type CustomChatStoreState<UI_MESSAGE extends UIMessage = UIMessage> =
  MarkdownMemoAugmentedState<UI_MESSAGE> & PartsAugmentedState<UI_MESSAGE>;

function createChatStore<TMessage extends UIMessage = UIMessage>(
  initialMessages: TMessage[] = [],
) {
  return createStore<CustomChatStoreState<TMessage>>()(
    devtools(
      subscribeWithSelector(
        withMarkdownMemo<TMessage>(initialMessages)(
          withMessageParts(createChatStoreCreator<TMessage>(initialMessages)),
        ),
      ),
      { name: "chat-store" },
    ),
  );
}

export type CustomChatStoreApi<TMessage extends UIMessage = UIMessage> =
  ReturnType<typeof createChatStore<TMessage>>;

export function CustomStoreProvider<TMessage extends UIMessage = UIMessage>({
  initialMessages = [],
  chatKey,
  children,
}: NewChatStoreProviderProps<TMessage>) {
  const storeRef = useRef<CustomChatStoreApi<TMessage> | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createChatStore<TMessage>(initialMessages);
  }

  return (
    <ChatProvider<TMessage>
      key={chatKey}
      initialMessages={initialMessages}
      store={storeRef.current || undefined}
    >
      {children}
    </ChatProvider>
  );
}

export function useCustomChatStoreApi<
  TMessage extends UIMessage = UIMessage,
>() {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error("useChatStoreApi must be used within Provider");
  return store as CustomChatStoreApi<TMessage>;
}

export default CustomStoreProvider;
