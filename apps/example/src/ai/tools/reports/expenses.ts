import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateExpensesMetrics } from "@/ai/utils/fake-data";

/**
 * Expenses Analysis Tool
 *
 * Provides expense tracking and analysis with:
 * - Total expenses
 * - Recurring vs one-time expenses
 * - Category breakdown
 * - Trend analysis
 */
export const expensesTool = tool({
  description: `Get expense analysis for a specified period`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    recurring: z
      .boolean()
      .optional()
      .describe("Filter for recurring expenses only"),
    category: z.string().optional().describe("Filter by expense category"),
  }),

  execute: async ({ from, to, currency, recurring, category }) => {
    return generateExpensesMetrics({
      from,
      to,
      currency,
      recurring,
      category,
    });
  },
});
