"use client";

export { AIDevtools } from "./components/ai-dev-tools";
export { ContextCircle } from "./components/context-circle";
// Export other components for advanced usage
export { DevtoolsButton } from "./components/devtools-button";
export { DevtoolsPanel } from "./components/devtools-panel";
export { EventItem } from "./components/event-item";
export { EventList } from "./components/event-list";
export { StoreList } from "./components/store-list";
export { StateDataExplorer } from "./components/state-data-explorer";

// Hooks
export { useAIDevtools } from "./hooks/use-ai-devtools";
export { useCurrentState } from "./hooks/use-current-state";

// Types
export type {
  AIEvent,
  AIEventType,
  DevtoolsConfig,
  FilterOptions,
  ToolCallSession,
  UseAIDevtoolsOptions,
  UseAIDevtoolsReturn,
} from "./types";

// Utilities
export { createDebugLogger } from "./utils/debug";
export {
  isStorePackageAvailable,
  getAvailableStoreIds,
  getStoreState,
  subscribeToStoreChanges,
} from "./utils/working-state-detection";

export {
  formatEventData,
  getEventDescription,
  parseEventFromDataPart,
  parseSSEEvent,
} from "./utils/event-parser";
export {
  formatTimestamp,
  getEventTypeColor,
  getEventTypeIcon,
} from "./utils/formatting";
export {
  getSessionStatusColor,
  getSessionStatusIcon,
  getSessionSummary,
  groupEventsIntoSessions,
} from "./utils/session-grouper";
export { StreamInterceptor } from "./utils/stream-interceptor";
