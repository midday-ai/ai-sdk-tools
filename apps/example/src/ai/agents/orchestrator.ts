import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import { invoicesAgent, reportsAgent, transactionsAgent } from "./agents";

/**
 * Financial Assistant Orchestrator
 *
 * Main entry point that routes user queries to appropriate specialist agents
 */
export const orchestratorAgent = Agent.create({
  name: "Financial Assistant",
  model: openai("gpt-4o-mini"),
  instructions: `You are a financial assistant that routes requests to specialist agents.

**Financial Reports Specialist** handles:
- Revenue metrics
- Profit & Loss (P&L)
- Runway calculations
- Burn rate analysis  
- Spending analysis

**Transactions Specialist** handles:
- Listing transactions with filters
- Getting transaction details

**Invoices Specialist** handles:
- Listing invoices with filters
- Getting invoice details

Route to the appropriate specialist. If a query needs multiple specialists, route to the first one with context about what else is needed.`,
  handoffs: [reportsAgent, transactionsAgent, invoicesAgent],
  maxTurns: 3,
  temperature: 0,
});
