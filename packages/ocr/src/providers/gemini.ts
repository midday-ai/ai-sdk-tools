import { generateObject } from "ai";
import { retryCall } from "../utils.js";
import type { ExtractOptions, ProviderResult } from "./types.js";

let geminiProvider: any;

async function getGeminiProvider(config?: { model?: string; apiKey?: string }) {
  if (!geminiProvider) {
    try {
      // @ts-expect-error - Optional peer dependency
      const google = await import("@ai-sdk/google");
      geminiProvider = google.google;
    } catch {
      throw new Error(
        "@ai-sdk/google is not installed. Install it with: npm install @ai-sdk/google",
      );
    }
  }

  const apiKey = config?.apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google API key is required. Set GOOGLE_GENERATIVE_AI_API_KEY or provide apiKey in config",
    );
  }

  const model = config?.model || "gemini-1.5-pro";
  return geminiProvider(model, { apiKey });
}

export async function extractWithGemini<T>(
  options: ExtractOptions<T>,
  config?: { model?: string; apiKey?: string },
): Promise<ProviderResult<T>> {
  const startTime = Date.now();

  try {
    const model = await getGeminiProvider(config);

    // Convert base64 to data URI for Gemini
    const dataUri = `data:${options.input.mediaType};base64,${options.input.data}`;

    const result = await retryCall(
      () =>
        generateObject({
          model,
          schema: options.schema,
          temperature: 0.1,
          abortSignal: AbortSignal.timeout(options.timeout || 20000),
          messages: [
            {
              role: "system",
              content: options.prompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "image",
                  image: dataUri,
                },
              ],
            },
          ],
        }),
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
