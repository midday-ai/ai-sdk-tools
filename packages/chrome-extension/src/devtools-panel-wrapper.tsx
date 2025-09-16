// Wrapper for the devtools panel that includes all necessary components
// This avoids complex bundling issues with the Chrome extension

// Simple event types for the Chrome extension
interface AIEvent {
  id: string;
  timestamp: number;
  type: string;
  data: any;
  metadata?: {
    toolName?: string;
    messageId?: string;
  };
}

interface DevtoolsConfig {
  enabled: boolean;
  maxEvents: number;
  position: "bottom" | "right";
  height: number;
  theme: "auto" | "light" | "dark";
  streamCapture?: {
    enabled: boolean;
    endpoint: string;
    autoConnect: boolean;
  };
  throttle?: {
    enabled: boolean;
    interval: number;
    includeTypes: string[];
  };
}

interface DevtoolsPanelProps {
  events: AIEvent[];
  isCapturing: boolean;
  onToggleCapturing: () => void;
  onClearEvents: () => void;
  onClose: () => void;
  onTogglePosition: () => void;
  config: DevtoolsConfig;
  modelId?: string;
}

// Simple event list component
function EventList({ events }: { events: AIEvent[] }) {
  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        padding: "10px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#cccccc" }}>
        AI SDK Events ({events.length})
      </h3>
      {events.length === 0 ? (
        <div style={{ color: "#666", fontStyle: "italic" }}>
          No events captured yet. Navigate to a page with AI SDK to see events.
        </div>
      ) : (
        <div>
          {events.map((event, index) => (
            <div
              key={event.id || index}
              style={{
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: "#2a2a2a",
                borderRadius: "4px",
                borderLeft: "3px solid #007acc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "#007acc", fontWeight: "bold" }}>
                  {event.type}
                </span>
                <span style={{ color: "#666", fontSize: "10px" }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {event.metadata?.toolName && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "10px",
                    marginBottom: "4px",
                  }}
                >
                  Tool: {event.metadata.toolName}
                </div>
              )}
              <pre
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "#ccc",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main devtools panel component
export function DevtoolsPanel({
  events,
  isCapturing,
  onToggleCapturing,
  onClearEvents,
  onClose,
  onTogglePosition,
  config,
  modelId,
}: DevtoolsPanelProps) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, color: "#ffffff" }}>AI SDK DevTools</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onToggleCapturing}
            style={{
              padding: "6px 12px",
              backgroundColor: isCapturing ? "#ef4444" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {isCapturing ? "⏸️ Pause" : "▶️ Resume"}
          </button>
          <button
            onClick={onClearEvents}
            style={{
              padding: "6px 12px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Event List */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <EventList events={events} />
      </div>
    </div>
  );
}
