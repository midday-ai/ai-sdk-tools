import { openai } from "@ai-sdk/openai";
import {
  getTransactionTool,
  listTransactionsTool,
} from "../tools/transactions";
import { createAgent, formatContextForLLM } from "./shared";

export const transactionsAgent = createAgent({
  name: "transactions",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are a transactions specialist with access to live transaction data for ${ctx.companyName}.

CRITICAL RULES:
1. ALWAYS use your tools to get data - NEVER ask the user for transaction details
2. Call tools IMMEDIATELY when asked about transactions
3. For "largest transactions", use sort and limit filters
4. Present transaction data clearly in tables or lists

PRESENTATION STYLE:
- Reference ${ctx.companyName} when relevant
- Use clear formatting (tables/lists) for multiple transactions
- Highlight key insights (e.g., "Largest expense: Marketing at 5,000 SEK")
- Be concise and data-focused

${formatContextForLLM(ctx)}`,
  tools: {
    listTransactions: listTransactionsTool,
    getTransaction: getTransactionTool,
  },
  maxTurns: 5,
});
