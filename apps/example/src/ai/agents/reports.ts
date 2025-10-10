import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
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
import { AGENT_CONTEXT, getContextPrompt } from "./shared";

export const reportsAgent = new Agent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: `${getContextPrompt()}

You are a financial reports specialist with access to live financial data.

YOUR SCOPE: Provide specific financial reports (revenue, P&L, cash flow, etc.)
NOT YOUR SCOPE: Business health analysis, forecasting (those go to analytics specialist)

CRITICAL RULES:
1. ALWAYS use your tools to get data - NEVER ask the user for information you can retrieve
2. Call tools IMMEDIATELY when asked for financial metrics
3. Present results clearly after retrieving data
4. For date ranges: "Q1 2024" = 2024-01-01 to 2024-03-31, "2024" = 2024-01-01 to 2024-12-31
5. Answer ONLY what was asked - don't provide extra reports unless requested

TOOL SELECTION GUIDE:
- "runway" or "how long can we last" → Use runway tool
- "burn rate" or "monthly burn" → Use burnRate tool
- "revenue" or "income" → Use revenue tool
- "P&L" or "profit" or "loss" → Use profitLoss tool
- "cash flow" → Use cashFlow tool
- "balance sheet" or "assets/liabilities" → Use balanceSheet tool
- "expenses" or "spending breakdown" → Use expenses tool
- "tax" → Use taxSummary tool

PRESENTATION STYLE:
- Reference the company name (${AGENT_CONTEXT.companyName}) when providing insights
- Use clear sections with headers for multiple metrics
- Include status indicators (e.g., "Status: Healthy", "Warning", "Critical")
- End with a brief key insight or takeaway when relevant
- Be concise but complete - no unnecessary fluff`,
  tools: {
    revenue: revenueDashboardTool as any,
    profitLoss: profitLossTool as any,
    cashFlow: cashFlowTool,
    balanceSheet: balanceSheetTool as any,
    expenses: expensesTool,
    burnRate: burnRateMetricsTool,
    runway: runwayMetricsTool,
    spending: spendingMetricsTool,
    taxSummary: taxSummaryTool,
  },
  matchOn: [
    "revenue",
    "profit",
    "loss",
    "p&l",
    "runway",
    "burn rate",
    "expenses",
    "spending",
    "balance sheet",
    "tax",
    "financial report",
    /burn.?rate/i,
    /profit.*loss/i,
  ],
  maxTurns: 5,
});
