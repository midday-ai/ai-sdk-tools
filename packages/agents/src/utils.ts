import { isToolUIPart, type ModelMessage, type UIMessage } from "ai";

/**
 * Extract text content from a ModelMessage.
 * Handles both string content and content arrays with text parts.
 *
 * @param message - The message to extract text from
 * @returns The extracted text content, or an empty string if none found
 *
 * @example
 * ```ts
 * const text = extractTextFromMessage(message);
 * // "Hello world"
 * ```
 */
export function extractTextFromMessage(
  message: ModelMessage | undefined,
): string {
  if (!message?.content) return "";

  const { content } = message;

  // String content
  if (typeof content === "string") return content;

  // Array of parts - extract all text parts and join them
  if (Array.isArray(content)) {
    return content
      .filter(
        (part): part is { type: "text"; text: string } =>
          typeof part === "object" && part !== null && part.type === "text",
      )
      .map((part) => part.text)
      .join("");
  }

  return "";
}

/**
 * Strip metadata from UI messages to prevent duplicate ID errors.
 * Provider metadata (like OpenAI item IDs) should not be reused across API calls.
 */
export function stripMetadata(messages: UIMessage[]): UIMessage[] {
  return messages.map((msg) => ({
    ...msg,
    parts: msg.parts?.map((part) => {
      const sanitizedPart: typeof part = { ...part };

      if ("providerMetadata" in sanitizedPart) {
        sanitizedPart.providerMetadata = undefined;
      }

      if (
        isToolUIPart(sanitizedPart) &&
        "callProviderMetadata" in sanitizedPart
      ) {
        sanitizedPart.callProviderMetadata = undefined;
      }

      return sanitizedPart;
    }),
  }));
}
