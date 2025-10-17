import { tool } from "ai";
import { z } from "zod";
import { generateUpdatedCustomer } from "@/ai/utils/fake-data";

export const updateCustomerTool = tool({
  description: `Update customer information.`,
  inputSchema: z.object({
    customerId: z.string().describe("Customer ID to update"),
    name: z.string().optional().describe("Updated name"),
    email: z.string().email().optional().describe("Updated email"),
    phone: z.string().optional().describe("Updated phone"),
    address: z.string().optional().describe("Updated address"),
    tags: z.array(z.string()).optional().describe("Updated tags"),
  }),
  execute: async (params) => generateUpdatedCustomer(params),
});
