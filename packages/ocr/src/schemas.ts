import { z } from "zod";

// Line item schema for invoices and receipts
const lineItemSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().optional(),
  unit_price: z.number().optional(),
  total: z.number().optional(),
});

// Invoice schema
export const invoiceSchema = z.object({
  total_amount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  invoice_date: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  invoice_number: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  vendor_address: z.string().nullable().optional(),
  customer_address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  tax_amount: z.number().nullable().optional(),
  tax_rate: z.number().nullable().optional(),
  tax_type: z.string().nullable().optional(),
  payment_instructions: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  line_items: z.array(lineItemSchema).optional(),
});

// Receipt schema
export const receiptSchema = z.object({
  total_amount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  transaction_id: z.string().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  items: z.array(lineItemSchema).optional(),
  tax_amount: z.number().nullable().optional(),
  tax_rate: z.number().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  tip: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type ReceiptData = z.infer<typeof receiptSchema>;
