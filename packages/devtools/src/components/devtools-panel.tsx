"use client";

import {
  ViewList as BottomPanelIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  ViewSidebar as RightPanelIcon,
} from "@mui/icons-material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCurrentState } from "../hooks/use-current-state";
import type { AIEvent, DevtoolsConfig, FilterOptions } from "../types";
import { formatToolName, getEventTypeIcon } from "../utils/formatting";
import { AgentFlowVisualization } from "./agent-flow-visualization";
import { EventList } from "./event-list";
import { StateDataExplorer } from "./state-data-explorer";

const EVENT_TYPES = [
  "tool-call-start",
  "tool-call-result",
  "tool-call-error",
  "message-start",
  "message-chunk",
  "message-complete",
  "start",
  "start-step",
  "text-start",
  "text-delta",
  "text-end",
  "reasoning-start",
  "reasoning-delta",
  "reasoning-end",
  "finish-step",
  "finish",
  "stream-done",
  "error",
  "unknown",
] as const;

const EVENT_TYPE_LABELS: Record<string, string> = {
  "tool-call-start": "Tool Starts",
  "tool-call-result": "Tool Results",
  "tool-call-error": "Tool Errors",
  "message-start": "Message Starts",
  "message-chunk": "Message Chunks",
  "message-complete": "Message Complete",
  start: "Stream Start",
  "start-step": "Step Starts",
  "text-start": "Text Starts",
  "text-delta": "Text Deltas",
  "text-end": "Text Ends",
  "reasoning-start": "Reasoning Start",
  "reasoning-delta": "Reasoning Deltas",
  "reasoning-end": "Reasoning End",
  "finish-step": "Step Finishes",
  finish: "Stream Finishes",
  "stream-done": "Stream Done",
  error: "Errors",
  unknown: "Unknown Events",
};

interface DevtoolsPanelProps {
  events: AIEvent[];
  isCapturing: boolean;
  onToggleCapturing: () => void;
  onClearEvents: () => void;
  onClose: () => void;
  onTogglePosition: () => void;
  config: DevtoolsConfig;
  className?: string;
}

export function DevtoolsPanel({
  events,
  isCapturing,
  onToggleCapturing,
  onClearEvents,
  onClose,
  onTogglePosition,
  config,
  className = "",
}: DevtoolsPanelProps) {
  const [showFilters] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    toolNames: [],
    searchQuery: "",
  });

  // State watching functionality
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Tab state (events, agents, state)
  const [activeTab, setActiveTab] = useState<"events" | "agents" | "state">(
    "events",
  );

  const { isStoreAvailable, availableStoreIds, currentStates } =
    useCurrentState({
      enabled: true,
    });

  // Auto-select default store when available
  useEffect(() => {
    if (availableStoreIds.length > 0 && !selectedStoreId) {
      // Prefer "default" store if available, otherwise select the first one
      const defaultStoreId = availableStoreIds.includes("default")
        ? "default"
        : availableStoreIds[0];
      setSelectedStoreId(defaultStoreId);
    }
  }, [availableStoreIds, selectedStoreId]);

  // Resize functionality
  const [isResizing, setIsResizing] = useState(false);
  const [panelHeight, setPanelHeight] = useState(config.height || 300);
  const [panelWidth, setPanelWidth] = useState(config.width || 500);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLButtonElement>(null);

  // Animation state for REC indicator
  const [isReceivingEvents, setIsReceivingEvents] = useState(false);
  const lastEventCountRef = useRef(events.length);

  // Calculate available tool names, event counts, and detect model
  const { availableToolNames, eventCounts } = useMemo(() => {
    const toolNames = new Set<string>();
    const counts = {} as Record<string, number>;
    let detectedModel: string | undefined;

    for (const event of events) {
      // Count by type
      counts[event.type] = (counts[event.type] || 0) + 1;

      // Collect tool names
      if (event.metadata?.toolName) {
        toolNames.add(event.metadata.toolName);
      }

      // Try to detect model from event data
      if (!detectedModel && event.data) {
        // Check for model info in various common locations
        const model =
          event.data.model ||
          event.data.modelId ||
          event.data.providerMetadata?.openai?.model ||
          event.data.providerMetadata?.anthropic?.model ||
          event.data.providerMetadata?.google?.model;

        if (model) {
          detectedModel = model;
        }
      }
    }

    return {
      availableToolNames: Array.from(toolNames).sort(),
      eventCounts: counts,
      detectedModelId: detectedModel,
    };
  }, [events]);

  // Show all suggestions when dropdown is open (no filtering based on search query)
  const filteredSuggestions = useMemo(() => {
    return {
      eventTypes: EVENT_TYPES,
      tools: availableToolNames,
      quickSearches: ["error", "tool", "text", "message", "start", "end"],
    };
  }, [availableToolNames]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filter by type
      if (filters.types.length > 0 && !filters.types.includes(event.type)) {
        return false;
      }

      // Filter by tool name
      if (filters.toolNames.length > 0) {
        const eventToolName = event.metadata?.toolName;
        if (!eventToolName || !filters.toolNames.includes(eventToolName)) {
          return false;
        }
      }

      // Filter by search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const eventData = JSON.stringify(event.data).toLowerCase();
        const eventMetadata = JSON.stringify(
          event.metadata || {},
        ).toLowerCase();

        if (!eventData.includes(query) && !eventMetadata.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [events, filters]);

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.toolNames.length > 0 ||
    filters.searchQuery.trim().length > 0;

  // Resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (config.position === "bottom") {
        const newHeight = window.innerHeight - e.clientY;
        const minHeight = 200;
        const maxHeight = window.innerHeight * 0.8;
        setPanelHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
      } else {
        const newWidth = window.innerWidth - e.clientX;
        const minWidth = 500;
        const maxWidth = window.innerWidth * 0.8;
        setPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
      }
    },
    [isResizing, config.position],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor =
        config.position === "bottom" ? "ns-resize" : "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp, config.position]);

  // Add keyboard event listener for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Calculate streaming speed metrics (tokens per second, characters per second)
  const streamingSpeed = useMemo(() => {
    const now = Date.now();
    const lastMinute = now - 60000; // Last 60 seconds

    // Get text-delta events from the last minute
    const recentTextDeltas = events.filter(
      (event) => event.type === "text-delta" && event.timestamp >= lastMinute,
    );

    if (recentTextDeltas.length === 0) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }

    // Calculate total characters and estimate tokens
    const totalCharacters = recentTextDeltas.reduce((sum, event) => {
      const content = event.data?.delta || event.data?.text || "";
      return sum + content.length;
    }, 0);

    // Estimate tokens (common heuristic: 1 token ≈ 4 characters)
    const totalTokens = Math.round(totalCharacters / 4);

    // Calculate duration in seconds
    const firstEvent = recentTextDeltas[0];
    const lastEvent = recentTextDeltas[recentTextDeltas.length - 1];

    if (!firstEvent || !lastEvent) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }

    const firstEventTime = firstEvent.timestamp;
    const lastEventTime = lastEvent.timestamp;
    const durationSeconds = (lastEventTime - firstEventTime) / 1000;

    if (durationSeconds === 0) {
      return { tokensPerSecond: 0, charactersPerSecond: 0 };
    }

    return {
      tokensPerSecond: Number.parseFloat(
        (totalTokens / durationSeconds).toFixed(2),
      ),
      charactersPerSecond: Number.parseFloat(
        (totalCharacters / durationSeconds).toFixed(2),
      ),
    };
  }, [events]);

  // Detect new events and trigger animation
  React.useEffect(() => {
    if (events.length > lastEventCountRef.current) {
      setIsReceivingEvents(true);
      // Reset animation after 1 second
      const timer = setTimeout(() => {
        setIsReceivingEvents(false);
      }, 1000);

      lastEventCountRef.current = events.length;

      return () => clearTimeout(timer);
    }
  }, [events.length]);

  return (
    <div
      ref={panelRef}
      className={`ai-devtools-panel ai-devtools-panel-${config.position} ${className}`}
      style={{
        height: config.position === "bottom" ? panelHeight : undefined,
        width: config.position === "right" ? panelWidth : undefined,
      }}
    >
      {/* Resize Handle */}
      <button
        ref={resizeRef}
        type="button"
        className={`ai-devtools-resize-handle ai-devtools-resize-handle-${config.position}`}
        onMouseDown={handleMouseDown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // Create a synthetic mouse event for keyboard interaction
            const syntheticEvent = {
              ...e,
              preventDefault: e.preventDefault,
              clientX: 0,
              clientY: 0,
              button: 0,
              buttons: 0,
              movementX: 0,
              movementY: 0,
              pageX: 0,
              pageY: 0,
              screenX: 0,
              screenY: 0,
              relatedTarget: null,
            } as unknown as React.MouseEvent<HTMLButtonElement>;
            handleMouseDown(syntheticEvent);
          }
        }}
      />

      {/* Header */}
      <div className="ai-devtools-header">
        {/* Main Search Bar */}
        <div className="ai-devtools-search-bar">
          <div className="ai-devtools-search-input-container">
            {/* Search Input */}
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({ ...prev, searchQuery: value }));
                // Close suggestions when user types to filter the actual list
                setShowSearchSuggestions(false);
              }}
              onFocus={() => {
                setShowSearchSuggestions(true);
              }}
              onBlur={() => {
                // Delay hiding to allow clicking on suggestions
                setTimeout(() => setShowSearchSuggestions(false), 200);
              }}
              placeholder={`${filteredEvents.length} total events found...`}
              className="ai-devtools-search-input-main"
            />

            {/* Filter Indicator */}
            {(filters.types.length > 0 || filters.toolNames.length > 0) && (
              <div className="ai-devtools-filter-indicator">
                <span className="ai-devtools-filter-indicator-count">
                  {filters.types.length + filters.toolNames.length}
                </span>
              </div>
            )}
          </div>

          {/* Search Suggestions */}
          {showSearchSuggestions && (
            <div className="ai-devtools-search-suggestions">
              <div className="ai-devtools-search-suggestions-content">
                {/* Event Types */}
                {filteredSuggestions.eventTypes.length > 0 && (
                  <div className="ai-devtools-suggestion-section">
                    <div className="ai-devtools-suggestion-section-title">
                      Event Types
                    </div>
                    <div className="ai-devtools-suggestion-options">
                      {filteredSuggestions.eventTypes.map((type) => {
                        const isActive = filters.types.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            className={`ai-devtools-suggestion-option ${isActive ? "active" : ""}`}
                            onClick={() => {
                              setFilters((prev) => ({
                                ...prev,
                                types: isActive
                                  ? prev.types.filter((t) => t !== type)
                                  : [...prev.types, type],
                              }));
                            }}
                          >
                            <span className="ai-devtools-suggestion-icon">
                              {getEventTypeIcon(type)}
                            </span>
                            <span className="ai-devtools-suggestion-label">
                              {EVENT_TYPE_LABELS[type]}
                            </span>
                            <span className="ai-devtools-suggestion-count">
                              {eventCounts[type] || 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tool Names */}
                {filteredSuggestions.tools.length > 0 && (
                  <div className="ai-devtools-suggestion-section">
                    <div className="ai-devtools-suggestion-section-title">
                      Tools
                    </div>
                    <div className="ai-devtools-suggestion-options">
                      {filteredSuggestions.tools.map((toolName) => {
                        const isActive = filters.toolNames.includes(toolName);
                        return (
                          <button
                            key={toolName}
                            type="button"
                            className={`ai-devtools-suggestion-option ${isActive ? "active" : ""}`}
                            onClick={() => {
                              setFilters((prev) => ({
                                ...prev,
                                toolNames: isActive
                                  ? prev.toolNames.filter((t) => t !== toolName)
                                  : [...prev.toolNames, toolName],
                              }));
                            }}
                          >
                            <span className="ai-devtools-suggestion-icon">
                              🔧
                            </span>
                            <span className="ai-devtools-suggestion-label">
                              {formatToolName(toolName)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Search Examples */}
                {filteredSuggestions.quickSearches.length > 0 && (
                  <div className="ai-devtools-suggestion-section">
                    <div className="ai-devtools-suggestion-section-title">
                      Quick Search
                    </div>
                    <div className="ai-devtools-suggestion-options">
                      {filteredSuggestions.quickSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="ai-devtools-suggestion-option"
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              searchQuery: term,
                            }));
                          }}
                        >
                          <span className="ai-devtools-suggestion-icon">
                            {term === "error"
                              ? "!"
                              : term === "tool"
                                ? "▶"
                                : "T"}
                          </span>
                          <span className="ai-devtools-suggestion-label">
                            {term}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ai-devtools-header-right">
          {/* Live Button with Pause/Play */}
          <button
            type="button"
            onClick={onToggleCapturing}
            className={`ai-devtools-btn ${isReceivingEvents ? "receiving" : ""}`}
          >
            {isCapturing ? (
              <PauseIcon className="ai-devtools-btn-icon" />
            ) : (
              <PlayArrowIcon className="ai-devtools-btn-icon" />
            )}
            <span>Live</span>
          </button>

          {/* Clear events */}
          <button
            type="button"
            onClick={onClearEvents}
            className="ai-devtools-btn"
          >
            <ClearIcon className="ai-devtools-btn-icon" />
            <span>clear</span>
          </button>

          {/* Position Toggle Button */}
          <button
            type="button"
            onClick={onTogglePosition}
            className="ai-devtools-position-toggle-btn"
            title={`Switch to ${config.position === "bottom" ? "right" : "bottom"} panel`}
          >
            {config.position === "bottom" ? (
              <RightPanelIcon className="ai-devtools-position-toggle-icon" />
            ) : (
              <BottomPanelIcon className="ai-devtools-position-toggle-icon" />
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="ai-devtools-close-btn"
          >
            <CloseIcon className="ai-devtools-close-icon" />
          </button>
        </div>
      </div>

      {/* Filter Badges */}
      {showFilters && (
        <div className="ai-devtools-filter-badges">
          {/* Event Type Filters */}
          {filters.types.length > 0 && (
            <div className="ai-devtools-filter-group">
              <span className="ai-devtools-filter-group-label">Types:</span>
              {filters.types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="ai-devtools-filter-badge active"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      types: prev.types.filter((t) => t !== type),
                    }));
                  }}
                >
                  {type.replace(/-/g, " ")}
                  <span className="ai-devtools-filter-remove">×</span>
                </button>
              ))}
            </div>
          )}

          {/* Tool Name Filters */}
          {filters.toolNames.length > 0 && (
            <div className="ai-devtools-filter-group">
              <span className="ai-devtools-filter-group-label">Tools:</span>
              {filters.toolNames.map((toolName) => (
                <button
                  key={toolName}
                  type="button"
                  className="ai-devtools-filter-badge active"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      toolNames: prev.toolNames.filter((t) => t !== toolName),
                    }));
                  }}
                >
                  {formatToolName(toolName)}
                  <span className="ai-devtools-filter-remove">×</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Filter Options */}
          <div className="ai-devtools-filter-group">
            <span className="ai-devtools-filter-group-label">Quick:</span>
            <button
              type="button"
              className={`ai-devtools-filter-badge ${filters.types.includes("tool-call-start") ? "active" : ""}`}
              onClick={() => {
                const isActive = filters.types.includes("tool-call-start");
                setFilters((prev) => ({
                  ...prev,
                  types: isActive
                    ? prev.types.filter((t) => t !== "tool-call-start")
                    : [...prev.types, "tool-call-start"],
                }));
              }}
            >
              Tool Calls
            </button>
            <button
              type="button"
              className={`ai-devtools-filter-badge ${filters.types.includes("text-delta") ? "active" : ""}`}
              onClick={() => {
                const isActive = filters.types.includes("text-delta");
                setFilters((prev) => ({
                  ...prev,
                  types: isActive
                    ? prev.types.filter((t) => t !== "text-delta")
                    : [...prev.types, "text-delta"],
                }));
              }}
            >
              Text Events
            </button>
            <button
              type="button"
              className={`ai-devtools-filter-badge ${filters.types.includes("error") ? "active" : ""}`}
              onClick={() => {
                const isActive = filters.types.includes("error");
                setFilters((prev) => ({
                  ...prev,
                  types: isActive
                    ? prev.types.filter((t) => t !== "error")
                    : [...prev.types, "error"],
                }));
              }}
            >
              Errors
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="ai-devtools-filter-badge clear"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    types: [],
                    toolNames: [],
                    searchQuery: "",
                  }));
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #27272a",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("events")}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: activeTab === "events" ? "#e5e7eb" : "#666666",
            fontSize: 11,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Events
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("agents")}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: activeTab === "agents" ? "#e5e7eb" : "#666666",
            fontSize: 11,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Agents
        </button>
        {isStoreAvailable && (
          <button
            type="button"
            onClick={() => setActiveTab("state")}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              color: activeTab === "state" ? "#e5e7eb" : "#666666",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            State
          </button>
        )}
      </div>

      {/* Content */}
      <div className="ai-devtools-panel-content">
        <div className="ai-devtools-content">
          {activeTab === "events" && (
            <div className="ai-devtools-events">
              <EventList events={filteredEvents} />
            </div>
          )}
          {activeTab === "agents" && <AgentFlowVisualization events={events} />}
          {activeTab === "state" && isStoreAvailable && (
            <div className="ai-devtools-state-panel-full">
              <StateDataExplorer
                currentState={
                  selectedStoreId ? currentStates[selectedStoreId] : undefined
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="ai-devtools-bottom-stats">
        {/* Tokens per second on the left */}
        <div className="ai-devtools-tokens-section">
          <div className="ai-devtools-speed-metrics">
            <div className="ai-devtools-speed-metric">
              <span className="ai-devtools-speed-value">
                {streamingSpeed.tokensPerSecond}
              </span>
              <span className="ai-devtools-speed-label">tok/s</span>
            </div>
            <div className="ai-devtools-speed-metric">
              <span className="ai-devtools-speed-value">
                {streamingSpeed.charactersPerSecond}
              </span>
              <span className="ai-devtools-speed-label">char/s</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
