"use client";

import { useMemo } from "react";
import { darkStyles, JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

interface StateDataExplorerProps {
  currentState?: unknown;
  className?: string;
}

export function StateDataExplorer({
  currentState,
  className = "",
}: StateDataExplorerProps) {
  const displayData = useMemo(() => {
    if (!currentState || typeof currentState !== "object") {
      return currentState;
    }

    // Filter to only show essential chat properties
    const essentialProps = ["id", "messages", "error", "status"];
    const filteredState: Record<string, unknown> = {};

    for (const prop of essentialProps) {
      if (prop in currentState) {
        filteredState[prop] = (currentState as Record<string, unknown>)[prop];
      }
    }

    return filteredState;
  }, [currentState]);

  if (!displayData) {
    return (
      <div className={`ai-devtools-state-explorer-empty ${className}`}>
        <div className="ai-devtools-state-explorer-empty-content">
          <div className="ai-devtools-state-explorer-empty-icon">⚡</div>
          <div className="ai-devtools-state-explorer-empty-title">
            No State Data
          </div>
          <div className="ai-devtools-state-explorer-empty-description">
            Select a store to view its current state
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-devtools-state-explorer ${className}`}>
      <div className="ai-devtools-state-explorer-content">
        <JsonView
          data={displayData}
          style={{
            ...darkStyles,
            container: "ai-devtools-json-container",
            basicChildStyle: "ai-devtools-json-basic-child",
            label: "ai-devtools-json-label",
            stringValue: "ai-devtools-json-string-value",
            numberValue: "ai-devtools-json-number-value",
            booleanValue: "ai-devtools-json-boolean-value",
            nullValue: "ai-devtools-json-null-value",
            undefinedValue: "ai-devtools-json-undefined-value",
            punctuation: "ai-devtools-json-punctuation",
            collapseIcon: "ai-devtools-json-collapse-icon",
            expandIcon: "ai-devtools-json-expand-icon",
            collapsedContent: "ai-devtools-json-collapsed-content",
            childFieldsContainer: "ai-devtools-json-child-fields-container",
          }}
        />
      </div>
    </div>
  );
}
