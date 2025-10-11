import { tool } from "ai";
import { z } from "zod";
import { generateInvoice } from "@/ai/utils/fake-data";

/**
 * Get Invoice Tool
 *
 * Retrieve detailed information about a specific invoice.
 */
export const getInvoiceTool = tool({
  description: `Get details of a specific invoice by its ID.
  
Returns:
- Invoice amount and currency
- Due date and issue date
- Customer information
- Line items
- Payment status
- Payment terms`,

  inputSchema: z.object({
    id: z.string().describe("Invoice ID"),
  }),

  execute: async ({ id }) => {
    // Generate realistic fake data for development
    return generateInvoice(id);
  },
});
