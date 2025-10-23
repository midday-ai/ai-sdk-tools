"use client";

import type { ChatStatus, ToolUIPart, UIMessage } from "ai";
import { useDataPart } from "ai-sdk-tools/client";
import { useMemo } from "react";
import type { AgentStatus } from "@/types/agents";

interface ChatStatusResult {
  agentStatus: AgentStatus | null;
  currentToolCall: string | null;
  currentToolInput: any | null;
  hasTextContent: boolean;
}

/**
 * Hook to derive chat status indicators from messages and streaming state.
 *
 * This hook manages the logic for showing agent status and tool messages:
 * - Agent status: shown when routing or executing (before content starts)
 * - Tool message: shown when a tool is actively running
 * - Hidden: when text content is streaming or chat is ready
 */
export function useChatStatus(
  messages: UIMessage[],
  status: ChatStatus,
): ChatStatusResult {
  const [agentStatusData] = useDataPart<AgentStatus>("agent-status");

  const result = useMemo(() => {
    if (messages.length === 0) {
      return {
        agentStatus: agentStatusData,
        currentToolCall: null,
        currentToolInput: null,
        hasTextContent: false,
      };
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") {
      return {
        agentStatus: agentStatusData,
        currentToolCall: null,
        currentToolInput: null,
        hasTextContent: false,
      };
    }

    // Check if we have text content streaming
    const textParts = lastMessage.parts.filter((part) => part.type === "text");
    const hasTextContent = textParts.some((part) => {
      const textPart = part as { text?: string };
      return textPart.text?.trim();
    });

    const _textLength = textParts.reduce((acc, part) => {
      const textPart = part as { text?: string };
      return acc + (textPart.text?.length || 0);
    }, 0);

    // Find active tool calls - check ALL tool-related parts
    const allParts = lastMessage.parts;

    const toolParts = allParts.filter((part) => {
      const type = part.type;
      return type.startsWith("tool-");
    }) as ToolUIPart[];

    // Find the most recent running tool and extract metadata
    let currentToolCall: string | null = null;
    let currentToolInput: any = null;
    let _toolMetadata: any = null;

    for (let i = toolParts.length - 1; i >= 0; i--) {
      const tool = toolParts[i];
      const toolWithMeta = tool as any;
      const type = tool.type as string;

      // Extract tool name from type (e.g., "tool-webSearch" -> "webSearch")
      const toolName =
        type === "dynamic-tool"
          ? toolWithMeta.toolName
          : type.replace(/^tool-/, "");

      // Always detect the tool if we haven't found one yet
      if (!currentToolCall) {
        currentToolCall = toolName;
        currentToolInput = toolWithMeta.input || null;
        _toolMetadata = toolWithMeta;
      }
    }

    // Hide tool when text starts streaming or when complete
    if (currentToolCall && (hasTextContent || status === "ready")) {
      currentToolCall = null;
      currentToolInput = null;
      _toolMetadata = null;
    }

    // Hide agent status when streaming text, when complete, or when tool is showing
    const agentStatus =
      status === "ready" || hasTextContent || currentToolCall
        ? null
        : agentStatusData;

    return {
      agentStatus,
      currentToolCall,
      currentToolInput,
      hasTextContent,
    };
  }, [messages, status, agentStatusData]);

  return result;
}
