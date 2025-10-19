import { tool } from "ai";
import { z } from "zod";
import { dateRangeSchema } from "@/ai/types/filters";
import { generateDataExport } from "@/ai/utils/fake-data";

export const exportDataTool = tool({
  description: `Export financial data in various formats (CSV, Excel, ZIP)`,

  inputSchema: z
    .object({
      dataType: z
        .enum(["transactions", "invoices", "reports", "all"])
        .describe("Type of data to export"),
      format: z
        .enum(["csv", "excel", "zip"])
        .default("csv")
        .describe("Export format"),
    })
    .merge(dateRangeSchema),

  execute: async (params) => generateDataExport(params),
});
