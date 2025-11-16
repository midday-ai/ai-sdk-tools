import { generateObject } from "ai";
import { retryCall } from "../utils.js";
import type { ExtractOptions, ProviderResult } from "./types.js";

let mistralProvider: any;

async function getMistralProvider(config?: {
  model?: string;
  apiKey?: string;
}) {
  if (!mistralProvider) {
    try {
      // @ts-expect-error - Optional peer dependency
      const mistral = await import("@ai-sdk/mistral");
      mistralProvider = mistral.mistral;
    } catch {
      throw new Error(
        "@ai-sdk/mistral is not installed. Install it with: npm install @ai-sdk/mistral",
      );
    }
  }

  const apiKey = config?.apiKey || process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Mistral API key is required. Set MISTRAL_API_KEY or provide apiKey in config",
    );
  }

  const model = config?.model || "mistral-medium-latest";
  return mistralProvider(model, { apiKey });
}

export async function extractWithMistral<T>(
  options: ExtractOptions<T>,
  config?: { model?: string; apiKey?: string },
): Promise<ProviderResult<T>> {
  const startTime = Date.now();

  try {
    const model = await getMistralProvider(config);

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
                  type: "file",
                  data: options.input.data,
                  mediaType: options.input.mediaType,
                },
              ],
            },
          ],
          providerOptions: {
            mistral: {
              documentPageLimit: 10,
            },
          },
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
