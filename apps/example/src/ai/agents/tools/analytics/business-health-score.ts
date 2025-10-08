import { tool } from "ai";
import { z } from "zod";
import { generateBusinessHealthScore } from "../../utils/fake-data";

export const businessHealthScoreTool = tool({
  description: `Calculate comprehensive business health score based on key metrics.
  
Analyzes:
- Cash flow health
- Revenue stability
- Expense management
- Growth trajectory
- Overall health score (0-100)`,

  inputSchema: z.object({
    includeRecommendations: z
      .boolean()
      .optional()
      .default(true)
      .describe("Include actionable recommendations"),
  }),

  execute: async (params) => generateBusinessHealthScore(params),
});
