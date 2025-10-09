import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import {
  getTransactionTool,
  listTransactionsTool,
} from "../tools/transactions";

/**
 * Transactions Specialist Agent
 *
 * Handles transaction queries and searches
 */
export const transactionsAgent = new Agent({
  name: "Transactions Specialist",
  model: openai("gpt-4o-mini"),
  instructions: `You are a transactions specialist. You help users:
  - Find and filter transactions by date, type, category, status, or search query
  - Get details of specific transactions
  - Understand transaction patterns and data
  
Be helpful in suggesting useful filters when users ask about transactions. 

Common transaction statuses:
- pending: Transaction is not yet finalized
- completed: Transaction is complete
- posted: Transaction is posted to account
- archived: Transaction is archived
- excluded: Transaction is excluded from reports

Transaction types:
- income: Money coming in
- expense: Money going out

Explain the data clearly and help users find what they're looking for.`,
  tools: {
    listTransactions: listTransactionsTool,
    getTransaction: getTransactionTool,
  },
  maxTurns: 5,
});
