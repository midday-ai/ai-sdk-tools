import type { AIEvent } from "../types";
import { createDebugLogger } from "./debug";
import { parseSSEEvent } from "./event-parser";

export interface StreamInterceptorOptions {
  onEvent: (event: AIEvent) => void;
  endpoints: string[];
  enabled: boolean;
  debug?: boolean;
}

export class StreamInterceptor {
  private originalFetch: typeof fetch;
  private options: StreamInterceptorOptions;
  private eventIdCounter = 0;
  private isPatched = false;
  private hasErrors = false; // Safety flag to disable on errors

  constructor(options: StreamInterceptorOptions) {
    this.originalFetch = window.fetch.bind(window);
    this.options = options;

    const debugLog = createDebugLogger(options.debug || false);
    debugLog("[AI Devtools] StreamInterceptor constructor completed");
  }

  private generateEventId(): string {
    return `sse_event_${Date.now()}_${this.eventIdCounter++}`;
  }

  private shouldInterceptUrl(url: string): boolean {
    // More flexible matching - check if URL contains any of the endpoints
    // or if it's a chat-related endpoint
    const shouldIntercept = this.options.endpoints.some((endpoint) => {
      // Direct match
      if (url.includes(endpoint)) {
        return true;
      }

      return false;
    });

    return shouldIntercept;
  }

  private async interceptStreamResponse(response: Response): Promise<Response> {
    if (!response.body) {
      return response;
    }

    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Create a new readable stream that we can intercept
      const stream = new ReadableStream({
        start: (controller) => {
          const pump = async (): Promise<void> => {
            try {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                return;
              }

              // CRITICAL: Pass the original chunk through FIRST
              // This ensures the original stream is never blocked
              controller.enqueue(value);

              try {
                const chunk = decoder.decode(value, { stream: true });
                this.parseSSEChunk(chunk);
              } catch (parseError) {
                // Log parsing errors but don't break the stream
              }

              return pump();
            } catch (error) {
              // Forward stream errors to the original consumer
              controller.error(error);
            }
          };

          return pump();
        },
      });

      // Return a new response with our intercepted stream
      // Preserve ALL original response properties
      return new Response(stream, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers), // Clone headers to avoid mutation
      });
    } catch (error) {
      // If anything goes wrong with our interception, return the original response
      return response;
    }
  }

  private parseSSEChunk(chunk: string): void {
    const debugLog = createDebugLogger(this.options.debug || false);

    // Split chunk into lines
    const lines = chunk.split("\n");
    let eventType = "";
    let eventData = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === "") {
        // Empty line indicates end of event
        if (eventData) {
          const event = parseSSEEvent(
            eventData,
            eventType,
            this.generateEventId(),
          );
          if (event) {
            debugLog("[AI Devtools] Event parsed successfully:", event.type);
            this.options.onEvent(event);
          }
        }
        eventType = "";
        eventData = "";
      } else if (trimmedLine.startsWith("event:")) {
        eventType = trimmedLine.substring(6).trim();
      } else if (trimmedLine.startsWith("data:")) {
        const data = trimmedLine.substring(5).trim();
        eventData += (eventData ? "\n" : "") + data;
      }
    }

    // Handle case where chunk doesn't end with empty line
    if (eventData) {
      const event = parseSSEEvent(eventData, eventType, this.generateEventId());
      if (event) {
        debugLog("[AI Devtools] Event parsed successfully:", event.type);
        this.options.onEvent(event);
      }
    }
  }

  public patch(): void {
    const debugLog = createDebugLogger(this.options.debug || false);

    debugLog("[AI Devtools] StreamInterceptor.patch() called");

    if (this.isPatched || !this.options.enabled) {
      debugLog("[AI Devtools] Patch skipped - already patched or not enabled");
      return;
    }

    (window.fetch as any) = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = typeof input === "string" ? input : input.toString();

      // Safety: Skip interception if we've had errors
      if (this.hasErrors) {
        return this.originalFetch(input, init);
      }

      // Check if this is a request we should intercept
      if (this.shouldInterceptUrl(url)) {
        debugLog("[AI Devtools] Intercepting fetch request:", url);
        try {
          const response = await this.originalFetch(input, init);

          // Check if this is a streaming response
          const contentType = response.headers.get("content-type");

          if (
            contentType &&
            (contentType.includes("text/event-stream") ||
              contentType.includes("text/plain"))
          ) {
            // SAFETY: Only intercept if response is successful and has a body
            if (response.ok && response.body) {
              try {
                return await this.interceptStreamResponse(response);
              } catch (interceptError) {
                // If interception fails, disable future interceptions and return original response
                this.hasErrors = true;
                return response;
              }
            } else {
              // Return original response if not successful or no body
              return response;
            }
          } else {
            // Return the original response for non-streaming responses
            return response;
          }
        } catch (error) {
          // Create an error event
          const errorEvent: AIEvent = {
            id: this.generateEventId(),
            timestamp: Date.now(),
            type: "error",
            data: {
              error:
                error instanceof Error
                  ? error.message
                  : "Network request failed",
              url,
              method: init?.method || "GET",
            },
          };
          this.options.onEvent(errorEvent);
          throw error;
        }
      }

      // For non-intercepted requests, use original fetch
      return this.originalFetch(input, init);
    };

    this.isPatched = true;
  }

  public unpatch(): void {
    if (!this.isPatched) {
      return;
    }

    window.fetch = this.originalFetch;
    this.isPatched = false;
  }

  public updateOptions(options: Partial<StreamInterceptorOptions>): void {
    this.options = { ...this.options, ...options };

    if (!this.options.enabled && this.isPatched) {
      this.unpatch();
    } else if (this.options.enabled && !this.isPatched) {
      this.patch();
    }
  }

  public isActive(): boolean {
    return this.isPatched;
  }
}
