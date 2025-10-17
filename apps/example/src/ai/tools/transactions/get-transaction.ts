import { tool } from "ai";
import { z } from "zod";
import { generateTransaction } from "@/ai/utils/fake-data";

/**
 * Get Transaction Tool
 *
 * Retrieve detailed information about a specific transaction.
 */
export const getTransactionTool = tool({
  description: `Get details of a specific transaction`,

  inputSchema: z.object({
    id: z.string().describe("Transaction ID (UUID)"),
  }),

  execute: async ({ id }) => {
    // Generate realistic fake data for development
    return generateTransaction(id);
  },
});
