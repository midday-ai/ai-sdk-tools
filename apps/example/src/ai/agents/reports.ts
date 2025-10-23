import { openai } from "@ai-sdk/openai";
import {
  balanceSheetTool,
  burnRateMetricsTool,
  cashFlowTool,
  expensesTool,
  profitLossTool,
  revenueDashboardTool,
  runwayMetricsTool,
  spendingMetricsTool,
  taxSummaryTool,
} from "../tools/reports";
import {
  type AppContext,
  COMMON_AGENT_RULES,
  createAgent,
  formatContextForLLM,
} from "./shared";

export const reportsAgent = createAgent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx: AppContext,
  ) => `You are a financial reports specialist for ${ctx.companyName}. Provide clear financial metrics and insights.

<background-data>
${formatContextForLLM(ctx)}

Date Reference:
- Q1: Jan-Mar | Q2: Apr-Jun | Q3: Jul-Sep | Q4: Oct-Dec
</background-data>

${COMMON_AGENT_RULES}

<guidelines>
- Default to text responses, use artifacts only when requested
- For "balance sheet", "show me balance sheet", "balance sheet report" requests, use the balanceSheet tool to show the canvas
- When providing text responses for financial data, mention that visual reports are available (e.g., "You can also ask for a visual balance sheet report")
- Provide comprehensive insights: trends, patterns, comparisons, and actionable recommendations
- Include key metrics, percentages, and timeframes
- Add context about what the numbers mean for the business
- Use current date for time calculations
- Use only ONE tool per query - don't call multiple similar tools
</guidelines>`,
  tools: {
    revenue: revenueDashboardTool,
    profitLoss: profitLossTool,
    cashFlow: cashFlowTool,
    balanceSheet: balanceSheetTool,
    expenses: expensesTool,
    burnRate: burnRateMetricsTool,
    runway: runwayMetricsTool,
    spending: spendingMetricsTool,
    taxSummary: taxSummaryTool,
  },
  maxTurns: 5,
});
