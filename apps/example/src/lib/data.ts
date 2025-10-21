import type { Message } from "ai";
import { generateId } from "ai";
import { memoryProvider } from "@/ai/agents/shared";

export async function loadChatHistory(chatId: string): Promise<Message[]> {
  try {
    if (!memoryProvider.getMessages) {
      return [];
    }

    const messages = await memoryProvider.getMessages({
      chatId,
      limit: 50,
    });

    if (!messages || messages.length === 0) {
      return [];
    }

    return messages.map((msg) => {
      const content = msg.content || "";

      // Try to parse content as complete UIMessage object
      try {
        const parsed = JSON.parse(content);

        // If it's a complete message object with parts, use it directly
        if (parsed.parts && parsed.id && parsed.role) {
          return {
            ...parsed,
            createdAt: parsed.createdAt
              ? new Date(parsed.createdAt)
              : new Date(),
          };
        }

        // Fallback: if it's just a parts array, construct a message
        if (Array.isArray(parsed)) {
          return {
            id: msg.id || generateId(),
            role: msg.role,
            content,
            parts: parsed,
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          };
        }
      } catch {
        // If parsing fails, treat as plain text (legacy format)
      }
    });
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
}
