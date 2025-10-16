"use client";

import { Loader } from "@/components/ai-elements/loader";
import { AnimatedStatus } from "@/components/ui/animated-status";
import { getStatusMessage, getToolMessage } from "@/lib/agent-utils";
import { getToolIcon } from "@/lib/tool-config";
import type { AgentStatus } from "@/types/agents";

interface ChatStatusIndicatorsProps {
  agentStatus: AgentStatus | null;
  currentToolCall: string | null;
  status?: string;
}

export function ChatStatusIndicators({
  agentStatus,
  currentToolCall,
  status,
}: ChatStatusIndicatorsProps) {
  const statusMessage = getStatusMessage(agentStatus);
  const toolMessage = getToolMessage(currentToolCall);

  // Prioritize tool message over agent status
  const displayMessage = toolMessage || statusMessage;

  // Get icon for current tool
  const toolIcon = currentToolCall ? getToolIcon(currentToolCall) : null;

  return (
    <>
      <AnimatedStatus
        text={displayMessage}
        shimmerDuration={0.75}
        fadeDuration={0.2}
        variant="fade"
        className="text-xs font-normal"
        showBorder={false}
        icon={toolIcon}
      />

      {((agentStatus && !getStatusMessage(agentStatus)) ||
        (status === "submitted" && !agentStatus && !currentToolCall)) && (
        <Loader />
      )}
    </>
  );
}
