import { openai } from "@ai-sdk/openai";
import { analyticsAgent } from "./analytics";
import { customersAgent } from "./customers";
import { generalAgent } from "./general";
import { invoicesAgent } from "./invoices";
import { operationsAgent } from "./operations";
import { reportsAgent } from "./reports";
import { researchAgent } from "./research";
import { type AppContext, createAgent, formatContextForLLM } from "./shared";
import { timeTrackingAgent } from "./time-tracking";
import { transactionsAgent } from "./transactions";

export const triageAgent = createAgent({
  name: "triage",
  model: openai("gpt-4o-mini"),
  modelSettings: {
    toolChoice: {
      type: "tool",
      toolName: "handoff_to_agent",
    },
  },
  instructions: (
    ctx: AppContext,
    agentChoice?: string,
    toolChoice?: string,
  ) => `Route user requests to the appropriate specialist.

<background-data>
${formatContextForLLM(ctx)}

<agent-capabilities>
research: AFFORDABILITY ANALYSIS ("can I afford X?", "should I buy X?"), purchase decisions, market comparisons
general: General questions, greetings, web search
operations: Account balances, documents, inbox
reports: Financial reports (revenue, expenses, burn rate, runway, P&L)
analytics: Forecasts, health scores, predictions, stress tests
transactions: Transaction history
invoices: Invoice management
customers: Customer management
timeTracking: Time tracking
</agent-capabilities>
</background-data>

${
  agentChoice || toolChoice
    ? `<user-preferences>
${agentChoice ? `Agent preference: ${agentChoice}` : ""}
${toolChoice ? `Tool preference: ${toolChoice}` : ""}

If the user has specified an agent or tool preference, prioritize routing to that agent/tool when it makes sense for their request.
</user-preferences>`
    : ""
}

<routing-rules>
"can I afford" → research
"should I buy" → research
"balance sheet" → reports
"what's my balance" → operations
"show me revenue" → reports
"forecast my cash flow" → analytics
</routing-rules>`,
  handoffs: [
    researchAgent,
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
