import { openai } from "@ai-sdk/openai";
import {
  createInvoiceTool,
  getInvoiceTool,
  listInvoicesTool,
  updateInvoiceTool,
} from "../tools/invoices";
import { createAgent, formatContextForLLM } from "./shared";

export const invoicesAgent = createAgent({
  name: "invoices",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are an invoice management specialist for ${ctx.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update invoice data
2. Present invoice information clearly with key details (amount, status, due date)
3. Use clear status labels (Paid, Overdue, Pending)

${formatContextForLLM(ctx)}`,
  tools: {
    listInvoices: listInvoicesTool,
    getInvoice: getInvoiceTool,
    createInvoice: createInvoiceTool,
    updateInvoice: updateInvoiceTool,
  },
  matchOn: [
    "invoice",
    "bill",
    "create invoice",
    "send invoice",
    "unpaid invoice",
    "paid invoice",
    /create.*invoice/i,
  ],
  maxTurns: 5,
});
