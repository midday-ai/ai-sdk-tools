"use client";

import { useEffect, useRef, useState } from "react";
import { useAIDevtools } from "../hooks/use-ai-devtools";
import type { DevtoolsConfig, UseAIDevtoolsOptions } from "../types";
import { DevtoolsButton } from "./devtools-button";
import { DevtoolsPanel } from "./devtools-panel";

interface AIDevtoolsProps extends UseAIDevtoolsOptions {
  config?: Partial<DevtoolsConfig>;
  className?: string;
  debug?: boolean;
  modelId?: string; // Optional model ID for context insights
}

const defaultConfig: DevtoolsConfig = {
  enabled: true,
  maxEvents: 1000,
  position: "bottom",
  height: 400,
  theme: "auto",
  streamCapture: {
    enabled: true,
    endpoint: "/api/chat",
    autoConnect: true,
  },
  throttle: {
    enabled: true,
    interval: 100, // 100ms throttle by default
    includeTypes: ["text-delta"], // Only throttle high-frequency text-delta events by default
  },
};

export function AIDevtools({
  enabled = true,
  maxEvents = 1000,
  onEvent,
  config = {},
  className = "",
  debug = false,
  modelId,
}: AIDevtoolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const previousEventCountRef = useRef(0);

  // Load panel state from localStorage on mount
  useEffect(() => {
    if (isMounted) {
      const savedState = localStorage.getItem("ai-devtools-panel-open");
      if (savedState !== null) {
        setIsOpen(JSON.parse(savedState));
      }
    }
  }, [isMounted]);

  // Save panel state to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ai-devtools-panel-open", JSON.stringify(isOpen));
    }
  }, [isOpen, isMounted]);

  const finalConfig = { ...defaultConfig, ...config };

  // Always call hooks (to maintain hook order)
  const { events, isCapturing, clearEvents, toggleCapturing } = useAIDevtools({
    enabled: enabled && isMounted, // Only enable after mounted
    maxEvents,
    onEvent,
    debug,
    streamCapture: finalConfig.streamCapture
      ? {
          enabled: finalConfig.streamCapture.enabled,
          endpoints: [finalConfig.streamCapture.endpoint],
          autoConnect: finalConfig.streamCapture.autoConnect,
        }
      : undefined,
    throttle: finalConfig.throttle,
  });

  // Hydration-safe mounting check
  useEffect(() => {
    setIsMounted(true);
  }, [debug]);

  // Track new events for button animation (always call this hook)
  useEffect(() => {
    if (isMounted && events.length > previousEventCountRef.current) {
      setHasNewEvents(true);
      // Clear the animation after a short delay
      const timer = setTimeout(() => setHasNewEvents(false), 2000);
      return () => clearTimeout(timer);
    }
    previousEventCountRef.current = events.length;
  }, [events.length, isMounted]);

  // Don't render anything until mounted (hydration-safe)
  if (!isMounted) {
    return null;
  }

  if (!finalConfig.enabled) {
    return null;
  }

  return (
    <div className="ai-devtools">
      {/* Devtools button */}
      <DevtoolsButton
        onToggle={() => setIsOpen(!isOpen)}
        eventCount={events.length}
        hasNewEvents={hasNewEvents && !isOpen}
        className={className}
      />

      {/* Devtools panel */}
      {isOpen && (
        <DevtoolsPanel
          events={events}
          isCapturing={isCapturing}
          onToggleCapturing={toggleCapturing}
          onClearEvents={clearEvents}
          onClose={() => setIsOpen(false)}
          config={finalConfig}
          modelId={modelId}
        />
      )}
    </div>
  );
}
