import { tool } from "ai";
import { z } from "zod";
import { dateRangeSchema } from "@/ai/types/filters";
import { generateCustomerProfitability } from "@/ai/utils/fake-data";

export const customerProfitabilityTool = tool({
  description: `Analyze customer profitability using revenue, costs, and tags`,

  inputSchema: z
    .object({
      customerId: z.string().describe("Customer ID to analyze"),
    })
    .merge(dateRangeSchema),

  execute: async (params) => generateCustomerProfitability(params),
});
