import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import {
  createInvoiceTool,
  getInvoiceTool,
  listInvoicesTool,
  updateInvoiceTool,
} from "../tools/invoices";
import { AGENT_CONTEXT, getContextPrompt } from "./shared";

export const invoicesAgent = new Agent({
  name: "invoices",
  model: openai("gpt-4o-mini"),
  instructions: `${getContextPrompt()}

You are an invoice management specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update invoice data
2. Present invoice information clearly with key details (amount, status, due date)
3. Use clear status labels (Paid, Overdue, Pending)`,
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
