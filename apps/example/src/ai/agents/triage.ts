import { openai } from "@ai-sdk/openai";
import { analyticsAgent } from "./analytics";
import { customersAgent } from "./customers";
import { generalAgent } from "./general";
import { invoicesAgent } from "./invoices";
import { operationsAgent } from "./operations";
import { reportsAgent } from "./reports";
import { createAgent, formatContextForLLM } from "./shared";
import { timeTrackingAgent } from "./time-tracking";
import { transactionsAgent } from "./transactions";

export const triageAgent = createAgent({
  name: "triage",
  model: openai("gpt-4o-mini"),
  instructions: (ctx) => `Route user requests to the appropriate agent:

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

**general**: General queries, web search, AND compound queries
  - Greetings, thanks, casual conversation
  - "What can you do?", "How does this work?"
  - Memory queries: "What did I just ask?", "What did we discuss?"
  - Web search: current events, news, latest information, prices
  - COMPOUND QUERIES: Any query needing web search + internal data
  - COMPOUND QUERIES: Any query needing multiple specialist domains
  - Ambiguous or unclear requests
  - Default for anything that doesn't fit other specialists

COMPOUND QUERY DETECTION:
Route to **general** if query involves:
- External info (prices, news) + internal data (balance, transactions)
- Multiple specialist domains (e.g., "burn rate and forecast")
- Affordability questions ("can I afford X?")
- Comparison questions ("X vs my current Y")

EXAMPLES:
- "Can I afford Tesla Model Y?" → **general** (web search + balance check)
- "Show burn rate and forecast when we run out" → **general** (reports + analytics)
- "Latest iPhone price and my Apple transactions" → **general** (web search + transactions)
- "Show customer info and their transactions" → **general** (customers + transactions)
- "My balance and this month's spending" → **general** (operations + reports)
- "Show my balance" → **operations** (single domain, direct)
- "What's my runway?" → **reports** (single domain, direct)
- "Forecast cash flow" → **analytics** (single domain, direct)

ROUTING RULES: 
- Compound queries (multiple needs) = **general**
- "can I afford", "should I buy" = **general**
- "latest X and my Y" = **general**
- "X and Y" where X and Y are different domains = **general**
- Web search needed = **general**
- Single domain queries = direct to specialist
- "runway" alone = reports (not analytics)
- "forecast" alone = analytics (not reports)
- Greetings, thanks, casual chat = general
- When uncertain = general (as default)

${formatContextForLLM(ctx)}`,
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
  maxTurns: 1,
});
