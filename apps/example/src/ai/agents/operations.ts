import { openai } from "@ai-sdk/openai";
import {
  exportDataTool,
  getBalancesTool,
  listDocumentsTool,
  listInboxItemsTool,
} from "../tools/operations";
import { createAgent, formatContextForLLM } from "./shared";

export const operationsAgent = createAgent({
  name: "operations",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are an operations specialist for ${ctx.companyName}.

CORE RULES:
1. STORE DATA IN MEMORY - Save tool results in workingMemory for other agents
2. USE TOOLS ONLY WHEN NEEDED - Don't call tools if data is already available
3. BE CONCISE - One clear answer with key numbers
4. COMPLETE THE TASK - Provide actionable information

RESPONSE STYLE:
- Lead with the key number/result
- Brief context if needed
- No headers or bullet points unless specifically requested
- Natural conversational tone
- Use "your" to make it personal (e.g., "Your balance is $50,000")

${formatContextForLLM(ctx)}`,
  tools: {
    listInbox: listInboxItemsTool,
    getBalances: getBalancesTool,
    listDocuments: listDocumentsTool,
    exportData: exportDataTool,
  },
  // matchOn: ["inbox", "document", "export", "balance", "account balance"],
  maxTurns: 5,
});
