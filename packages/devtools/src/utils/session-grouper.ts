import type { AIEvent, ToolCallSession } from "../types";

/**
 * Extracts tool name from an event, trying multiple sources
 */
function extractToolNameFromEvent(event: AIEvent): string {
  // Try metadata first
  if (event.metadata?.toolName) return event.metadata.toolName;

  // Try data object
  if (event.data?.toolName) return event.data.toolName;

  // Try other common locations in data
  if (event.data?.name) return event.data.name;
  if (event.data?.tool) return event.data.tool;
  if (event.data?.function) return event.data.function;

  // Try nested objects
  if (event.data?.toolCall?.name) return event.data.toolCall.name;
  if (event.data?.toolCall?.function) return event.data.toolCall.function;

  // Try args
  if (event.data?.args?.toolName) return event.data.args.toolName;
  if (event.data?.args?.function) return event.data.args.function;
  if (event.data?.args?.name) return event.data.args.name;

  // For tool-input-delta events, we can't extract tool name from the event itself
  // This will be handled by the session context logic
  return "unknown";
}

/**
 * Groups events into tool call sessions for better debugging experience
 */
export function groupEventsIntoSessions(events: AIEvent[]): {
  sessions: ToolCallSession[];
  standaloneEvents: AIEvent[];
} {
  const sessions: ToolCallSession[] = [];
  const standaloneEvents: AIEvent[] = [];
  const activeSessions = new Map<string, ToolCallSession>();
  let sessionCounter = 0;

  for (const event of events) {
    // Check if this event belongs to a tool call session
    const toolCallId = event.metadata?.toolCallId;
    let toolName = extractToolNameFromEvent(event);

    if (toolCallId) {
      // This event belongs to a tool call session
      if (!activeSessions.has(toolCallId)) {
        // Start a new session with a unique ID that combines toolCallId and counter
        const uniqueSessionId = `${toolCallId}_${sessionCounter++}`;
        const session: ToolCallSession = {
          id: uniqueSessionId,
          toolName,
          toolCallId,
          startTime: event.timestamp,
          status: "running",
          events: [event],
          startEvent: event,
        };
        activeSessions.set(toolCallId, session);
      } else {
        // Add to existing session
        const session = activeSessions.get(toolCallId)!;

        // If this event doesn't have a tool name but the session does, use the session's tool name
        if (toolName === "unknown" && session.toolName !== "unknown") {
          toolName = session.toolName;
          // Update the event's metadata to include the tool name for consistency
          if (!event.metadata) {
            event.metadata = {};
          }
          event.metadata.toolName = toolName;
          if (!event.data) {
            event.data = {};
          }
          event.data.toolName = toolName;
        }

        // Also update the event's tool name in the data object for display purposes
        if (toolName !== "unknown") {
          if (!event.data) {
            event.data = {};
          }
          event.data.toolName = toolName;
          if (!event.metadata) {
            event.metadata = {};
          }
          event.metadata.toolName = toolName;
        }

        // If this event has a better tool name than the session, update the session
        if (toolName !== "unknown" && session.toolName === "unknown") {
          session.toolName = toolName;
        }

        session.events.push(event);

        // Check if this is an end event
        if (
          event.type === "tool-call-result" ||
          event.type === "tool-call-error"
        ) {
          // Ensure the final event has the correct tool name
          if (session.toolName !== "unknown") {
            if (!event.metadata) {
              event.metadata = {};
            }
            event.metadata.toolName = session.toolName;
            if (!event.data) {
              event.data = {};
            }
            event.data.toolName = session.toolName;
          }

          // Only complete the session if this is not a preliminary result
          // or if it's an error (errors should always complete the session)
          const isPreliminary = event.metadata?.preliminary === true;
          const shouldComplete =
            event.type === "tool-call-error" || !isPreliminary;

          if (shouldComplete) {
            session.endTime = event.timestamp;
            session.duration = event.timestamp - session.startTime;
            session.status = "completed";
            session.endEvent = event;

            // Move to completed sessions
            sessions.push(session);
            activeSessions.delete(toolCallId);
          }
        }
      }
    } else if (isToolCallStartEvent(event)) {
      // Tool call start without toolCallId - create standalone session
      const toolName = extractToolNameFromEvent(event);
      const sessionId = `standalone_${event.timestamp}_${sessionCounter++}_${toolName}`;
      const session: ToolCallSession = {
        id: sessionId,
        toolName,
        startTime: event.timestamp,
        status: "running",
        events: [event],
        startEvent: event,
      };
      activeSessions.set(sessionId, session);
    } else {
      // This is a standalone event (not part of a tool call)
      standaloneEvents.push(event);
    }
  }

  // Add any remaining active sessions
  for (const session of activeSessions.values()) {
    sessions.push(session);
  }

  // Sort sessions by start time
  sessions.sort((a, b) => a.startTime - b.startTime);

  return { sessions, standaloneEvents };
}

/**
 * Checks if an event is a tool call start event
 */
function isToolCallStartEvent(event: AIEvent): boolean {
  return (
    event.type === "tool-call-start" ||
    (event.type === "unknown" &&
      event.metadata?.originalType === "tool-input-start") ||
    (event.type === "unknown" &&
      event.metadata?.originalType === "tool-input-available" &&
      !!event.metadata?.toolName)
  );
}

/**
 * Gets a summary of a tool call session
 */
export function getSessionSummary(session: ToolCallSession): string {
  const duration = session.duration ? `${session.duration}ms` : "running";
  const eventCount = session.events.length;
  return `${session.toolName} (${eventCount} events, ${duration})`;
}

/**
 * Gets the status color for a tool call session
 */
export function getSessionStatusColor(session: ToolCallSession): string {
  switch (session.status) {
    case "running":
      return "#888888"; // Gray
    case "completed":
      return "#00ff00"; // Green
    case "error":
      return "#ff0000"; // Red
    default:
      return "#888888";
  }
}

/**
 * Gets the status icon for a tool call session
 */
export function getSessionStatusIcon(session: ToolCallSession): string {
  switch (session.status) {
    case "running":
      return "▶";
    case "completed":
      return "✓";
    case "error":
      return "✗";
    default:
      return "?";
  }
}
