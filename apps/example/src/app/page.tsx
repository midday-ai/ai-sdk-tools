"use client";

import type { ToolUIPart } from "ai";
import { DefaultChatTransport } from "ai";
import {
  useArtifacts,
  useChat,
  useChatActions,
  useDataPart,
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
} from "@/components/chat";
import type { AgentStatus } from "@/types/agents";

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

    // Find actual tool call parts (not step-start or other events)
    // Include tool-input-start to show active tool calls
    const toolParts = lastMessage.parts.filter((part) => {
      const type = part.type;
      // Include tool-input-start (active calls) and other tool parts, but exclude deltas and intermediate events
      return type.startsWith("tool-") && 
             type !== "tool-input-delta" && 
             type !== "tool-input-available" &&
             type !== "tool-output-available";
    }) as ToolUIPart[];

    // Find the most recent tool that's still running (no output yet)
    let latestRunningTool = null;
    for (let i = toolParts.length - 1; i >= 0; i--) {
      const tool = toolParts[i];
      const toolWithMeta = tool as any;
      const type = tool.type as string;
      
      // tool-input-start events are active tool calls
      if (type === "tool-input-start") {
        latestRunningTool = tool;
        break;
      }
      
      // Other tool parts are running if they don't have output/result yet
      if (!toolWithMeta.output && !toolWithMeta.result && !toolWithMeta.errorText) {
        latestRunningTool = tool;
        break;
      }
    }

    // If we have a running tool, show it
    if (latestRunningTool) {
      const toolType = latestRunningTool.type as string;
      const toolWithMeta = latestRunningTool as any;
      
      // For tool-input-start, get the toolName property
      if (toolType === "tool-input-start" && toolWithMeta.toolName) {
        return toolWithMeta.toolName;
      }
      
      if (toolType === "dynamic-tool") {
        const dynamicTool = latestRunningTool as unknown as { toolName: string };
        return dynamicTool.toolName;
      }
      return toolType.replace(/^tool-/, "");
    }

    // If we have text content but no running tools, hide the indicator
    if (hasTextContent) return null;

    // If no running tools but also no text yet, show the most recent completed tool
    const latestTool = toolParts[toolParts.length - 1];
    if (!latestTool) return null;

    const toolType = latestTool.type as string;
    if (toolType === "dynamic-tool") {
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
    </div>
  );
}
