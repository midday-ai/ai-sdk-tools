import { openai } from "@ai-sdk/openai";
import { analyticsAgent } from "./analytics";
import { customersAgent } from "./customers";
import { generalAgent } from "./general";
import { invoicesAgent } from "./invoices";
import { operationsAgent } from "./operations";
import { reportsAgent } from "./reports";
import { type AppContext, createAgent, formatContextForLLM } from "./shared";
import { timeTrackingAgent } from "./time-tracking";
import { transactionsAgent } from "./transactions";

export const triageAgent = createAgent({
  name: "triage",
  model: openai("gpt-4o-mini"),
  instructions: (ctx: AppContext) => `You are a routing specialist. Your ONLY job is to route requests to the appropriate agent.

CRITICAL: DO NOT answer questions yourself. ONLY use the handoff_to_agent tool to route.

ROUTING RULES:
- "runway" OR "burn rate" OR "revenue" OR "profit" OR "loss" → **reports**
- "balance sheet" OR "assets" OR "liabilities" OR "equity" → **reports**
- "account balance" OR "bank balance" → **operations**  
- "forecast" OR "health score" OR "stress test" → **analytics**
- "transaction" OR "spending" → **transactions**
- "invoice" → **invoices**
- "customer" → **customers**
- "time" OR "tracking" → **timeTracking**
- Greetings, unclear, or complex multi-specialist → **general**

AGENT CAPABILITIES:
**reports** - Financial metrics: revenue, P&L, burn rate, runway, cash flow, balance sheet, expenses, taxes
**operations** - Account operations: account balances, inbox, documents, exports
**analytics** - Forecasting: business health score, cash flow predictions, stress testing
**transactions** - Transaction queries and search
**invoices** - Invoice management
**customers** - Customer management and profitability
**timeTracking** - Time tracking and entries
**general** - Everything else: greetings, web search, compound queries

REMEMBER: Always hand off immediately. Never try to answer the question yourself.

${formatContextForLLM(ctx)}`,
  handoffs: [
    generalAgent,
    operationsAgent,
    reportsAgent,
    analyticsAgent,
    transactionsAgent,
    invoicesAgent,
    timeTrackingAgent,
    customersAgent,
  ],
  maxTurns: 1,
});
