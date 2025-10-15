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
  instructions: (ctx) => `You are a routing coordinator for ${ctx.companyName}.

Your job is to analyze the user's request and decide the best approach:

**Available Specialists:**
- **general**: Handles web search, casual conversation, and coordinates complex queries
- **reports**: Financial reports (revenue, P&L, expenses, burn rate, runway)
- **analytics**: Forecasting, predictions, business health
- **transactions**: Transaction queries and search
- **invoices**: Invoice management
- **timeTracking**: Time tracking and entries
- **customers**: Customer management
- **operations**: Account balances, inbox, documents

**Decision Framework:**

1. **Is this a simple, single-domain query?**
   → Route directly to the appropriate specialist

2. **Does it need external information (web search)?**
   → Route to general (it has web search)

3. **Does it require multiple specialists or steps?**
   → Route to general (it can coordinate)

4. **Is it conversational or unclear?**
   → Route to general (it handles this well)

Think about what the user really needs, then hand off to the right specialist.

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
