import { tool } from "ai";
import { z } from "zod";
import { generateBalances } from "@/ai/utils/fake-data";

export const getBalancesTool = tool({
  description: `Get account balances across all accounts or by specific account`,

  inputSchema: z.object({
    accountId: z.string().optional().describe("Specific account ID (optional)"),
    baseCurrency: z
      .string()
      .optional()
      .default("USD")
      .describe("Base currency for total calculation"),
  }),

  execute: async (params) => generateBalances(params),
});
