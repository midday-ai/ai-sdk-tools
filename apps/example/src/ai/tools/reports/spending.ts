import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateSpendingMetrics } from "@/ai/utils/fake-data";

/**
 * Spending Analysis Tool
 *
 * Provides comprehensive spending breakdown with:
 * - General overview
 * - Category-wise breakdown
 * - Time series analysis
 * - Comparison with previous periods
 */
export const spendingMetricsTool = tool({
  description: `Get comprehensive spending analysis and breakdown`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    breakdown: z
      .enum(["general", "category", "merchant", "tag"])
      .optional()
      .describe("Type of breakdown: general, category, merchant, or tag"),
  }),

  execute: async ({ from, to, currency, breakdown = "general" }) => {
    // Generate realistic fake data for development
    return generateSpendingMetrics({ from, to, currency, breakdown });
  },
});
