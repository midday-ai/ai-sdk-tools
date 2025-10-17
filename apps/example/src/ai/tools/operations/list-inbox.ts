import { tool } from "ai";
import { z } from "zod";
import { generateInboxItems } from "@/ai/utils/fake-data";

export const listInboxItemsTool = tool({
  description: `List items in the inbox (receipts, documents awaiting processing)`,

  inputSchema: z.object({
    status: z
      .enum(["pending", "done", "all"])
      .optional()
      .default("pending")
      .describe("Filter by processing status"),
    pageSize: z.number().min(1).max(100).optional().default(20),
  }),

  execute: async (params) => generateInboxItems(params),
});
