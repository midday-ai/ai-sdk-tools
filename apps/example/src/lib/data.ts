import type { UIMessage } from "@ai-sdk/react";
import { memoryProvider } from "@/ai/agents/shared";

export async function loadChatHistory(chatId: string): Promise<UIMessage[]> {
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

    return messages;
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
}
