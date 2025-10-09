"use client";

import { Loader } from "@/components/ai-elements/loader";
import { AnimatedStatusText } from "@/components/ui/animated-status-text";
import { getStatusMessage, getToolMessage } from "@/lib/agent-utils";
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

  return (
    <>
      {/* Show shimmer for specialist agents executing */}
      <AnimatedStatusText
        text={statusMessage}
        shimmerDuration={1}
        fadeDuration={0.2}
        variant="slide"
        className="text-xs font-normal"
      />
      {/* Show tool call status */}
      <AnimatedStatusText
        text={toolMessage}
        shimmerDuration={1}
        fadeDuration={0.2}
        variant="slide"
        className="text-xs font-normal"
      />
      {/* Show plain loader for orchestrator/general */}
      {((agentStatus && !getStatusMessage(agentStatus)) ||
        (status === "submitted" && !agentStatus && !currentToolCall)) && (
        <Loader />
      )}
    </>
  );
}
