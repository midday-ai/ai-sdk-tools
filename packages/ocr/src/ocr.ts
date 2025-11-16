import type { z } from "zod";
import { mergeResults } from "./merge.js";
import { extractWithGemini } from "./providers/gemini.js";
import { extractWithMistral } from "./providers/mistral.js";
import { extractWithOCRFallback } from "./providers/ocr-fallback.js";
import { validateQuality } from "./quality.js";
import { invoiceSchema, receiptSchema } from "./schemas.js";
import type { OCRInput, OCROptions, ProviderAttempt } from "./types.js";
import { OCRError } from "./types.js";
import { normalizeInput } from "./utils.js";

// Default prompts for invoice and receipt extraction
const INVOICE_PROMPT = `Extract structured data from this invoice document. Extract all relevant fields including vendor information, dates, amounts, line items, tax information, and payment details. Be accurate and complete.`;

const RECEIPT_PROMPT = `Extract structured data from this receipt document. Extract all relevant fields including vendor/merchant name, date, total amount, items purchased, payment method, and transaction details. Be accurate and complete.`;

function getSchemaAndPrompt(
  typeOrSchema: "invoice" | "receipt" | z.ZodSchema<any>,
): { schema: z.ZodSchema<any>; prompt: string } {
  if (typeof typeOrSchema === "string") {
    if (typeOrSchema === "invoice") {
      return { schema: invoiceSchema, prompt: INVOICE_PROMPT };
    }
    if (typeOrSchema === "receipt") {
      return { schema: receiptSchema, prompt: RECEIPT_PROMPT };
    }
  }

  // Custom schema - use generic prompt
  return {
    schema: typeOrSchema,
    prompt:
      "Extract structured data from this document according to the provided schema. Be accurate and complete.",
  };
}

export async function ocr<T extends Record<string, unknown>>(
  input: OCRInput,
  typeOrSchema: "invoice" | "receipt" | z.ZodSchema<T>,
  options: OCROptions = {},
): Promise<T> {
  const attempts: ProviderAttempt[] = [];
  const { schema, prompt } = getSchemaAndPrompt(typeOrSchema);
  const normalizedInput = await normalizeInput(input);

  const extractOptions = {
    schema,
    input: normalizedInput,
    prompt,
    timeout: options.timeout || 20000,
    retries: options.retries ?? 3,
  };

  // Primary attempt: Mistral
  let primaryResult: T | undefined;
  let primaryError: Error | undefined;

  try {
    const mistralResult = await extractWithMistral(
      extractOptions,
      options.providers?.mistral,
    );

    attempts.push({
      provider: "mistral",
      success: mistralResult.success,
      error: mistralResult.error,
      result: mistralResult.result,
      duration: mistralResult.duration,
    });

    if (mistralResult.success && mistralResult.result) {
      primaryResult = mistralResult.result as T;

      // Check quality
      const isQualityGood = validateQuality(
        primaryResult,
        schema,
        options.qualityThreshold,
      );

      if (isQualityGood) {
        return primaryResult;
      }

      // Quality is poor, but we have a result - continue to fallback and merge
    } else {
      primaryError = mistralResult.error;
    }
  } catch (error) {
    primaryError = error instanceof Error ? error : new Error(String(error));
    attempts.push({
      provider: "mistral",
      success: false,
      error: primaryError,
    });
  }

  // Secondary attempt: Gemini
  let fallbackResult: T | undefined;
  let fallbackError: Error | undefined;

  try {
    const geminiResult = await extractWithGemini(
      extractOptions,
      options.providers?.gemini,
    );

    attempts.push({
      provider: "gemini",
      success: geminiResult.success,
      error: geminiResult.error,
      result: geminiResult.result,
      duration: geminiResult.duration,
    });

    if (geminiResult.success && geminiResult.result) {
      fallbackResult = geminiResult.result as T;

      // If we have primary result, merge them
      if (primaryResult) {
        return mergeResults(primaryResult, fallbackResult);
      }

      // Check quality of fallback
      const isQualityGood = validateQuality(
        fallbackResult,
        schema,
        options.qualityThreshold,
      );

      if (isQualityGood) {
        return fallbackResult;
      }

      // Quality is poor, continue to OCR fallback
    } else {
      fallbackError = geminiResult.error;
    }
  } catch (error) {
    fallbackError = error instanceof Error ? error : new Error(String(error));
    attempts.push({
      provider: "gemini",
      success: false,
      error: fallbackError,
    });
  }

  // Tertiary attempt: OCR + LLM (only for PDFs)
  if (normalizedInput.mediaType === "application/pdf") {
    try {
      const ocrResult = await extractWithOCRFallback(
        extractOptions,
        options.providers?.mistral,
      );

      attempts.push({
        provider: "ocr-fallback",
        success: ocrResult.success,
        error: ocrResult.error,
        result: ocrResult.result,
        duration: ocrResult.duration,
      });

      if (ocrResult.success && ocrResult.result) {
        const ocrData = ocrResult.result as T;

        // Merge with any existing results
        if (primaryResult) {
          return mergeResults(primaryResult, ocrData);
        }
        if (fallbackResult) {
          return mergeResults(fallbackResult, ocrData);
        }

        return ocrData;
      }
    } catch (error) {
      attempts.push({
        provider: "ocr-fallback",
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  // If we have any result (even if quality is poor), return it
  if (primaryResult) {
    return primaryResult;
  }
  if (fallbackResult) {
    return fallbackResult;
  }

  // All attempts failed
  const finalError =
    primaryError || fallbackError || new Error("All OCR providers failed");

  throw new OCRError(
    `Failed to extract data from document: ${finalError.message}`,
    attempts,
    finalError,
  );
}
