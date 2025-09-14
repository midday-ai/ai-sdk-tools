import type { AIEvent } from "../types";

/**
 * Parses a Server-Sent Event message and converts it to an AIEvent
 */
export function parseSSEEvent(
  eventData: string,
  eventType: string,
  eventId: string,
): AIEvent | null {
  const timestamp = Date.now();

  try {
    // Handle [DONE] message
    if (eventData.trim() === "[DONE]") {
      return {
        id: eventId,
        timestamp,
        type: "stream-done",
        data: {
          message: "[DONE]",
        },
      };
    }

    // Try to parse JSON data
    let parsedData: any;
    try {
      parsedData = JSON.parse(eventData);
    } catch {
      // If not JSON, treat as plain text
      parsedData = { message: eventData };
    }

    // Use the parsed data to create an event
    return parseEventFromDataPart(parsedData, eventId);
  } catch (error) {
    // Create an error event for parsing failures
    return {
      id: eventId,
      timestamp,
      type: "error",
      data: {
        error:
          error instanceof Error ? error.message : "Failed to parse SSE event",
        originalData: eventData,
        originalType: eventType,
      },
    };
  }
}

/**
 * Parses a data part from the AI stream and converts it to an AIEvent
 * This function handles AI SDK stream parts and custom event types
 */
export function parseEventFromDataPart(
  dataPart: any,
  eventId: string,
): AIEvent | null {
  const timestamp = Date.now();

  // Handle different types of data parts
  if (!dataPart || typeof dataPart !== "object") {
    return null;
  }

  // Check if this is a standard AI SDK stream part
  if (dataPart.type && isAIStreamPart(dataPart)) {
    return parseAIStreamPart(dataPart, eventId, timestamp);
  }

  // Tool call events - these come from the AI SDK
  if (dataPart.type?.startsWith("tool-call")) {
    const toolName =
      extractToolNameFromType(dataPart.type) ||
      extractToolNameFromData(dataPart) ||
      "unknown";

    if (dataPart.type.endsWith("-start")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-start",
        data: {
          toolName,
          toolParams: dataPart.args || dataPart.parameters || {},
        },
        metadata: {
          toolName,
          toolParams: dataPart.args || dataPart.parameters || {},
          messageId: dataPart.id,
        },
      };
    }

    if (dataPart.type.endsWith("-result") || dataPart.type.includes("result")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-result",
        data: {
          toolName,
          result: dataPart.result || dataPart.data,
          duration: dataPart.duration,
        },
        metadata: {
          toolName,
          duration: dataPart.duration,
          messageId: dataPart.id,
        },
      };
    }

    if (dataPart.type.endsWith("-error") || dataPart.type.includes("error")) {
      return {
        id: eventId,
        timestamp,
        type: "tool-call-error",
        data: {
          toolName,
          error: dataPart.error || dataPart.message || "Tool execution failed",
        },
        metadata: {
          toolName,
          messageId: dataPart.id,
        },
      };
    }
  }

  // Tool input events
  if (dataPart.type === "tool-input-start") {
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName: dataPart.toolName,
        toolCallId: dataPart.toolCallId,
        toolParams: {},
      },
      metadata: {
        toolName: dataPart.toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "tool-input-delta") {
    const toolName =
      dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        inputDelta: dataPart.inputTextDelta,
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "tool-input-available") {
    const toolName =
      dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-start",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        toolParams: dataPart.input || {},
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "tool-output-available") {
    // For tool-output-available, we might not have toolName in the data
    // This will be resolved by the session grouping logic
    const toolName =
      dataPart.toolName || extractToolNameFromData(dataPart) || "unknown";
    return {
      id: eventId,
      timestamp,
      type: "tool-call-result",
      data: {
        toolName,
        toolCallId: dataPart.toolCallId,
        result: dataPart.output,
        preliminary: dataPart.preliminary,
      },
      metadata: {
        toolName,
        toolCallId: dataPart.toolCallId,
        preliminary: dataPart.preliminary,
        messageId: dataPart.id,
      },
    };
  }

  // Tool events with different format
  if (dataPart.type?.startsWith("tool-")) {
    const toolName = dataPart.type.replace("tool-", "");

    return {
      id: eventId,
      timestamp,
      type: "tool-call-result",
      data: {
        toolName,
        result: dataPart.output || dataPart.data,
        duration: dataPart.duration,
      },
      metadata: {
        toolName,
        duration: dataPart.duration,
        messageId: dataPart.id,
      },
    };
  }

  // New streaming event types
  if (dataPart.type === "start") {
    return {
      id: eventId,
      timestamp,
      type: "start",
      data: dataPart,
    };
  }

  if (dataPart.type === "reasoning-start") {
    return {
      id: eventId,
      timestamp,
      type: "reasoning-start",
      data: dataPart,
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "reasoning-end") {
    return {
      id: eventId,
      timestamp,
      type: "reasoning-end",
      data: dataPart,
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "start-step") {
    return {
      id: eventId,
      timestamp,
      type: "start-step",
      data: {
        step: dataPart.step || "unknown",
      },
    };
  }

  if (dataPart.type === "text-start") {
    return {
      id: eventId,
      timestamp,
      type: "text-start",
      data: {
        id: dataPart.id,
        providerMetadata: dataPart.providerMetadata,
      },
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "text-delta") {
    return {
      id: eventId,
      timestamp,
      type: "text-delta",
      data: {
        id: dataPart.id,
        delta: dataPart.delta || "",
      },
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "text-end") {
    return {
      id: eventId,
      timestamp,
      type: "text-end",
      data: {
        id: dataPart.id,
      },
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "finish-step") {
    return {
      id: eventId,
      timestamp,
      type: "finish-step",
      data: {
        step: dataPart.step || "unknown",
      },
    };
  }

  if (dataPart.type === "finish") {
    return {
      id: eventId,
      timestamp,
      type: "finish",
      data: {
        reason: dataPart.reason,
      },
    };
  }

  // Handle custom data types (data-canvas, data-weather, etc.)
  if (dataPart.type?.startsWith("data-")) {
    const dataType = dataPart.type.replace("data-", "");
    return {
      id: eventId,
      timestamp,
      type: "custom-data",
      data: {
        dataType,
        data: dataPart.data,
        id: dataPart.id,
        transient: dataPart.transient,
      },
      metadata: {
        originalType: dataPart.type,
        dataType,
        transient: dataPart.transient,
      },
    };
  }

  // Handle [DONE] message
  if (
    dataPart === "[DONE]" ||
    (typeof dataPart === "string" && dataPart.trim() === "[DONE]")
  ) {
    return {
      id: eventId,
      timestamp,
      type: "stream-done",
      data: {
        message: "[DONE]",
      },
    };
  }

  // Message events (legacy support)
  if (
    dataPart.type === "text" ||
    (dataPart.type === "text-delta" && !dataPart.delta)
  ) {
    return {
      id: eventId,
      timestamp,
      type: "message-chunk",
      data: {
        text: dataPart.text || dataPart.textDelta || "",
        messageId: dataPart.id,
      },
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  // Message start/complete events
  if (dataPart.type === "message-start") {
    return {
      id: eventId,
      timestamp,
      type: "message-start",
      data: dataPart,
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  if (dataPart.type === "message-complete" || dataPart.type === "finish") {
    return {
      id: eventId,
      timestamp,
      type: "message-complete",
      data: dataPart,
      metadata: {
        messageId: dataPart.id,
      },
    };
  }

  // Error events
  if (dataPart.type === "error" || dataPart.error) {
    return {
      id: eventId,
      timestamp,
      type: "error",
      data: {
        error: dataPart.error || dataPart.message || "Unknown error",
        details: dataPart,
      },
    };
  }

  // Unknown/generic events - capture everything else
  return {
    id: eventId,
    timestamp,
    type: "unknown",
    data: dataPart,
    metadata: {
      originalType: dataPart.type,
      messageId: dataPart.id,
    },
  };
}

/**
 * Extracts tool name from event type like 'tool-call-get-expenses-start'
 * Also handles AI SDK stream events with tool names in data
 */
function extractToolNameFromType(type: string): string {
  // Remove 'tool-call-' prefix and '-start'/'-result'/'error' suffix
  let toolName = type.replace(/^tool-call-/, "");
  toolName = toolName.replace(/-(?:start|result|error)$/, "");
  return toolName;
}

/**
 * Checks if a data part is a standard AI SDK stream part
 */
function isAIStreamPart(dataPart: any): boolean {
  const aiStreamTypes = [
    "text-delta",
    "text-done",
    "tool-call",
    "tool-result",
    "data",
    "error",
    "finish",
  ];
  return aiStreamTypes.includes(dataPart.type);
}

/**
 * Parses a standard AI SDK stream part
 */
function parseAIStreamPart(
  dataPart: any,
  eventId: string,
  timestamp: number,
): AIEvent | null {
  switch (dataPart.type) {
    case "text-delta":
      return {
        id: eventId,
        timestamp,
        type: "text-delta",
        data: dataPart,
        metadata: {
          messageId: dataPart.id,
        },
      };

    case "text-done":
      return {
        id: eventId,
        timestamp,
        type: "text-end",
        data: dataPart,
        metadata: {
          messageId: dataPart.id,
        },
      };

    case "tool-call":
      return {
        id: eventId,
        timestamp,
        type: "tool-call-start",
        data: dataPart,
        metadata: {
          toolName: dataPart.toolName,
          toolCallId: dataPart.toolCallId,
          toolParams: dataPart.args || {},
        },
      };

    case "tool-result":
      return {
        id: eventId,
        timestamp,
        type: "tool-call-result",
        data: dataPart,
        metadata: {
          toolName: dataPart.toolName,
          toolCallId: dataPart.toolCallId,
          duration: dataPart.duration,
        },
      };

    case "data":
      return {
        id: eventId,
        timestamp,
        type: "custom-data", // Custom data events
        data: dataPart,
        metadata: {
          originalType: dataPart.type,
        },
      };

    case "error":
      return {
        id: eventId,
        timestamp,
        type: "error",
        data: dataPart,
        metadata: {
          originalType: dataPart.type,
        },
      };

    case "finish":
      return {
        id: eventId,
        timestamp,
        type: "finish",
        data: dataPart,
        metadata: {
          originalType: dataPart.type,
        },
      };

    default:
      return null;
  }
}

/**
 * Extracts tool name from AI SDK stream data
 */
function extractToolNameFromData(dataPart: any): string | null {
  // Check for tool name in various common locations
  if (dataPart.toolName) return dataPart.toolName;
  if (dataPart.name) return dataPart.name;
  if (dataPart.tool) return dataPart.tool;
  if (dataPart.function) return dataPart.function;

  // Check in nested objects
  if (dataPart.toolCall?.name) return dataPart.toolCall.name;
  if (dataPart.toolCall?.function) return dataPart.toolCall.function;

  // Check for tool name in args or parameters
  if (dataPart.args?.toolName) return dataPart.args.toolName;
  if (dataPart.parameters?.toolName) return dataPart.parameters.toolName;
  if (dataPart.input?.toolName) return dataPart.input.toolName;

  // Check for function name in args
  if (dataPart.args?.function) return dataPart.args.function;
  if (dataPart.args?.name) return dataPart.args.name;

  // Check for tool name in metadata
  if (dataPart.metadata?.toolName) return dataPart.metadata.toolName;

  return null;
}

/**
 * Formats event data for display
 */
export function formatEventData(event: AIEvent): string {
  try {
    return JSON.stringify(event.data, null, 2);
  } catch {
    return String(event.data);
  }
}

/**
 * Gets a human-readable description of the event
 */
export function getEventDescription(event: AIEvent): string {
  switch (event.type) {
    case "tool-call-start": {
      const toolName =
        event.data.toolName || event.metadata?.toolName || "unknown";
      const inputDelta = event.data.inputDelta;
      if (inputDelta) {
        return `TOOL INPUT ${toolName} "${inputDelta}"`;
      }
      return `TOOL START ${toolName}`;
    }

    case "tool-call-result": {
      const toolName =
        event.data.toolName || event.metadata?.toolName || "unknown";
      const duration = event.metadata?.duration
        ? ` (${event.metadata.duration}ms)`
        : "";
      const preliminary = event.metadata?.preliminary ? " [preliminary]" : "";
      return `TOOL DONE ${toolName}${duration}${preliminary}`;
    }

    case "tool-call-error":
      return `TOOL ERROR ${event.metadata?.toolName || event.data.toolName || "unknown"}`;

    case "message-start":
      return "MESSAGE START";

    case "message-chunk": {
      const textPreview = event.data.text?.substring(0, 30) || "";
      return `CHUNK "${textPreview}${textPreview.length >= 30 ? "..." : ""}"`;
    }

    case "message-complete":
      return "MESSAGE DONE";

    case "start":
      return "STREAM START";

    case "reasoning-start":
      return "REASONING START";

    case "reasoning-end":
      return "REASONING END";

    case "start-step":
      return "STEP START";

    case "text-start":
      return `TEXT START ${event.data.id}`;

    case "text-delta": {
      const deltaPreview = event.data.delta?.substring(0, 20) || "";
      return `TEXT "${deltaPreview}${deltaPreview.length >= 20 ? "..." : ""}"`;
    }

    case "text-end":
      return `TEXT END ${event.data.id}`;

    case "finish-step":
      return "STEP DONE";

    case "finish": {
      return `STREAM DONE${event.data.reason ? ` (${event.data.reason})` : ""}`;
    }

    case "stream-done":
      return "STREAM [DONE]";

    case "error":
      return `ERROR ${event.data.error}`;

    case "custom-data": {
      const dataType =
        event.metadata?.dataType || event.data.dataType || "data";
      const isTransient = event.metadata?.transient || event.data.transient;
      const transientLabel = isTransient ? " (transient)" : "";
      return `DATA ${dataType.toUpperCase()}${transientLabel}`;
    }

    case "unknown":
      return `UNKNOWN ${event.metadata?.originalType || "no type"}`;

    default:
      return String(event.type).toUpperCase();
  }
}
