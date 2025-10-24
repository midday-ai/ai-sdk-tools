"use client";

import type { UIMessage } from "ai";
import { FaviconStack } from "@/components/ai-elements/favicon-stack";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming?: boolean;
}

interface SourceItem {
  url: string;
  title: string;
  publishedDate?: string;
}

interface WebSearchToolOutput {
  sources?: SourceItem[];
}

/**
 * Extract sources from webSearch tool results
 * Sources are already deduplicated by the tool
 */
function extractWebSearchSources(parts: UIMessage["parts"]): SourceItem[] {
  const sources: SourceItem[] = [];

  for (const part of parts) {
    const type = part.type as string;
    if (type === "tool-webSearch") {
      const output = (part as { output?: WebSearchToolOutput }).output;
      if (output?.sources) {
        sources.push(...output.sources);
      }
    }
  }

  return sources;
}

/**
 * Extract source-url parts from AI SDK
 */
function extractAiSdkSources(parts: UIMessage["parts"]): SourceItem[] {
  const sources: SourceItem[] = [];

  for (const part of parts) {
    if (part.type === "source-url") {
      const sourcePart = part as { url: string; title?: string };
      sources.push({
        url: sourcePart.url,
        title: sourcePart.title || sourcePart.url,
      });
    }
  }

  return sources;
}

export function ChatMessages({
  messages,
  isStreaming = false,
}: ChatMessagesProps) {
  return (
    <>
      {messages.map(({ parts, ...message }, index) => {
        // Extract text parts
        const textParts = parts.filter((part) => part.type === "text");
        const textContent = textParts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("");

        // Extract sources from AI SDK and webSearch
        const aiSdkSources = extractAiSdkSources(parts);

        // Extract sources from webSearch tool results (already deduplicated)
        const webSearchSources = extractWebSearchSources(parts);

        // Combine sources and deduplicate between AI SDK and webSearch sources
        const allSources = [...aiSdkSources, ...webSearchSources];
        const uniqueSources = allSources.filter(
          (source, index, self) =>
            index === self.findIndex((s) => s.url === source.url),
        );

        // Check if this is the last (currently streaming) message
        const isLastMessage = index === messages.length - 1;

        // Show sources only after response is finished (not on the currently streaming message)
        const shouldShowSources =
          uniqueSources.length > 0 &&
          message.role === "assistant" &&
          (!isLastMessage || !isStreaming);

        return (
          <div key={message.id}>
            {/* Render text content in message */}
            {textParts.length > 0 && (
              <Message from={message.role}>
                <MessageContent variant="flat" className="max-w-[80%]">
                  <Response>{textContent}</Response>
                </MessageContent>
              </Message>
            )}

            {/* Render sources as stacked favicons - show immediately when available */}
            {shouldShowSources && (
              <div className="max-w-[80%]">
                <FaviconStack sources={uniqueSources} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
