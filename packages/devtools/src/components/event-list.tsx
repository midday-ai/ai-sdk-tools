"use client";

import type { AIEvent } from "../types";
import { groupEventsIntoSessions } from "../utils/session-grouper";
import { EventItem } from "./event-item";
import { ToolCallSessionComponent } from "./tool-call-session";

interface EventListProps {
  events: AIEvent[];
  className?: string;
  groupByToolCalls?: boolean;
}

export function EventList({
  events,
  className = "",
  groupByToolCalls = true,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className={`ai-devtools-empty-state ${className}`}>
        <div className="ai-devtools-empty-content">
          <div className="ai-devtools-empty-title">▸ waiting for events...</div>
          <div className="ai-devtools-empty-subtitle">
            start streaming to capture events
          </div>
        </div>
      </div>
    );
  }

  if (!groupByToolCalls) {
    // Show events in flat list (newest first)
    return (
      <div className={`ai-devtools-event-list ${className}`}>
        {events
          .slice()
          .reverse()
          .map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
      </div>
    );
  }

  // Group events into tool call sessions (keep chronological order for grouping)
  const { sessions, standaloneEvents } = groupEventsIntoSessions(events);

  return (
    <div className={`ai-devtools-event-list ${className}`}>
      {/* Tool call sessions (newest first) */}
      {sessions
        .slice()
        .reverse()
        .map((session) => (
          <ToolCallSessionComponent
            key={`session-${session.id}`}
            session={session}
          />
        ))}

      {/* Standalone events (newest first) */}
      {standaloneEvents
        .slice()
        .reverse()
        .map((event) => (
          <EventItem key={`event-${event.id}`} event={event} />
        ))}
    </div>
  );
}
