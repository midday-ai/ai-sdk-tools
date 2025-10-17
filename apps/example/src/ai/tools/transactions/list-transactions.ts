import { tool } from "ai";
import { z } from "zod";
import { generateTransactions } from "@/ai/utils/fake-data";

/**
 * List Transactions Tool
 *
 * Query transactions with comprehensive filtering options.
 */
export const listTransactionsTool = tool({
  description: `List transactions`,

  inputSchema: z.object({
    pageSize: z
      .number()
      .min(1)
      .max(10000)
      .optional()
      .describe("Number of transactions per page (1-10000)"),
    start: z
      .string()
      .optional()
      .describe("Start date (inclusive) in ISO 8601 format"),
    end: z
      .string()
      .optional()
      .describe("End date (inclusive) in ISO 8601 format"),
    accounts: z
      .array(z.string())
      .optional()
      .describe("Filter by bank account IDs"),
    categories: z
      .array(z.string())
      .optional()
      .describe("Filter by category slugs"),
    statuses: z
      .array(z.string())
      .optional()
      .describe(
        "Filter by status: pending, completed, archived, posted, excluded",
      ),
    type: z
      .enum(["income", "expense"])
      .optional()
      .describe("Transaction type: income or expense"),
    q: z
      .string()
      .optional()
      .describe("Search query for transaction name or description"),
  }),

  execute: async (params) => {
    // Generate realistic fake data for development
    return generateTransactions({
      pageSize: params.pageSize,
      start: params.start,
      end: params.end,
      type: params.type,
    });
  },
});
