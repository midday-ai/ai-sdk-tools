"use client";

import { useMemo } from "react";
import type { UIMessage, ToolUIPart } from "ai";
import type { ChatStatus } from "ai";
import { useDataPart } from "ai-sdk-tools/client";
import type { AgentStatus } from "@/types/agents";

interface ChatStatusResult {
  agentStatus: AgentStatus | null;
  currentToolCall: string | null;
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
        hasTextContent: false,
      };
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") {
      return {
        agentStatus: agentStatusData,
        currentToolCall: null,
        hasTextContent: false,
      };
    }

    // Check if we have text content streaming
    const textParts = lastMessage.parts.filter((part) => part.type === "text");
    const hasTextContent = textParts.some((part) => {
      const textPart = part as { text?: string };
      return textPart.text?.trim();
    });

    // Find active tool calls
    const toolParts = lastMessage.parts.filter((part) => {
      const type = part.type;
      return (
        type.startsWith("tool-") &&
        type !== "tool-input-delta" &&
        type !== "tool-input-available" &&
        type !== "tool-output-available"
      );
    }) as ToolUIPart[];

    // Find the most recent running tool
    let currentToolCall: string | null = null;
    for (let i = toolParts.length - 1; i >= 0; i--) {
      const tool = toolParts[i];
      const toolWithMeta = tool as any;
      const type = tool.type as string;

      if (type === "tool-input-start") {
        currentToolCall = toolWithMeta.toolName || type.replace(/^tool-/, "");
        break;
      }

      if (!toolWithMeta.output && !toolWithMeta.result && !toolWithMeta.errorText) {
        if (type === "dynamic-tool") {
          currentToolCall = toolWithMeta.toolName;
        } else {
          currentToolCall = type.replace(/^tool-/, "");
        }
        break;
      }
    }

    // If we have text content, hide tool indicator (but keep for next time)
    if (hasTextContent) {
      currentToolCall = null;
    }

    // Hide agent status when streaming text or when complete
    const agentStatus = status === "ready" || hasTextContent ? null : agentStatusData;

    return {
      agentStatus,
      currentToolCall,
      hasTextContent,
    };
  }, [messages, status, agentStatusData]);

  return result;
}

