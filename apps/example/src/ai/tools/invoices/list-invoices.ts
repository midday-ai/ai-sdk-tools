import { tool } from "ai";
import { z } from "zod";
import { generateInvoices } from "@/ai/utils/fake-data";

/**
 * List Invoices Tool
 *
 * Query invoices with filtering options.
 */
export const listInvoicesTool = tool({
  description: `List invoices with optional filters for customers`,
  inputSchema: z.object({
    pageSize: z
      .number()
      .min(1)
      .max(100)
      .optional()
      .describe("Number of invoices per page (1-100)"),
    start: z
      .string()
      .optional()
      .describe("Start date (inclusive) in ISO 8601 format"),
    end: z
      .string()
      .optional()
      .describe("End date (inclusive) in ISO 8601 format"),
    customers: z
      .array(z.string())
      .optional()
      .describe("Filter by customer IDs"),
    statuses: z
      .array(z.string())
      .optional()
      .describe("Filter by status: draft, overdue, paid, unpaid, canceled"),
    q: z.string().optional().describe("Search query for invoice text"),
  }),

  execute: async (params) => {
    // Generate realistic fake data for development
    return generateInvoices({
      pageSize: params.pageSize,
      start: params.start,
      end: params.end,
      statuses: params.statuses,
    });
  },
});
