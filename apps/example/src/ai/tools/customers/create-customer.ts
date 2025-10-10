import { tool } from "ai";
import { z } from "zod";
import { generateCreatedCustomer } from "@/ai/utils/fake-data";

export const createCustomerTool = tool({
  description: `Create a new customer record.`,

  inputSchema: z.object({
    name: z.string().describe("Customer name or organization"),
    email: z.string().email().describe("Customer email"),
    phone: z.string().optional().describe("Phone number"),
    address: z.string().optional().describe("Billing address"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Customer tags for categorization"),
  }),

  execute: async (params) => generateCreatedCustomer(params),
});
