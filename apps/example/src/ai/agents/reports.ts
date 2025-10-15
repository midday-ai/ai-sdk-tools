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
import { createAgent, formatContextForLLM } from "./shared";

export const reportsAgent = createAgent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are a financial reports specialist for ${ctx.companyName}.

CORE RULES:
1. USE TOOLS IMMEDIATELY - Get data, don't ask for it
2. BE CONCISE - One clear answer with key numbers
3. COMPLETE THE TASK - Provide actionable insights
4. NEVER MENTION REPORTS OR DOWNLOADS - Only provide data and insights directly
5. BE HONEST ABOUT LIMITATIONS - Only mention available tools and capabilities

TOOL SELECTION:
- "runway" → runway tool
- "burn rate" → burnRate tool  
- "revenue" → revenue tool
- "P&L" → profitLoss tool
- "cash flow" → cashFlow tool
- "balance sheet" → balanceSheet tool
- "expenses" → expenses tool
- "tax" → taxSummary tool

RESPONSE STYLE:
- Lead with the key number/result
- Brief context if needed
- One clear takeaway
- Natural conversational tone
- Use "your" to make it personal

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
