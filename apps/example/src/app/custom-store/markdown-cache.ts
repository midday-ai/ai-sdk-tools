import type { UIMessage } from "ai";
import { marked } from "marked";
import { parseIncompleteMarkdown } from "@/components/ai-elements/parse-incomplete-markdown";

export type MarkdownCacheEntry = {
  text: string;
  blocks: string[];
};

function lexToBlocks(text: string): string[] {
  const tokens = marked.lexer(text);
  return tokens.map((t) => t.raw);
}

function getMarkdownCacheKey({
  messageId,
  partIdx,
}: {
  messageId: string;
  partIdx: number;
}): string {
  return `${messageId}:${partIdx}`;
}

function computeCacheEntry({
  cache,
  messageId,
  partIdx,
  text,
  preparedText,
}: {
  cache: Map<string, MarkdownCacheEntry>;
  messageId: string;
  partIdx: number;
  text: string;
  preparedText?: string;
}): void {
  const input = preparedText ?? text;
  const blocks = lexToBlocks(input);
  const key = getMarkdownCacheKey({ messageId, partIdx });
  cache.set(key, { text, blocks });
}

function ensureCacheForPart({
  cache,
  messageId,
  partIdx,
  text,
  preparedText,
}: {
  cache: Map<string, MarkdownCacheEntry>;
  messageId: string;
  partIdx: number;
  text: string;
  preparedText?: string;
}): void {
  const key = getMarkdownCacheKey({ messageId, partIdx });
  const cached = cache.get(key);
  if (cached && cached.text === text) {
    return;
  }
  computeCacheEntry({
    cache,
    messageId,
    partIdx,
    text,
    preparedText,
  });
}

export function getMarkdownFromCache({
  cache,
  messageId,
  partIdx,
  text,
}: {
  cache: Map<string, MarkdownCacheEntry>;
  messageId: string;
  partIdx: number;
  text: string;
}): MarkdownCacheEntry | null {
  const key = getMarkdownCacheKey({ messageId, partIdx });
  const entry = cache.get(key);
  if (entry && entry.text === text) {
    return entry;
  }
  return null;
}

function precomputeMarkdownForMessage(
  message: UIMessage,
  cache: Map<string, MarkdownCacheEntry>,
): void {
  const messageId = message.id;
  const parts = message.parts;

  if (message.role === "user") {
    return;
  }

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p || p.type !== "text") {
      continue;
    }
    const text = p.text;

    ensureCacheForPart({ cache, messageId, partIdx: i, text });
  }
}

export function precomputeMarkdownForAllMessages(
  messages: UIMessage[],
  existingCache?: Map<string, MarkdownCacheEntry>,
): {
  cache: Map<string, MarkdownCacheEntry>;
} {
  const cache = existingCache
    ? new Map(existingCache)
    : new Map<string, MarkdownCacheEntry>();

  // Stable caches for all assistant messages
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || msg.role !== "assistant") {
      continue;
    }
    precomputeMarkdownForMessage(msg, cache);
  }

  // Streaming target: last assistant message's last text part
  const lastMessage = messages.length > 0 ? messages.at(-1) : null;
  if (lastMessage && lastMessage.role === "assistant") {
    const parts = lastMessage.parts;
    if (parts.length > 0) {
      const lastPartIdx = parts.length - 1;
      const lastPart = parts[lastPartIdx];
      if (lastPart && lastPart.type === "text") {
        const text = lastPart.text || "";
        ensureCacheForPart({
          cache,
          messageId: lastMessage.id,
          partIdx: lastPartIdx,
          text,
          preparedText: parseIncompleteMarkdown(text),
        });
      }
    }
  }

  return { cache };
}
