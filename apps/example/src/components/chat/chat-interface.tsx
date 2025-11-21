"use client";

import { DefaultChatTransport, generateId } from "ai";
import { useArtifacts, useChat, useDataPart } from "ai-sdk-tools/client";
import { parseAsString, useQueryState } from "nuqs";
import { type RefObject, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { ArtifactCanvas } from "@/components/canvas";
import {
  ChatHeader,
  ChatHistory,
  ChatInput,
  type ChatInputMessage,
  ChatMessages,
  ChatStatusIndicators,
  EmptyState,
  SuggestedPrompts,
} from "@/components/chat";
import { Header } from "@/components/header";
import { useChatInterface } from "@/hooks/use-chat-interface";
import { useChatStatus } from "@/hooks/use-chat-status";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const { chatId: routeChatId, isHome } = useChatInterface();
  const chatId = useMemo(() => routeChatId ?? generateId(), [routeChatId]);

  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        const lastMessage = messages[messages.length - 1] as ChatInputMessage;

        const agentChoice = lastMessage.metadata?.agentChoice;
        const toolChoice = lastMessage.metadata?.toolChoice;

        return {
          body: {
            message: lastMessage,
            id,
            agentChoice,
            toolChoice,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };
      },
    }),
  });

  const { agentStatus, currentToolCall } = useChatStatus(messages, status);

  const [selectedType, setSelectedType] = useQueryState(
    "artifact-type",
    parseAsString,
  );

  const [data] = useArtifacts({
    // Pass undefined when query param is null (not set) to allow auto-opening
    // The hook uses explicitlyClosedRef to track when explicitly closed
    value: selectedType ?? undefined,
    onChange: (v: string | null) => setSelectedType(v ?? null),
  });
  const hasArtifacts = data.artifacts.length > 0;
  // Canvas is open if we have artifacts and an active type is set
  // Use data.activeType so it stays open even if query param is temporarily null
  const isCanvasOpen = hasArtifacts && data.activeType !== null;
  const hasMessages = messages.length > 0;

  const [suggestions] = useDataPart<{ prompts: string[] }>("suggestions");
  const hasSuggestions = suggestions?.prompts && suggestions.prompts.length > 0;

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
      files: message.files,
      metadata: {
        agentChoice: message.metadata?.agentChoice,
        toolChoice: message.metadata?.toolChoice,
      },
    });
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
      {isHome && (
        <Header onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} />
      )}

      {/* Chat History Sidebar */}
      {isHistoryOpen && (
        <>
          {/* Overlay - closes sidebar when clicking outside */}
          <button
            type="button"
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsHistoryOpen(false)}
            aria-label="Close chat history"
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-background border-r border-border">
            <ChatHistory />
          </div>
        </>
      )}

      {/* Canvas slides in from right when artifacts are present and canvas is open */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-20",
          isCanvasOpen ? "translate-x-0" : "translate-x-full",
          hasMessages && "transition-transform duration-300 ease-in-out",
        )}
        style={{ width: "600px" }}
      >
        {hasArtifacts && <ArtifactCanvas />}
      </div>

      {/* Main chat area - container that slides left when canvas opens */}
      <div
        className={cn(
          "relative flex-1 transition-all duration-300 ease-in-out",
          isCanvasOpen && "mr-[600px]",
          !hasMessages && "flex items-center justify-center",
        )}
      >
        {hasMessages ? (
          <>
            {/* Conversation view - messages with absolute positioning for proper height */}
            <div className="absolute inset-0 flex flex-col">
              <div
                className={cn(
                  "fixed left-0 z-50 shrink-0 transition-all duration-300 ease-in-out",
                  isCanvasOpen ? "right-[600px]" : "right-0",
                )}
              >
                <div className="bg-background/80 dark:bg-background/50 backdrop-blur-sm p-2 pt-6">
                  <ChatHeader />
                </div>
              </div>
              <Conversation>
                <ConversationContent className="pb-48 pt-14">
                  <div className="max-w-2xl mx-auto w-full">
                    <ChatMessages
                      messages={messages}
                      isStreaming={
                        status === "streaming" || status === "submitted"
                      }
                    />
                    <ChatStatusIndicators
                      agentStatus={agentStatus}
                      currentToolCall={currentToolCall}
                      status={status}
                    />
                  </div>
                </ConversationContent>
                <ConversationScrollButton
                  className={cn(hasSuggestions ? "bottom-52" : "bottom-42")}
                />
              </Conversation>
            </div>

            {/* Fixed input at bottom - respects parent container boundaries */}
            <div
              className={cn(
                "fixed bottom-0 left-0 z-50 transition-all duration-300 ease-in-out",
                isCanvasOpen ? "right-[600px]" : "right-0",
              )}
            >
              <div className="w-full pb-4 max-w-2xl mx-auto">
                <SuggestedPrompts delay={1} />
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
