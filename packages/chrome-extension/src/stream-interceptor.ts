// Simplified stream interceptor for Chrome extension

interface AIEvent {
  id: string;
  timestamp: number;
  type: string;
  data: any;
  metadata?: {
    toolName?: string;
    messageId?: string;
  };
}

interface StreamInterceptorOptions {
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

  constructor(options: StreamInterceptorOptions) {
    this.originalFetch = window.fetch.bind(window);
    this.options = options;
  }

  private generateEventId(): string {
    return `sse_event_${Date.now()}_${this.eventIdCounter++}`;
  }

  private shouldInterceptUrl(url: string): boolean {
    return this.options.endpoints.some((endpoint) => {
      return url.includes(endpoint);
    });
  }

  private async interceptStreamResponse(response: Response): Promise<Response> {
    if (!response.body) {
      return response;
    }

    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const stream = new ReadableStream({
        start: (controller) => {
          const pump = async (): Promise<void> => {
            try {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                return;
              }

              controller.enqueue(value);

              try {
                const chunk = decoder.decode(value, { stream: true });
                this.parseSSEChunk(chunk);
              } catch (_parseError) {
                // Log parsing errors but don't break the stream
              }

              return pump();
            } catch (error) {
              controller.error(error);
            }
          };

          return pump();
        },
      });

      return new Response(stream, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      });
    } catch (_error) {
      return response;
    }
  }

  private parseSSEChunk(chunk: string): void {
    const lines = chunk.split("\n");
    let eventType = "";
    let eventData = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === "") {
        if (eventData) {
          const event = this.parseSSEEvent(eventData, eventType);
          if (event) {
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

    if (eventData) {
      const event = this.parseSSEEvent(eventData, eventType);
      if (event) {
        this.options.onEvent(event);
      }
    }
  }

  private parseSSEEvent(data: string, eventType: string): AIEvent | null {
    try {
      const parsedData = JSON.parse(data);
      return {
        id: this.generateEventId(),
        timestamp: Date.now(),
        type: eventType || "unknown",
        data: parsedData,
        metadata: {
          messageId: parsedData.id,
          toolName: parsedData.toolName,
        },
      };
    } catch (_error) {
      return {
        id: this.generateEventId(),
        timestamp: Date.now(),
        type: eventType || "unknown",
        data: { raw: data },
      };
    }
  }

  public patch(): void {
    if (this.isPatched || !this.options.enabled) {
      return;
    }

    (window.fetch as any) = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = typeof input === "string" ? input : input.toString();

      if (this.shouldInterceptUrl(url)) {
        try {
          const response = await this.originalFetch(input, init);
          const contentType = response.headers.get("content-type");

          if (
            contentType &&
            (contentType.includes("text/event-stream") ||
              contentType.includes("text/plain"))
          ) {
            if (response.ok && response.body) {
              return await this.interceptStreamResponse(response);
            }
          }
          return response;
        } catch (error) {
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
