"use client";

import type React from "react";
import { useState } from "react";
import type { ToolCallSession } from "../types";
import { formatTimestamp, formatToolName } from "../utils/formatting";
import {
  getSessionStatusColor,
  getSessionStatusIcon,
  getSessionSummary,
} from "../utils/session-grouper";
import { EventItem } from "./event-item";

// Simple tooltip component
function Tooltip({
  children,
  content,
  show,
}: { children: React.ReactNode; content: React.ReactNode; show: boolean }) {
  if (!show) return <>{children}</>;

  return (
    <div className="ai-devtools-tooltip-container">
      {children}
      <div className="ai-devtools-tooltip">{content}</div>
    </div>
  );
}

// Format tool parameters for display
function formatToolParams(toolParams: Record<string, any> | undefined): string {
  if (!toolParams || Object.keys(toolParams).length === 0) {
    return "No parameters";
  }

  return Object.entries(toolParams)
    .map(([key, value]) => {
      const formattedValue =
        typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value);
      return `${key}: ${formattedValue}`;
    })
    .join("\n");
}

interface ToolCallSessionProps {
  session: ToolCallSession;
  className?: string;
}

export function ToolCallSessionComponent({
  session,
  className = "",
}: ToolCallSessionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const summary = getSessionSummary(session);
  const statusColor = getSessionStatusColor(session);
  const statusIcon = getSessionStatusIcon(session);

  // Extract tool parameters from the start event
  const toolParams =
    session.startEvent?.metadata?.toolParams ||
    session.startEvent?.data?.toolParams;
  const hasParams = toolParams && Object.keys(toolParams).length > 0;

  return (
    <div
      className={`ai-devtools-session ${className}`}
      data-session-id={session.id}
      data-status={session.status}
    >
      {/* Session header */}
      <Tooltip
        show={hasParams && showTooltip}
        content={
          <div className="ai-devtools-tooltip-content">
            <div className="ai-devtools-tooltip-title">Tool Parameters</div>
            <pre className="ai-devtools-tooltip-params">
              {formatToolParams(toolParams)}
            </pre>
          </div>
        }
      >
        <div
          className="ai-devtools-session-header"
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => hasParams && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="ai-devtools-session-content">
            {/* Status indicator */}
            <div
              className="ai-devtools-session-indicator"
              style={{ backgroundColor: statusColor }}
              title={`${session.status} - ${session.toolName}`}
            />

            {/* Status icon */}
            <span className="ai-devtools-session-icon">{statusIcon}</span>

            {/* Session info */}
            <div className="ai-devtools-session-info">
              <div className="ai-devtools-session-tool-name">
                {formatToolName(session.toolName)}
                {hasParams && (
                  <span
                    className="ai-devtools-session-params-indicator"
                    title="Has parameters"
                  >
                    ⚙️
                  </span>
                )}
              </div>
              <div className="ai-devtools-session-summary">{summary}</div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="ai-devtools-session-timestamp">
            {formatTimestamp(session.startTime)}
          </div>

          {/* Expand/collapse icon */}
          <div className="ai-devtools-session-expand">
            <svg
              className={`ai-devtools-session-arrow ${
                isExpanded ? "ai-devtools-session-arrow-expanded" : ""
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
      </Tooltip>

      {/* Session events */}
      {isExpanded && (
        <div className="ai-devtools-session-events">
          {session.events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              className="ai-devtools-session-event"
            />
          ))}
        </div>
      )}
    </div>
  );
}
