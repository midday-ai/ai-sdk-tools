import { z } from "zod";

/**
 * Common filter schemas used across multiple tools
 */

export const dateRangeSchema = z.object({
  from: z.string().describe("Start date in ISO 8601 format (e.g., 2024-01-01)").default("2024-01-01"),
  to: z.string().describe("End date in ISO 8601 format (e.g., 2024-12-31)").default("2024-12-31"),
});

export const optionalDateRangeSchema = z.object({
  start: z
    .string()
    .optional()
    .describe("Start date (inclusive) in ISO 8601 format"),
  end: z
    .string()
    .optional()
    .describe("End date (inclusive) in ISO 8601 format"),
});

export const currencyFilterSchema = z.object({
  currency: z
    .string()
    .optional()
    .describe("Currency code in ISO 4217 format (e.g., USD, EUR, GBP)"),
});

export const paginationSchema = z.object({
  pageSize: z
    .number()
    .min(1)
    .max(10000)
    .optional()
    .describe("Number of items per page"),
  cursor: z
    .string()
    .optional()
    .describe("Cursor for pagination from previous response"),
});

export const searchSchema = z.object({
  q: z.string().optional().describe("Search query string to filter by text"),
});

export const sortSchema = z.object({
  sort: z
    .array(z.string())
    .optional()
    .describe(
      "Sorting order as array: [field, direction]. Example: ['date', 'desc']",
    ),
});

// Type exports for TypeScript
export type DateRange = z.infer<typeof dateRangeSchema>;
export type OptionalDateRange = z.infer<typeof optionalDateRangeSchema>;
export type CurrencyFilter = z.infer<typeof currencyFilterSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Search = z.infer<typeof searchSchema>;
export type Sort = z.infer<typeof sortSchema>;
