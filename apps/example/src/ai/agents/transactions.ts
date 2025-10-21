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

CORE RULES:
1. USE TOOLS IMMEDIATELY - Get data, don't ask for it
2. BE CONCISE - One clear answer with key details
3. COMPLETE THE TASK - Provide actionable information

RESPONSE STYLE:
- Lead with the key information
- Present transaction data clearly in tables or lists
- For "largest transactions", use sort and limit filters
- Highlight key insights (e.g., "Your largest expense: Marketing at 5,000 SEK")
- Natural conversational tone
- Use "your" to make it personal

${formatContextForLLM(ctx)}`,
  tools: {
    listTransactions: listTransactionsTool,
    getTransaction: getTransactionTool,
  },
  maxTurns: 5,
});
