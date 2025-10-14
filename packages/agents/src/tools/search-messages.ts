import { tool } from "ai";
import { z } from "zod";
import type { MemoryProvider } from "@ai-sdk-tools/memory";

/**
 * Create a message search tool that allows agents to search through
 * conversation history for specific information.
 *
 * This tool enables agents to find relevant information from previous conversations
 * without having to remember everything or ask the user again.
 */
export function createSearchMessagesTool(
  provider: MemoryProvider,
  defaultScope: "chat" | "user" = "chat"
) {
  return tool({
    description:
      "Search through conversation history to find relevant information from previous messages. Use this when you need to reference something the user mentioned earlier or find specific details from past conversations.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The search query to find in conversation history"),
      scope: z
        .enum(["chat", "user"])
        .optional()
        .default(defaultScope)
        .describe(
          "Where to search: 'chat' for current conversation only, 'user' for all chats by this user"
        ),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of results to return"),
    }),
    execute: async ({ query, scope, limit }, executionOptions) => {
      try {
        // Extract context from execution options
        const context = executionOptions?.experimental_context as
          | Record<string, any>
          | undefined;
        if (!context) {
          return {
            success: false,
            error: "Execution context not available",
          };
        }

        // Get chatId and userId from context
        const chatId = context.chatId || context.metadata?.chatId;
        const userId = context.userId || context.metadata?.userId;

        // Map the public scope values to internal values
        const internalScope = scope === "user" ? "user_chats" : "current_chat";

        if (!chatId && internalScope === "current_chat") {
          return {
            success: false,
            error: "Chat ID not available in context",
          };
        }

        // Use the searchMessages method if available, otherwise fall back to getMessages + filter
        if ((provider as any).searchMessages) {
          try {
            const messages = await (provider as any).searchMessages({
              chatId: internalScope === "current_chat" ? chatId : undefined,
              userId: internalScope === "user_chats" ? userId : undefined,
              query,
              limit,
            });

            return {
              success: true,
              results: messages.map((msg: any) => ({
                content: msg.content,
                role: msg.role,
                timestamp: msg.timestamp.toISOString(),
              })),
              count: messages.length,
            };
          } catch (error) {
            // Fall back to manual search if native search fails
            console.warn(
              "Native search failed, falling back to manual search",
              error
            );
          }
        }

        // Fallback: Get messages and filter manually
        if (internalScope === "current_chat" && chatId) {
          const messages =
            (await provider.getMessages?.({
              chatId,
              limit: limit || 100,
            })) || [];

          const filtered = messages.filter((message: any) =>
            message.content.toLowerCase().includes(query.toLowerCase())
          );

          return {
            success: true,
            results: filtered.map((msg: any) => ({
              content: msg.content,
              role: msg.role,
              timestamp: msg.timestamp.toISOString(),
            })),
            count: filtered.length,
          };
        } else if (internalScope === "user_chats" && userId) {
          // For user_chats scope, we'd need to get all chats for the user
          // This is more complex and would require additional implementation
          // For now, we'll just return an error
          return {
            success: false,
            error: "User chats search not implemented in fallback mode",
          };
        }

        return {
          success: false,
          error: "Invalid scope or missing required context",
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
  });
}
