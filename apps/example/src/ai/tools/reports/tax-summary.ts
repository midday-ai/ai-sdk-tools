import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateTaxSummary } from "@/ai/utils/fake-data";

/**
 * Tax Summary Tool
 *
 * Provides tax summary and analysis with:
 * - Tax liability estimates
 * - Deductible expenses
 * - Tax category breakdown
 * - Quarterly estimates
 */
export const taxSummaryTool = tool({
  description: `Get tax summary and estimates for a specified period`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    taxType: z
      .enum(["income", "sales", "payroll", "property", "all"])
      .optional()
      .describe("Type of tax to summarize"),
  }),

  execute: async ({ from, to, currency, taxType = "all" }) => {
    return generateTaxSummary({ from, to, currency, taxType });
  },
});
