import type { OCRInput } from "./types.js";

export interface RetryOptions {
  retries?: number;
  timeout?: number;
  delay?: number;
}

/**
 * Convert various input formats to a format suitable for AI SDK
 */
export async function normalizeInput(
  input: OCRInput,
): Promise<{ data: string; mediaType: string }> {
  // Handle Buffer
  if (Buffer.isBuffer(input)) {
    const base64 = input.toString("base64");
    // Try to detect media type from buffer
    const mediaType = detectMediaType(input);
    return { data: base64, mediaType };
  }

  // Handle File object
  if (input instanceof File) {
    const arrayBuffer = await input.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mediaType = input.type || detectMediaType(buffer);
    return { data: base64, mediaType };
  }

  // Handle string (base64, file path, or URL)
  if (typeof input === "string") {
    // Check if it's a data URI
    if (input.startsWith("data:")) {
      const [header, data] = input.split(",");
      const mediaType = header.match(/data:([^;]+)/)?.[1] || "image/png";
      return { data, mediaType };
    }

    // Check if it's a URL
    if (input.startsWith("http://") || input.startsWith("https://")) {
      const response = await fetch(input);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const contentType = response.headers.get("content-type") || "image/png";
      return { data: base64, mediaType: contentType };
    }

    // Check if it's a file path (Node.js only)
    if (typeof process !== "undefined" && process.versions?.node) {
      try {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        try {
          await fs.access(input);
          const buffer = await fs.readFile(input);
          const base64 = buffer.toString("base64");
          const ext = path.extname(input).toLowerCase();
          const mediaType = getMediaTypeFromExtension(ext);
          return { data: base64, mediaType };
        } catch {
          // File doesn't exist, continue to treat as base64
        }
      } catch {
        // fs/promises not available, continue to treat as base64
      }
    }

    // Assume it's base64
    return { data: input, mediaType: "image/png" };
  }

  throw new Error("Unsupported input format");
}

/**
 * Detect media type from buffer content
 */
function detectMediaType(buffer: Buffer): string {
  // Check for PDF
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }

  // Check for PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // Check for JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return "image/jpeg";
  }

  // Check for GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }

  // Default to PNG
  return "image/png";
}

/**
 * Get media type from file extension
 */
function getMediaTypeFromExtension(ext: string): string {
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return map[ext] || "image/png";
}

/**
 * Retry a function with exponential backoff
 */
export async function retryCall<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { retries = 3, timeout = 20000, delay = 1000 } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const result = await fn();
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt < retries) {
        const backoffDelay = delay * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError || new Error("Retry failed");
}
