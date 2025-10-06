import { z } from "zod";

export const getBurnRateSchema = z.object({
  from: z.string().describe("Start date in YYYY-MM-DD format"),
  to: z.string().describe("End date in YYYY-MM-DD format"),
  currency: z.string().optional().describe("Currency code (USD, EUR, SEK, etc.)"),
  showCanvas: z.boolean().optional().describe("Whether to show the analysis canvas"),
});
