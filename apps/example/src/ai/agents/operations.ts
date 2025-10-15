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

CRITICAL RULES:
1. ALWAYS use tools to get inbox items, documents, balances, or export data
2. Present information clearly with counts and summaries
3. Organize multiple items in clear lists or tables

${formatContextForLLM(ctx)}`,
  tools: {
    listInbox: listInboxItemsTool,
    getBalances: getBalancesTool,
    listDocuments: listDocumentsTool,
    exportData: exportDataTool,
  },
  maxTurns: 5,
});
