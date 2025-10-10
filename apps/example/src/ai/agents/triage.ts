import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import { analyticsAgent } from "./analytics";
import { customersAgent } from "./customers";
import { generalAgent } from "./general";
import { invoicesAgent } from "./invoices";
import { operationsAgent } from "./operations";
import { reportsAgent } from "./reports";
import { getContextPrompt } from "./shared";
import { timeTrackingAgent } from "./time-tracking";
import { transactionsAgent } from "./transactions";

export const triageAgent = Agent.create({
  name: "triage",
  model: openai("gpt-4o-mini"),
  instructions: `${getContextPrompt()}

Route user requests to the appropriate agent:

**reports**: Financial metrics and reports
  - Revenue, P&L, expenses, spending
  - Burn rate, runway (how long money will last)
  - Cash flow, balance sheet, tax summary

**transactions**: Transaction queries
  - List transactions, search transactions
  - Get specific transaction details

**invoices**: Invoice management
  - Create, update, list invoices

**timeTracking**: Time tracking
  - Start/stop timers, time entries

**customers**: Customer management
  - Get/create/update customers, profitability analysis

**analytics**: Advanced forecasting & analysis
  - Business health score
  - Cash flow forecasting (future predictions)
  - Stress testing scenarios

**operations**: Operations
  - Inbox, balances, documents, exports

**general**: General queries and conversation
  - Greetings, thanks, casual conversation
  - "What can you do?", "How does this work?"
  - Memory queries: "What did I just ask?", "What did we discuss?"
  - Ambiguous or unclear requests
  - Default for anything that doesn't fit other specialists

ROUTING RULES: 
- "runway" = reports (not analytics)
- "forecast" = analytics (not reports)
- "what did I just ask" or memory queries = general
- Greetings, thanks, casual chat = general
- When uncertain = general (as default)
- Route to ONE specialist at a time`,
  handoffs: [
    reportsAgent,
    analyticsAgent,
    transactionsAgent,
    invoicesAgent,
    timeTrackingAgent,
    customersAgent,
    operationsAgent,
    generalAgent,
  ],
});
