// Import styles - this ensures CSS is bundled
import "./styles.css";

export { AIDevtools } from "./components/ai-dev-tools";

// Export other components for advanced usage
export { DevtoolsButton } from "./components/devtools-button";
export { DevtoolsPanel } from "./components/devtools-panel";
export { EventList } from "./components/event-list";
export { EventItem } from "./components/event-item";
export { ContextCircle } from "./components/context-circle";

// Hooks
export { useAIDevtools } from "./hooks/use-ai-devtools";

// Types
export type {
  AIEvent,
  AIEventType,
  FilterOptions,
  DevtoolsConfig,
  UseAIDevtoolsOptions,
  UseAIDevtoolsReturn,
  ToolCallSession,
} from "./types";

// Utilities
export { createDebugLogger } from "./utils/debug";

export {
  parseEventFromDataPart,
  parseSSEEvent,
  formatEventData,
  getEventDescription,
} from "./utils/event-parser";

export { StreamInterceptor } from "./utils/stream-interceptor";

export {
  formatTimestamp,
  getEventTypeColor,
  getEventTypeIcon,
} from "./utils/formatting";

export {
  groupEventsIntoSessions,
  getSessionSummary,
  getSessionStatusColor,
  getSessionStatusIcon,
} from "./utils/session-grouper";
