import type { z } from "zod";

export interface ProviderResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  duration: number;
}

export interface ProviderConfig {
  model?: string;
  apiKey?: string;
}

export interface ExtractOptions<T> {
  schema: z.ZodSchema<T>;
  input: { data: string; mediaType: string };
  prompt: string;
  timeout?: number;
  retries?: number;
}

