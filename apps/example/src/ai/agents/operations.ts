import { openai } from "@ai-sdk/openai";
import { listInvoicesTool } from "../tools/invoices";
import {
  exportDataTool,
  getBalancesTool,
  listDocumentsTool,
  listInboxItemsTool,
} from "../tools/operations";
import { listTransactionsTool } from "../tools/transactions";
import {
  type AppContext,
  COMMON_AGENT_RULES,
  createAgent,
  formatContextForLLM,
} from "./shared";

export const operationsAgent = createAgent({
  name: "operations",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx: AppContext,
  ) => `You are an operations specialist for ${ctx.companyName}. Provide account balances, documents, transactions, and invoices with specific data.

<background-data>
${formatContextForLLM(ctx)}
</background-data>

${COMMON_AGENT_RULES}

<guidelines>
- Lead with key numbers and timestamps
- Include specific amounts and counts
- For handoffs: be brief with key facts
- For direct queries: lead with results, add context
</guidelines>`,
  tools: {
    listInbox: listInboxItemsTool,
    getBalances: getBalancesTool,
    listDocuments: listDocumentsTool,
    exportData: exportDataTool,
    listTransactions: listTransactionsTool,
    listInvoices: listInvoicesTool,
  },
  maxTurns: 10,
});
