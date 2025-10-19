"use client";

import { DefaultChatTransport } from "ai";
import {
  useArtifacts,
  useChat,
  useChatActions,
} from "ai-sdk-tools/client";
import { type RefObject, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { ArtifactCanvas } from "@/components/canvas";
import {
  ChatHeader,
  ChatInput,
  type ChatInputMessage,
  ChatMessages,
  ChatStatusIndicators,
  ChatTitle,
  EmptyState,
  RateLimitIndicator,
  SuggestedPrompts,
} from "@/components/chat";
import { useChatStatus } from "@/hooks/use-chat-status";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        const lastMessage = messages[messages.length - 1] as ChatInputMessage;

        return {
          body: {
            message: lastMessage,
            id,
            // Pass agent/tool choices if present in message metadata
            agentChoice: lastMessage.agentChoice,
            toolChoice: lastMessage.toolChoice,
          },
        };
      },
    }),
  });
 
  const { reset } = useChatActions();
  const { agentStatus, currentToolCall } = useChatStatus(messages, status);

  const { artifacts } = useArtifacts();
  const hasArtifacts = artifacts && artifacts.length > 0;
  const hasMessages = messages.length > 0;

  const handleCloseCanvas = () => {
    stop();
    reset();
  };

  const handleSubmit = (message: ChatInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (message.files?.length) {
      toast.success("Files attached", {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    sendMessage({
      text: message.text || "Sent with attachments",
      agentChoice: message.agentChoice,
      toolChoice: message.toolChoice,
    } as any);
    setText("");
  };

  const chatInput = (
    <ChatInput
      text={text}
      setText={setText}
      textareaRef={textareaRef as RefObject<HTMLTextAreaElement | null>}
      useWebSearch={useWebSearch}
      setUseWebSearch={setUseWebSearch}
      onSubmit={handleSubmit}
      status={status}
      hasMessages={hasMessages}
    />
  );

  return (
    <div className="relative flex size-full overflow-hidden min-h-screen">
      <RateLimitIndicator />

      <ChatHeader />

      {/* Canvas slides in from right when artifacts are present */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-20 ${
          hasArtifacts
            ? "translate-x-0 transition-transform duration-300 ease-in-out"
            : "translate-x-full"
        }`}
        style={{ width: "600px" }}
      >
        {hasArtifacts && <ArtifactCanvas onClose={handleCloseCanvas} />}
      </div>

      {/* Main chat area - container that slides left when canvas opens */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          hasArtifacts ? "mr-[600px]" : "mr-0"
        }`}
      >
        {hasMessages ? (
          <>
            {/* Conversation view - messages */}
            <div className="flex-1 max-w-2xl mx-auto w-full pb-48">
              <ChatTitle />
              <Conversation>
                <ConversationContent>
                  <ChatMessages messages={messages} />
                  <ChatStatusIndicators
                    agentStatus={agentStatus}
                    currentToolCall={currentToolCall}
                    status={status}
                  />
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
            </div>

            {/* Fixed input at bottom - respects parent container boundaries */}
            <div
              className={`fixed bottom-0 left-0 transition-all duration-300 ease-in-out ${
                hasArtifacts ? "right-[600px]" : "right-0"
              }`}
            >
              <div className="w-full px-4 pb-4 max-w-2xl mx-auto">
                <SuggestedPrompts />
                {chatInput}
              </div>
            </div>
          </>
        ) : (
          <EmptyState>{chatInput}</EmptyState>
        )}
      </div>
    </div>
  );
}
