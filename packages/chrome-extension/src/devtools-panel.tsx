import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
// Import the devtools components directly since we're bundling them
import { DevtoolsPanel } from "./devtools-panel-wrapper";

// Chrome extension specific devtools panel
function ChromeDevtoolsPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [_stores, setStores] = useState<any[]>([]);
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    // Listen for updates from the devtools panel script
    const handleUpdate = (event: CustomEvent) => {
      const { type, data } = event.detail;

      switch (type) {
        case "EVENT_ADDED":
          setEvents((prev) => [...prev, data.event]);
          break;
        case "EVENTS_LOADED":
          setEvents(data.events);
          break;
        case "STORE_ADDED":
          setStores((prev) => [...prev, { id: data.storeId }]);
          break;
        case "STORES_LOADED":
          setStores(data.stores);
          break;
        case "CAPTURING_TOGGLED":
          setIsCapturing(data.isCapturing);
          break;
        case "EVENTS_CLEARED":
          setEvents([]);
          break;
      }
    };

    window.addEventListener(
      "ai-devtools-update",
      handleUpdate as EventListener,
    );

    // Load initial data
    if (window.AIDevtoolsAPI) {
      setEvents(window.AIDevtoolsAPI.getEvents());
      setStores(window.AIDevtoolsAPI.getStores());
      setIsCapturing(window.AIDevtoolsAPI.isCapturing());
    }

    return () => {
      window.removeEventListener(
        "ai-devtools-update",
        handleUpdate as EventListener,
      );
    };
  }, []);

  const handleToggleCapturing = () => {
    if (window.AIDevtoolsAPI) {
      window.AIDevtoolsAPI.toggleCapturing();
    }
  };

  const handleClearEvents = () => {
    if (window.AIDevtoolsAPI) {
      window.AIDevtoolsAPI.clearEvents();
    }
  };

  const _handleGetStoreState = async (storeId: string) => {
    if (window.AIDevtoolsAPI) {
      return await window.AIDevtoolsAPI.getStoreState(storeId);
    }
    return null;
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DevtoolsPanel
        events={events}
        isCapturing={isCapturing}
        onToggleCapturing={handleToggleCapturing}
        onClearEvents={handleClearEvents}
        onClose={() => {}} // No close in devtools
        onTogglePosition={() => {}} // No position toggle in devtools
        config={{
          enabled: true,
          maxEvents: 1000,
          position: "right" as const,
          height: 400,
          theme: "auto" as const,
          streamCapture: {
            enabled: true,
            endpoint: "/api/chat",
            autoConnect: true,
          },
          throttle: {
            enabled: true,
            interval: 100,
            includeTypes: ["text-delta"],
          },
        }}
        modelId={undefined}
      />
    </div>
  );
}

// Initialize the React app
const container = document.getElementById("ai-devtools-root");
if (container) {
  const root = createRoot(container);
  root.render(<ChromeDevtoolsPanel />);
}
