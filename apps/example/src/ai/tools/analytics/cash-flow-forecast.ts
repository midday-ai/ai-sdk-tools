import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema } from "@/ai/types/filters";
import { generateCashFlowForecast } from "@/ai/utils/fake-data";

export const cashFlowForecastTool = tool({
  description: `Forecast future cash flow based on historical data and unpaid invoices`,

  inputSchema: z
    .object({
      forecastMonths: z
        .number()
        .min(1)
        .max(12)
        .default(3)
        .describe("Number of months to forecast (1-12)"),
      includeConfidenceIntervals: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include confidence intervals in forecast"),
    })
    .merge(currencyFilterSchema),

  execute: async (params) => generateCashFlowForecast(params),
});
