"use client";

import { useArtifacts } from "@ai-sdk-tools/artifacts/client";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useChat, useChatActions, useDataPart } from "@ai-sdk-tools/store";
import type { ToolUIPart } from "ai";
import { DefaultChatTransport } from "ai";
import { type RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { ArtifactCanvas } from "@/components/canvas";
import {
  ChatHeader,
  ChatInput,
  ChatMessages,
  ChatStatusIndicators,
  ChatTitle,
  EmptyState,
  RateLimitIndicator,
} from "@/components/chat";
import type { AgentStatus } from "@/types/agents";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // Only send the last message - agent loads history from memory
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
          },
        };
      },
    }),
  });

  // Extract agent status data part
  const agentStatusData = useDataPart<AgentStatus>("agent-status");

  // Clear status immediately when completing (smoother UX)
  const agentStatus =
    agentStatusData?.status === "completing" ? null : agentStatusData;

  const { reset } = useChatActions();

  // Derive current tool call directly from messages (no state needed!)
  const currentToolCall = (() => {
    if (messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") return null;

    // Check if we have any text content yet
    const textParts = lastMessage.parts.filter((part) => part.type === "text");
    const hasTextContent = textParts.some((part) => {
      const textPart = part as { text?: string };
      return textPart.text?.trim();
    });

    // If we already have text, don't show tool shimmer
    if (hasTextContent) return null;

    // Find tool parts
    const toolParts = lastMessage.parts.filter((part) =>
      part.type.startsWith("tool-"),
    ) as ToolUIPart[];

    // Show the most recent tool (they're ordered, so get the last one)
    const latestTool = toolParts[toolParts.length - 1];
    if (!latestTool) return null;

    // Extract tool name from type (e.g., "tool-burnRate" -> "burnRate")
    const toolType = latestTool.type as string;
    if (toolType === "dynamic-tool") {
      // Dynamic tools have a toolName property
      const dynamicTool = latestTool as unknown as { toolName: string };
      return dynamicTool.toolName;
    }
    return toolType.replace(/^tool-/, "");
  })();

  const { artifacts } = useArtifacts();
  const hasArtifacts = artifacts && artifacts.length > 0;
  const hasMessages = messages.length > 0;

  const handleCloseCanvas = () => {
    stop();
    reset();
  };

  const handleSubmit = (message: PromptInputMessage) => {
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

    sendMessage({ text: message.text || "Sent with attachments" });
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
            <div className="flex-1 max-w-2xl mx-auto w-full pb-38">
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
                {chatInput}
              </div>
            </div>
          </>
        ) : (
          <EmptyState>{chatInput}</EmptyState>
        )}
      </div>

      {process.env.NODE_ENV === "development" && (
        <AIDevtools modelId="gpt-4o-mini" />
      )}

      {/* {!hasMessages && (
        <a
          href="https://midday.ai?utm_source=ai-sdk-tools"
          target="_blank"
          rel="noopener"
        >
          <div className="absolute bottom-3 right-0 left-0 flex justify-center items-center gap-2">
            <span className="text-xs text-muted-foreground/60">Made by</span>
            <Logo />
          </div>
        </a>
      )} */}
    </div>
  );
}
