import { tool } from "ai";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateRunwayMetrics } from "@/ai/utils/fake-data";

/**
 * Runway Metrics Tool
 *
 * Calculates how long the company can operate with current burn rate.
 */
export const runwayMetricsTool = tool({
  description: `Get runway metrics showing how long the company can operate with current burn rate`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema),

  execute: async ({ from, to, currency }) => {
    // Generate realistic fake data for development
    return generateRunwayMetrics({ from, to, currency });
  },
});
