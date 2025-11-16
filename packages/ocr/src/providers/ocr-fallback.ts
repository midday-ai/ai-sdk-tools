import { generateObject } from "ai";
import { retryCall } from "../utils.js";
import type { ExtractOptions, ProviderResult } from "./types.js";

let unpdfModule: any;

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  if (!unpdfModule) {
    try {
      // @ts-expect-error - Optional dependency
      unpdfModule = await import("unpdf");
    } catch {
      throw new Error(
        "unpdf is not installed. Install it with: npm install unpdf",
      );
    }
  }

  const { getDocumentProxy, extractText } = unpdfModule;
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  // Clean up unsupported Unicode escape sequences
  return text.replaceAll("\u0000", "");
}

export async function extractWithOCRFallback<T>(
  options: ExtractOptions<T>,
  config?: { model?: string; apiKey?: string },
): Promise<ProviderResult<T>> {
  const startTime = Date.now();

  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(options.input.data, "base64");

    // Extract text from PDF
    let text: string;
    if (options.input.mediaType === "application/pdf") {
      text = await extractTextFromPDF(buffer);
    } else {
      // For images, we can't extract text directly, so this fallback won't work
      // Return error indicating OCR fallback is only for PDFs
      return {
        success: false,
        error: new Error("OCR fallback is only available for PDF documents"),
        duration: Date.now() - startTime,
      };
    }

    // Update the prompt to indicate we're using extracted text
    const textPrompt = `${options.prompt}\n\nExtract structured data from the following OCR text:`;

    const result = await retryCall(
      async () => {
        // @ts-expect-error - Optional peer dependency
        const mistral = await import("@ai-sdk/mistral");
        const model = config?.model || "mistral-medium-latest";
        const apiKey = config?.apiKey || process.env.MISTRAL_API_KEY;
        if (!apiKey) {
          throw new Error(
            "Mistral API key is required. Set MISTRAL_API_KEY or provide apiKey in config",
          );
        }
        const mistralModel = mistral.mistral(model, { apiKey });

        return generateObject({
          model: mistralModel,
          schema: options.schema,
          temperature: 0.1,
          abortSignal: AbortSignal.timeout(options.timeout || 20000),
          messages: [
            {
              role: "system",
              content: textPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: text,
                },
              ],
            },
          ],
        });
      },
      {
        retries: options.retries || 3,
        timeout: options.timeout || 20000,
      },
    );

    return {
      success: true,
      result: result.object as T,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      duration: Date.now() - startTime,
    };
  }
}
