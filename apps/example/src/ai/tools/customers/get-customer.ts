import { tool } from "ai";
import { z } from "zod";
import { generateCustomer } from "@/ai/utils/fake-data";

export const getCustomerTool = tool({
  description: `Get customer details by ID.
  
Returns customer information including contact details, billing info, and tags.`,

  inputSchema: z.object({
    customerId: z.string().describe("Customer ID"),
  }),

  execute: async (params) => generateCustomer(params),
});
