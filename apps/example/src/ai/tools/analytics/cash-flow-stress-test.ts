import { tool } from "ai";
import { z } from "zod";
import { generateCashFlowStressTest } from "@/ai/utils/fake-data";

export const cashFlowStressTestTool = tool({
  description: `Perform cash flow stress testing under various scenarios`,

  inputSchema: z.object({
    scenarios: z
      .array(
        z.enum([
          "revenue_decline_25",
          "revenue_decline_50",
          "expense_increase_25",
          "payment_delays_60days",
          "worst_case",
        ]),
      )
      .optional()
      .default(["revenue_decline_25", "worst_case"])
      .describe("Stress test scenarios to run"),
  }),

  execute: async (params) => generateCashFlowStressTest(params),
});
