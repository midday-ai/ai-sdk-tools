"use client";

import { AutoAwesome as SparkleIcon } from "@mui/icons-material";

interface DevtoolsButtonProps {
  onToggle: () => void;
  eventCount: number;
  hasNewEvents: boolean;
  className?: string;
}

export function DevtoolsButton({
  onToggle,
  eventCount,
  hasNewEvents,
  className = "",
}: DevtoolsButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`ai-devtools-button ${hasNewEvents ? "receiving-events" : ""} ${className}`}
      title={`ai-devtools [${eventCount}]`}
    >
      {/* Big Sparkle Icon */}
      <SparkleIcon className="ai-devtools-button-icon" />
    </button>
  );
}
