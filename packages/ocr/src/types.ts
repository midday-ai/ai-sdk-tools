export type DocumentType = "invoice" | "receipt";

export interface MistralConfig {
  model?: string;
  apiKey?: string;
}

export interface GeminiConfig {
  model?: string;
  apiKey?: string;
}

export interface ProviderConfig {
  mistral?: MistralConfig;
  gemini?: GeminiConfig;
}

export interface OCROptions {
  providers?: ProviderConfig;
  timeout?: number;
  retries?: number;
  qualityThreshold?: QualityThreshold;
}

export interface QualityThreshold {
  requireTotal?: boolean;
  requireCurrency?: boolean;
  requireVendor?: boolean;
  requireDate?: boolean;
}

export interface ProviderAttempt {
  provider: "mistral" | "gemini" | "ocr-fallback";
  success: boolean;
  error?: Error;
  result?: unknown;
  duration?: number;
}

export class OCRError extends Error {
  constructor(
    message: string,
    public attempts: ProviderAttempt[],
    public finalError?: Error,
  ) {
    super(message);
    this.name = "OCRError";
  }
}

export type OCRInput = Buffer | string | File;
