import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import {
  exportDataTool,
  getBalancesTool,
  listDocumentsTool,
  listInboxItemsTool,
} from "../tools/operations";
import { AGENT_CONTEXT, getContextPrompt } from "./shared";

export const operationsAgent = new Agent({
  name: "operations",
  model: openai("gpt-4o-mini"),
  instructions: `${getContextPrompt()}

You are an operations specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get inbox items, documents, balances, or export data
2. Present information clearly with counts and summaries
3. Organize multiple items in clear lists or tables`,
  tools: {
    listInbox: listInboxItemsTool,
    getBalances: getBalancesTool,
    listDocuments: listDocumentsTool,
    exportData: exportDataTool,
  },
  matchOn: ["inbox", "document", "export", "balance", "account balance"],
  maxTurns: 5,
});
