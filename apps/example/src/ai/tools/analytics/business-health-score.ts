import { tool } from "ai";
import { z } from "zod";
import { generateBusinessHealthScore } from "@/ai/utils/fake-data";

export const businessHealthScoreTool = tool({
  description: `Calculate comprehensive business health score based on key metrics.`,

  inputSchema: z.object({
    includeRecommendations: z
      .boolean()
      .optional()
      .default(true)
      .describe("Include actionable recommendations"),
  }),

  execute: async (params) => generateBusinessHealthScore(params),
});
