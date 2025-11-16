import type { z } from "zod";
import type { QualityThreshold } from "./types.js";

/**
 * Check if extracted data meets minimum quality standards
 */
export function validateQuality<T>(
  result: T,
  schema: z.ZodSchema<T>,
  threshold?: QualityThreshold,
): boolean {
  const defaultThreshold: Required<QualityThreshold> = {
    requireTotal: true,
    requireCurrency: true,
    requireVendor: true,
    requireDate: true,
  };

  const config = { ...defaultThreshold, ...threshold };

  // Parse and validate the result
  const parsed = schema.safeParse(result);
  if (!parsed.success) {
    return false;
  }

  const data = parsed.data as Record<string, unknown>;

  // Check critical fields
  if (config.requireTotal) {
    const total = data.total_amount;
    if (!total || (typeof total === "number" && total <= 0)) {
      return false;
    }
  }

  if (config.requireCurrency) {
    const currency = data.currency;
    if (!currency || typeof currency !== "string" || currency.trim() === "") {
      return false;
    }
  }

  if (config.requireVendor) {
    const vendor = data.vendor_name;
    if (!vendor || typeof vendor !== "string" || vendor.trim() === "") {
      return false;
    }
  }

  if (config.requireDate) {
    // Check for invoice_date, due_date, or date field
    const invoiceDate = data.invoice_date;
    const dueDate = data.due_date;
    const date = data.date;

    if (
      (!invoiceDate ||
        (typeof invoiceDate === "string" && invoiceDate.trim() === "")) &&
      (!dueDate || (typeof dueDate === "string" && dueDate.trim() === "")) &&
      (!date || (typeof date === "string" && date.trim() === ""))
    ) {
      return false;
    }
  }

  return true;
}
