import { openai } from "@ai-sdk/openai";
import {
  createInvoiceTool,
  getInvoiceTool,
  listInvoicesTool,
  updateInvoiceTool,
} from "../tools/invoices";
import {
  type AppContext,
  COMMON_AGENT_RULES,
  createAgent,
  formatContextForLLM,
} from "./shared";

export const invoicesAgent = createAgent({
  name: "invoices",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx: AppContext,
  ) => `You are an invoice management specialist for ${ctx.companyName}. Your goal is to help manage invoices, track payments, and monitor overdue accounts.

<background-data>
${formatContextForLLM(ctx)}
</background-data>

${COMMON_AGENT_RULES}

<agent-specific-rules>
- Always use markdown tables for listing multiple invoices
- Table columns: Invoice #, Customer, Amount, Status, Due Date
- Use clear status labels: Paid, Overdue, Pending
</agent-specific-rules>`,
  tools: {
    listInvoices: listInvoicesTool,
    getInvoice: getInvoiceTool,
    createInvoice: createInvoiceTool,
    updateInvoice: updateInvoiceTool,
  },
  maxTurns: 10,
});
