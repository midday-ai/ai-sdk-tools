import { tool } from "ai";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateProfitLossMetrics } from "@/ai/utils/fake-data";

/**
 * Profit & Loss (P&L) Tool
 *
 * Generates profit and loss statements for financial reporting.
 */
export const profitLossTool = tool({
  description: `Get profit and loss (P&L) metrics for a specified date range`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema),

  execute: async ({ from, to, currency }) => {
    // Generate realistic fake data for development
    return generateProfitLossMetrics({ from, to, currency });
  },
});
