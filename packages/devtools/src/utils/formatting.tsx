import {
  Api as ApiIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  ErrorOutline as ErrorOutlineIcon,
  Help as HelpIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import type React from "react";

/**
 * Formats a timestamp to a readable time string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return (
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + `.${date.getMilliseconds().toString().padStart(3, "0")}`
  );
}

/**
 * Gets a color for an event type
 */
export function getEventTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "tool-call-start": "#888888", // medium gray
    "tool-call-result": "#00ff00", // green for success (like 200 status)
    "tool-call-error": "#ff0000", // red for errors
    "message-start": "#ffffff", // white
    "message-chunk": "#888888", // medium gray
    "message-complete": "#00ff00", // green for completion
    "text-start": "#ffffff", // white
    "text-delta": "#888888", // medium gray
    "text-end": "#ffffff", // white
    "start-step": "#888888", // medium gray
    "finish-step": "#00ff00", // green for success
    finish: "#00ff00", // green for success
    "stream-done": "#00ff00", // green for success
    error: "#ff0000", // red for errors
    unknown: "#888888", // medium gray
  };

  return colors[type] || "#888888";
}

/**
 * Gets an icon for an event type (using better Material-UI icons)
 */
export function getEventTypeIcon(type: string): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    // Tool calls - using Build/Settings icons for better semantic meaning
    "tool-call-start": <BuildIcon sx={{ fontSize: "0.75rem" }} />,
    "tool-call-result": <CheckCircleIcon sx={{ fontSize: "0.75rem" }} />,
    "tool-call-error": <ErrorOutlineIcon sx={{ fontSize: "0.75rem" }} />,

    // Messages - using Send/Message icons
    "message-start": <SendIcon sx={{ fontSize: "0.75rem" }} />,
    "message-chunk": <CircleIcon sx={{ fontSize: "0.4rem" }} />,
    "message-complete": <CheckCircleIcon sx={{ fontSize: "0.75rem" }} />,

    // Text events - using Code/TextFields icons
    "text-start": <CodeIcon sx={{ fontSize: "0.75rem" }} />,
    "text-delta": <CircleIcon sx={{ fontSize: "0.4rem" }} />,
    "text-end": <CodeIcon sx={{ fontSize: "0.75rem" }} />,

    // Steps - using Settings/PlayArrow for process steps
    "start-step": <SettingsIcon sx={{ fontSize: "0.75rem" }} />,
    "finish-step": <CheckCircleIcon sx={{ fontSize: "0.75rem" }} />,

    // Stream events - using Api/Done icons
    finish: <ApiIcon sx={{ fontSize: "0.75rem" }} />,
    "stream-done": <ApiIcon sx={{ fontSize: "0.75rem" }} />,

    // Error and data events
    error: <ErrorOutlineIcon sx={{ fontSize: "0.75rem" }} />,
    "custom-data": <DataObjectIcon sx={{ fontSize: "0.75rem" }} />,
    unknown: <HelpIcon sx={{ fontSize: "0.75rem" }} />,
  };

  return icons[type] || <HelpIcon sx={{ fontSize: "0.75rem" }} />;
}

/**
 * Formats a tool name from camelCase/snake_case to readable format
 * Examples: getBurnRate -> Get Burn Rate, get_user_data -> Get User Data
 */
export function formatToolName(toolName: string): string {
  if (!toolName || toolName === "unknown") return toolName;

  // Handle snake_case by replacing underscores with spaces
  let formatted = toolName.replace(/_/g, " ");

  // Handle camelCase by adding spaces before capital letters
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first letter of each word
  formatted = formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
}
