import { tool } from "ai";
import { z } from "zod";
import { generateInvoice } from "@/ai/utils/fake-data";

/**
 * Get Invoice Tool
 *
 * Retrieve detailed information about a specific invoice.
 */
export const getInvoiceTool = tool({
  description: `Get details of a specific invoice by its ID`,

  inputSchema: z.object({
    id: z.string().describe("Invoice ID"),
  }),

  execute: async ({ id }) => {
    // Generate realistic fake data for development
    return generateInvoice(id);
  },
});
