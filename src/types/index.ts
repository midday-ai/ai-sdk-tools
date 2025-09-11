// Event types that can be captured from the AI stream
export type AIEventType =
  | "tool-call-start"
  | "tool-call-result"
  | "tool-call-error"
  | "message-start"
  | "message-chunk"
  | "message-complete"
  | "start-step"
  | "text-start"
  | "text-delta"
  | "text-end"
  | "finish-step"
  | "finish"
  | "stream-done"
  | "error"
  | "custom-data"
  | "unknown";

// Base event structure that wraps AI SDK stream parts
export interface AIEvent {
  id: string;
  timestamp: number;
  type: AIEventType;
  data: any; // Use AI SDK stream part types
  metadata?: {
    toolName?: string;
    toolCallId?: string;
    toolParams?: Record<string, any>;
    duration?: number;
    messageId?: string;
    preliminary?: boolean;
    [key: string]: any;
  };
}

// Filter options for the devtools panel
export interface FilterOptions {
  types: AIEventType[];
  toolNames: string[];
  searchQuery: string;
  timeRange?: {
    start: number;
    end: number;
  };
}

// Configuration for the devtools
export interface DevtoolsConfig {
  enabled: boolean;
  maxEvents: number;
  position: "bottom" | "right" | "overlay";
  height?: number;
  width?: number;
  theme?: "light" | "dark" | "auto";
  streamCapture?: {
    enabled: boolean;
    endpoint: string;
    autoConnect: boolean;
  };
  throttle?: {
    enabled: boolean;
    interval: number; // milliseconds
    excludeTypes?: AIEventType[]; // Event types to exclude from throttling
    includeTypes?: AIEventType[]; // Only throttle these event types (if specified)
  };
}

// Tool call session grouping
export interface ToolCallSession {
  id: string;
  toolName: string;
  toolCallId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: "running" | "completed" | "error";
  events: AIEvent[];
  startEvent: AIEvent;
  endEvent?: AIEvent;
}

// Hook options for useAIDevtools
export interface UseAIDevtoolsOptions {
  enabled?: boolean;
  maxEvents?: number;
  onEvent?: (event: AIEvent) => void;
  modelId?: string; // Optional model ID for context insights
  debug?: boolean; // Enable debug logging
  streamCapture?: {
    enabled?: boolean;
    endpoints?: string[];
    autoConnect?: boolean;
  };
  throttle?: {
    enabled?: boolean;
    interval?: number;
    excludeTypes?: AIEventType[];
    includeTypes?: AIEventType[];
  };
}

// Return type for useAIDevtools hook
export interface UseAIDevtoolsReturn {
  events: AIEvent[];
  isCapturing: boolean;
  clearEvents: () => void;
  toggleCapturing: () => void;
  filterEvents: (
    filterTypes?: AIEventType[],
    searchQuery?: string,
    toolNames?: string[],
  ) => AIEvent[];
  getUniqueToolNames: () => string[];
  getEventStats: () => {
    total: number;
    byType: Record<AIEventType, number>;
    byTool: Record<string, number>;
    timeRange: { start: number; end: number } | null;
  };
}
