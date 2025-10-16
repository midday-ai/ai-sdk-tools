import { tool } from "ai";
import { z } from "zod";
import { generateUpdatedInvoice } from "@/ai/utils/fake-data";

/**
 * Update Invoice Tool
 *
 * Update an existing invoice's details, status, or send it.
 */
export const updateInvoiceTool = tool({
  description: `Update an existing invoice`,

  inputSchema: z.object({
    invoiceId: z.string().describe("Invoice ID to update"),
    status: z
      .enum(["draft", "sent", "paid", "canceled"])
      .optional()
      .describe("New invoice status"),
    lineItems: z
      .array(
        z.object({
          description: z.string(),
          quantity: z.number().min(1),
          unitPrice: z.number().min(0),
        }),
      )
      .optional()
      .describe("Updated line items"),
    dueDate: z.string().optional().describe("Updated due date"),
    notes: z.string().optional().describe("Updated notes"),
    sendToCustomer: z
      .boolean()
      .optional()
      .describe("Send invoice to customer after update"),
  }),

  execute: async (params) => {
    const total = params.lineItems
      ? params.lineItems.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        )
      : undefined;

    return generateUpdatedInvoice({
      ...params,
      total,
    });
  },
});
