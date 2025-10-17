import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateCashFlowMetrics } from "@/ai/utils/fake-data";

/**
 * Cash Flow Analysis Tool
 *
 * Provides cash flow statements and analysis with:
 * - Operating activities
 * - Investing activities
 * - Financing activities
 * - Net cash flow
 */
export const cashFlowTool = tool({
  description: `Get cash flow statement and analysis for a specified period`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    categories: z
      .array(z.enum(["operating", "investing", "financing"]))
      .optional()
      .describe("Specific cash flow categories to include"),
  }),

  execute: async ({ from, to, currency, categories }) => {
    return generateCashFlowMetrics({ from, to, currency, categories });
  },
});
