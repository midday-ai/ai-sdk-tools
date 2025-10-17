import { tool } from "ai";
import { z } from "zod";
import { generateCreatedInvoice } from "@/ai/utils/fake-data";

/**
 * Create Invoice Tool
 *
 * Create a new invoice with line items, customer info, and optional auto-send.
 */
export const createInvoiceTool = tool({
  description: `Create a new invoice for a customer`,
  inputSchema: z.object({
    customerId: z.string().describe("Customer ID to invoice"),
    lineItems: z
      .array(
        z.object({
          description: z.string(),
          quantity: z.number().min(1),
          unitPrice: z.number().min(0),
        }),
      )
      .min(1)
      .describe("Invoice line items"),
    dueDate: z.string().optional().describe("Due date in ISO 8601 format"),
    currency: z.string().optional().default("USD").describe("Currency code"),
    sendImmediately: z
      .boolean()
      .optional()
      .default(false)
      .describe("Send invoice immediately after creation"),
    notes: z.string().optional().describe("Additional notes for the invoice"),
  }),

  execute: async (params) => {
    const total = params.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return generateCreatedInvoice({
      ...params,
      total,
      status: params.sendImmediately ? "sent" : "draft",
    });
  },
});
