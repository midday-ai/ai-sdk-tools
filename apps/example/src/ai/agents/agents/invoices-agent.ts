import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import { getInvoiceTool, listInvoicesTool } from "../tools/invoices";

/**
 * Invoices Specialist Agent
 *
 * Handles invoice queries and management
 */
export const invoicesAgent = new Agent({
  name: "Invoices Specialist",
  model: openai("gpt-4o-mini"),
  instructions: `You are an invoices specialist. You help users:
  - Find and filter invoices by customer, date, status, or search query
  - Get details of specific invoices
  - Understand invoice status and payment information
  
Common invoice statuses:
- draft: Invoice is being prepared, not sent yet
- unpaid: Invoice has been sent but not paid
- paid: Invoice has been paid in full
- overdue: Invoice is past due date and unpaid
- canceled: Invoice has been canceled

Be helpful in suggesting filters and helping users track their invoices.
When discussing payment status, be clear about due dates and amounts.`,
  tools: {
    listInvoices: listInvoicesTool,
    getInvoice: getInvoiceTool,
  },
  maxTurns: 5,
});
