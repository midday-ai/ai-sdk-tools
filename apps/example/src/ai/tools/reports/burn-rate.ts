import { tool } from "ai";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateBurnRateMetrics } from "@/ai/utils/fake-data";

/**
 * Burn Rate Metrics Tool
 *
 * Tracks monthly cash consumption and spending velocity.
 */
export const burnRateMetricsTool = tool({
  description: `Get burn rate metrics showing monthly cash consumption.
  
Capabilities:
- Monthly burn rate
- Net burn vs gross burn
- Burn rate trends
- Efficiency metrics`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema),

  execute: async ({ from, to, currency }) => {
    // Generate realistic fake data for development
    return generateBurnRateMetrics({ from, to, currency });
  },
});
