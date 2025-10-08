import { tool } from "ai";
import { z } from "zod";
import { currencyFilterSchema, dateRangeSchema } from "../../types/filters";
import { generateBalanceSheet } from "../../utils/fake-data";

/**
 * Balance Sheet Tool
 *
 * Provides balance sheet analysis with:
 * - Assets (current and non-current)
 * - Liabilities (current and non-current)
 * - Equity
 * - Financial ratios
 */
export const balanceSheetTool = tool({
  description: `Get balance sheet for a specified date or period.
  
Capabilities:
- Total assets breakdown
- Total liabilities breakdown
- Shareholder equity
- Key financial ratios (current ratio, debt-to-equity)
- Period comparison`,

  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    categories: z
      .array(z.enum(["assets", "liabilities", "equity"]))
      .optional()
      .describe("Specific balance sheet categories to include"),
  }),

  execute: async ({ from, to, currency, categories }) => {
    return generateBalanceSheet({ from, to, currency, categories });
  },
});
