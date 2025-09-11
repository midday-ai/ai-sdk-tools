"use client";

import { useState } from "react";
import type { AIEvent } from "../types";
import { formatEventData, getEventDescription } from "../utils/event-parser";
import { formatTimestamp, getEventTypeIcon } from "../utils/formatting";

interface EventItemProps {
  event: AIEvent;
  className?: string;
}

export function EventItem({ event, className = "" }: EventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeIcon = getEventTypeIcon(event.type);
  const description = getEventDescription(event);

  return (
    <div
      className={`ai-devtools-event-item ${className}`}
      data-type={event.type}
    >
      {/* Event header */}
      <div
        className="ai-devtools-event-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="ai-devtools-event-content">
          {/* Event type indicator */}
          <div className="ai-devtools-event-indicator" title={event.type} />

          {/* Event icon */}
          <span className="ai-devtools-event-icon">{typeIcon}</span>

          {/* Event description */}
          <div className="ai-devtools-event-description">
            <div className="ai-devtools-event-text">{description}</div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="ai-devtools-event-timestamp">
          {formatTimestamp(event.timestamp)}
        </div>

        {/* Expand/collapse icon */}
        <div className="ai-devtools-event-expand">
          <svg
            className={`ai-devtools-event-arrow ${
              isExpanded ? "ai-devtools-event-arrow-expanded" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="ai-devtools-event-expanded">
          <div className="ai-devtools-event-details">
            {/* Event metadata */}
            <div className="ai-devtools-event-metadata">
              <div className="ai-devtools-event-metadata-title">
                Event Details
              </div>
              <div className="ai-devtools-event-metadata-grid">
                <div className="ai-devtools-event-metadata-item">
                  <span className="ai-devtools-event-metadata-label">ID:</span>{" "}
                  {event.id}
                </div>
                <div className="ai-devtools-event-metadata-item">
                  <span className="ai-devtools-event-metadata-label">
                    Type:
                  </span>{" "}
                  {event.type}
                </div>
                <div className="ai-devtools-event-metadata-item">
                  <span className="ai-devtools-event-metadata-label">
                    Timestamp:
                  </span>{" "}
                  {new Date(event.timestamp).toISOString()}
                </div>
                {event.metadata?.messageId && (
                  <div className="ai-devtools-event-metadata-item">
                    <span className="ai-devtools-event-metadata-label">
                      Message ID:
                    </span>{" "}
                    {event.metadata.messageId}
                  </div>
                )}
              </div>
            </div>

            {/* Event data */}
            <div>
              <div className="ai-devtools-event-data-title">Data</div>
              <pre className="ai-devtools-event-data-content">
                {formatEventData(event)}
              </pre>
            </div>

            {/* Metadata */}
            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div className="ai-devtools-event-metadata-section">
                <div className="ai-devtools-event-metadata-title">Metadata</div>
                <pre className="ai-devtools-event-metadata-content">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
