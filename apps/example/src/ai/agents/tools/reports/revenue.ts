import { tool } from "ai";
import { currencyFilterSchema, dateRangeSchema } from "../../types/filters";
import { generateRevenueMetrics } from "../../utils/fake-data";

/**
 * Revenue Metrics Tool
 *
 * Provides revenue analysis and metrics for a specified time period.
 */
export const revenueMetricsTool = tool({
  description: `Get revenue metrics for a specified date range.
  
Capabilities:
- Total revenue for period
- Revenue by source/category
- Period-over-period comparison
- Revenue trends`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema),

  execute: async ({ from, to, currency }) => {
    // Generate realistic fake data for development
    return generateRevenueMetrics({ from, to, currency });
  },
});
