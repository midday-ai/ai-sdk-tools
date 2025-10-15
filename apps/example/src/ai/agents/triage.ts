import { openai } from "@ai-sdk/openai";
import { handoff, keepLastNMessages } from "@ai-sdk-tools/agents";
import { createDefaultInputFilter } from "@ai-sdk-tools/agents";
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

CRITICAL: ALWAYS route to **general** for these patterns:
- ANY query with "latest", "current", "recent" + prices/products = WEB SEARCH NEEDED
- ANY query asking "can I afford" = COMPOUND (web search + balance)
- ANY query with "find X and Y" where X is external and Y is internal
- ANY query combining external lookup + financial check

COMPOUND QUERY DETECTION:
Route to **general** if query involves:
- External info (prices, news, products) + internal data (balance, transactions)
- Multiple specialist domains (e.g., "burn rate and forecast")
- Affordability questions ("can I afford X?", "should I buy X?")
- Comparison questions ("X vs my current Y")
- Price lookups with financial decisions
- References to previous data ("from those transactions", "related to", "based on")
- Follow-up questions that need context from previous queries
- Questions about relationships between different data types

EXAMPLES:
- "Find latest price for Model Y and let me know if I can afford it" → **general** (web search + balance check)
- "Can I afford Tesla Model Y?" → **general** (web search + balance check)
- "What's the current price of iPhone and can I buy it?" → **general** (web search + balance check)
- "Show burn rate and forecast when we run out" → **general** (reports + analytics)
- "Latest iPhone price and my Apple transactions" → **general** (web search + transactions)
- "Show customer info and their transactions" → **general** (customers + transactions)
- "My balance and this month's spending" → **general** (operations + reports)
- "What's the current price of Model Y?" → **general** (web search needed)
- "What about the unpaid invoices from those transactions?" → **general** (follow-up needing context)
- "Show me the customers related to those invoices" → **general** (follow-up needing context)
- "Based on those transactions, what's my spending pattern?" → **general** (follow-up needing context)
- "Show my balance" → **operations** (single domain, direct)
- "What's my runway?" → **reports** (single domain, direct)
- "Forecast cash flow" → **analytics** (single domain, direct)

ROUTING RULES: 
- "latest", "current", "recent" + price/product = **general** (web search)
- "can I afford", "should I buy", "do I have enough for" = **general** (compound)
- "find X and Y" where X is external = **general** (compound)
- Compound queries (multiple needs) = **general**
- "latest X and my Y" = **general**
- "X and Y" where X and Y are different domains = **general**
- Web search needed = **general**
- Follow-up questions with "from those", "related to", "based on" = **general** (needs context)
- Questions referencing previous data = **general** (needs context)
- Single domain queries = direct to specialist
- "runway" alone = reports (not analytics)
- "forecast" alone = analytics (not reports)
- Greetings, thanks, casual chat = general
- When uncertain = general (as default)

${formatContextForLLM(ctx)}`,
  handoffs: [
    // General agent - PRESERVE tool results for data sharing
    handoff(generalAgent, {
      inputFilter: createDefaultInputFilter(),
    }),
    // Operations agent - keep more context for balance checks
    handoff(operationsAgent, {
      inputFilter: keepLastNMessages(10),
    }),
    // Reports agent - keep more context for financial analysis
    handoff(reportsAgent, {
      inputFilter: keepLastNMessages(10),
    }),
    // Analytics agent - keep more context for forecasting
    handoff(analyticsAgent, {
      inputFilter: keepLastNMessages(10),
    }),
    // Other agents - use default data sharing
    handoff(transactionsAgent, {
      inputFilter: createDefaultInputFilter(),
    }),
    handoff(invoicesAgent, {
      inputFilter: createDefaultInputFilter(),
    }),
    handoff(timeTrackingAgent, {
      inputFilter: createDefaultInputFilter(),
    }),
    handoff(customersAgent, {
      inputFilter: createDefaultInputFilter(),
    }),
  ],
  maxTurns: 1,
});
