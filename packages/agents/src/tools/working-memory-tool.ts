import type { MemoryConfig } from "@ai-sdk-tools/memory";
import { tool } from "ai";
import { z } from "zod";
import { getContext } from "../context.js";

/**
 * Create updateWorkingMemory tool
 * Auto-injected when memory is enabled
 */
export function createWorkingMemoryTool(memoryConfig: MemoryConfig) {
  const workingMemoryConfig = memoryConfig.workingMemory!;

  return tool({
    description: "Remember important information for later in the conversation",
    inputSchema: z.object({
      content: z
        .string()
        .describe("Updated working memory following the template structure"),
    }),
    execute: async ({ content }, options) => {
      const ctx = getContext(
        options as { experimental_context?: Record<string, unknown> }
      );
      const chatId = (ctx?.metadata as Record<string, unknown>)?.chatId as
        | string
        | undefined;
      const userId = (ctx?.metadata as Record<string, unknown>)?.userId as
        | string
        | undefined;

      await memoryConfig.provider.updateWorkingMemory({
        chatId,
        userId,
        scope: workingMemoryConfig.scope,
        content,
      });

      return { success: true };
    },
  });
}
