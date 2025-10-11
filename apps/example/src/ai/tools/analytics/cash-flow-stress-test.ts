import { tool } from "ai";
import { z } from "zod";
import { generateCashFlowStressTest } from "@/ai/utils/fake-data";

export const cashFlowStressTestTool = tool({
  description: `Perform cash flow stress testing under various scenarios.
  
Tests business resilience under:
- Revenue decline scenarios
- Expense increase scenarios
- Payment delay scenarios
- Combined worst-case scenarios`,

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
