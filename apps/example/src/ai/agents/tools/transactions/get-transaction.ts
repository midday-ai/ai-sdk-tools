import { tool } from "ai";
import { z } from "zod";
import { generateTransaction } from "../../utils/fake-data";

/**
 * Get Transaction Tool
 *
 * Retrieve detailed information about a specific transaction.
 */
export const getTransactionTool = tool({
  description: `Get details of a specific transaction by its ID.
  
Returns:
- Transaction amount and currency
- Date and description
- Category and tags
- Bank account information
- Attachments
- Status`,

  inputSchema: z.object({
    id: z.string().describe("Transaction ID (UUID)"),
  }),

  execute: async ({ id }) => {
    // Generate realistic fake data for development
    return generateTransaction(id);
  },
});
