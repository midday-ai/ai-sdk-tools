import { HistoryOutlined } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { AIEvent, DevtoolsConfig } from "../types";
import { EventItem } from "./event-item";

interface HistoryDataExplorerProps {
  events: AIEvent[];
  historyEvents: AIEvent[];
  historyConfig: DevtoolsConfig["history"];
  isLoadingHistory: boolean;
  availableSessions: string[];
  currentSessionId: string;
  onFetchHistory: () => Promise<void>;
  onClearHistory: () => Promise<void>;
  className?: string;
}

export default function HistoryDataExplorer({
  className = "",
  events,
  historyEvents,
  historyConfig,
  isLoadingHistory,
  availableSessions,
  currentSessionId,
  onFetchHistory,
  onClearHistory,
}: HistoryDataExplorerProps) {
  const [selectedSession, setSelectedSession] = useState<string>(currentSessionId);
  const [showCurrentEvents] = useState(true);

  // Merge current events with history events
  const allEvents = useMemo(() => {
    const merged = [...historyEvents];
    
    if (showCurrentEvents) {
      // Add current events, avoiding duplicates
      const existingIds = new Set(historyEvents.map(e => e.id));
      const newEvents = events.filter(e => !existingIds.has(e.id));
      merged.push(...newEvents);
    }
    
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [events, historyEvents, showCurrentEvents]);

  const handleSessionChange = (sessionId: string) => {
    setSelectedSession(sessionId);
    // Note: In a real implementation, you'd fetch events for the selected session
    // For now, we'll just show the current session's history
  };

  if (isLoadingHistory) {
    return (
      <div className={`ai-devtools-state-explorer-empty ${className}`}>
        <div className="ai-devtools-state-explorer-empty-content">
          <div className="ai-devtools-state-explorer-empty-icon">
            <HistoryOutlined />
          </div>
          <div className="ai-devtools-state-explorer-empty-title">
            Loading History...
          </div>
          <div className="ai-devtools-state-explorer-empty-description">
            Fetching stored events
          </div>
        </div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className={`ai-devtools-state-explorer-empty ${className}`}>
        <div className="ai-devtools-state-explorer-empty-content">
          <div className="ai-devtools-state-explorer-empty-icon">
            <HistoryOutlined />
          </div>
          <div className="ai-devtools-state-explorer-empty-title">
            No History Found
          </div>
          <div className="ai-devtools-state-explorer-empty-description">
            Start streaming to store events
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-devtools-history-explorer ${className}`}>
      {/* History Controls */}
      <div className="ai-devtools-history-controls">
        <div className="ai-devtools-history-controls-left">
          {/* Session Selector */}
          {availableSessions.length > 1 && (
            <select
              value={selectedSession}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="ai-devtools-history-session-selector"
              title="Select session to view history"
            >
              {availableSessions.map((sessionId) => (
                <option key={sessionId} value={sessionId}>
                  {sessionId === currentSessionId ? `${sessionId} (Current)` : sessionId}
                </option>
              ))}
            </select>
          )}
          
          {/* Events found display */}
          <span className="ai-devtools-history-events-found">
            {allEvents.length}/{historyConfig?.maxEventsPerSession} {allEvents.length === 1 ? "Event found" : "Events found"}
          </span>
        </div>
        
        <div className="ai-devtools-history-controls-right">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={onFetchHistory}
            className="ai-devtools-history-refresh-btn"
            title="Refresh History"
          >
            Refresh
          </button>
          
          {/* Clear History Button */}
          <button
            type="button"
            onClick={onClearHistory}
            className="ai-devtools-history-clear-btn"
            title="Clear History"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="ai-devtools-event-list">
        {allEvents
          .slice()
          .reverse()
          .map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
      </div>
    </div>
  );
}
