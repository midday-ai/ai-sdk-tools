"use client";

import { useDataPart } from "@ai-sdk-tools/store";
import type { LanguageModelUsage } from "ai";
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextCacheUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";

// Model ID for cost calculation (Claude Sonnet 4)
const MODEL_ID = "anthropic/claude-sonnet-4-20250514";
const MAX_TOKENS = 200_000; // Claude Sonnet context window

interface UsageDataPart {
  usage: LanguageModelUsage;
}

export function TokenUsage() {
  const [usageData] = useDataPart<UsageDataPart>("usage");

  if (!usageData?.usage) {
    return null;
  }

  const { usage } = usageData;
  const totalTokens = usage.totalTokens ?? 0;

  if (totalTokens === 0) {
    return null;
  }

  return (
    <Context
      usedTokens={totalTokens}
      maxTokens={MAX_TOKENS}
      usage={usage}
      modelId={MODEL_ID}
    >
      <ContextTrigger className="h-7 px-2 text-xs" />
      <ContextContent align="end" side="bottom">
        <ContextContentHeader />
        <ContextContentBody className="space-y-1.5">
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  );
}

