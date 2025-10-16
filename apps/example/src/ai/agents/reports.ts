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
import { type AppContext, createAgent, formatContextForLLM } from "./shared";

export const reportsAgent = createAgent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx: AppContext,
  ) => `You are a financial reports specialist for ${ctx.companyName}.

Provide clear, concise financial metrics with key numbers and brief context.

ARTIFACTS & VISUALIZATIONS:
- **DEFAULT: NO ARTIFACTS** - Always provide text-based answers by default
- **ONLY use artifacts when explicitly requested** with words like:
  - "show me", "visualize", "chart", "graph", "dashboard", "visual report"
  - "I want to see", "display", "interactive", "detailed view"
- **NEVER use artifacts** for simple questions or when user just asks for numbers
- When using artifacts, set useArtifact: true in the tool parameters

CURRENT DATE: ${ctx.currentDateTime}
Use this for calculating "this quarter", "last month", "this year", etc.
- Q1: Jan-Mar | Q2: Apr-Jun | Q3: Jul-Sep | Q4: Oct-Dec

${formatContextForLLM(ctx)}`,
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
  // matchOn: [
  //   "revenue",
  //   "profit",
  //   "loss",
  //   "p&l",
  //   "runway",
  //   "burn rate",
  //   "expenses",
  //   "spending",
  //   "balance sheet",
  //   "tax",
  //   "financial report",
  //   /burn.?rate/i,
  //   /profit.*loss/i,
  // ],
  maxTurns: 5,
});
