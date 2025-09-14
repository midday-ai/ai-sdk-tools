"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AIEvent,
  AIEventType,
  UseAIDevtoolsOptions,
  UseAIDevtoolsReturn,
} from "../types";
import { createDebugLogger } from "../utils/debug";
import { StreamInterceptor } from "../utils/stream-interceptor";

export function useAIDevtools(
  options: UseAIDevtoolsOptions = {},
): UseAIDevtoolsReturn {
  const {
    enabled = true,
    maxEvents = 1000,
    onEvent,
    debug = false,
    streamCapture,
    throttle,
  } = options;

  const [events, setEvents] = useState<AIEvent[]>([]);
  const [isCapturing, setIsCapturing] = useState(true); // Always start capturing by default
  const streamInterceptor = useRef<StreamInterceptor | null>(null);

  const debugLog = createDebugLogger(debug);

  // Throttling state
  const throttleQueue = useRef<AIEvent[]>([]);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventTimes = useRef<Map<string, number>>(new Map());

  // Check if event should be throttled
  const shouldThrottleEvent = useCallback(
    (event: AIEvent): boolean => {
      if (!throttle?.enabled) return false;

      const { includeTypes, excludeTypes } = throttle;

      // If includeTypes is specified, only throttle those types
      if (includeTypes && includeTypes.length > 0) {
        return includeTypes.includes(event.type);
      }

      // If excludeTypes is specified, don't throttle those types
      if (excludeTypes && excludeTypes.length > 0) {
        return !excludeTypes.includes(event.type);
      }

      // Default: throttle all events
      return true;
    },
    [throttle],
  );

  // Process throttled events
  const processThrottledEvents = useCallback(() => {
    if (throttleQueue.current.length === 0) return;

    const eventsToProcess = [...throttleQueue.current];
    throttleQueue.current = [];

    setEvents((prev) => {
      const newEvents = [...prev, ...eventsToProcess];
      // Keep only the most recent events
      if (newEvents.length > maxEvents) {
        return newEvents.slice(-maxEvents);
      }
      return newEvents;
    });

    // Call the optional event handler for each event
    for (const event of eventsToProcess) {
      onEvent?.(event);
    }
  }, [maxEvents, onEvent]);

  // Add event to the list (with throttling)
  const addEvent = useCallback(
    (event: AIEvent) => {
      debugLog(false, "[AI Devtools] addEvent called:", event.type); // Only log event type, not full event

      if (!isCapturing) {
        debugLog(false, "[AI Devtools] addEvent skipped - not capturing");
        return;
      }

      // Check if this event should be throttled
      if (shouldThrottleEvent(event)) {
        const throttleKey = `${event.type}_${event.metadata?.messageId || "global"}`;
        const now = Date.now();
        const lastTime = lastEventTimes.current.get(throttleKey) || 0;
        const interval = throttle?.interval || 100;

        if (now - lastTime < interval) {
          // Add to throttle queue
          throttleQueue.current.push(event);

          debugLog(false, "[AI Devtools] Event throttled:", event.type);

          // Set up timer if not already running
          if (!throttleTimer.current) {
            throttleTimer.current = setTimeout(() => {
              processThrottledEvents();
              throttleTimer.current = null;
            }, interval);
          }
          return;
        }

        // Update last event time
        lastEventTimes.current.set(throttleKey, now);
      }

      debugLog(false, "[AI Devtools] Adding event:", event.type); // Only log essential info

      setEvents((prev) => {
        const newEvents = [...prev, event];
        // Keep only the most recent events
        if (newEvents.length > maxEvents) {
          return newEvents.slice(-maxEvents);
        }

        debugLog(false, "[AI Devtools] Events updated:", newEvents.length); // Only log count

        return newEvents;
      });

      // Call the optional event handler
      onEvent?.(event);
    },
    [
      isCapturing,
      maxEvents,
      onEvent,
      shouldThrottleEvent,
      throttle,
      processThrottledEvents,
    ],
  );

  // Clear all events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Toggle capturing
  const toggleCapturing = useCallback(() => {
    setIsCapturing((prev: boolean) => {
      const newCapturing = !prev;

      // Update stream interceptor if it exists
      if (streamInterceptor.current) {
        streamInterceptor.current.updateOptions({ enabled: newCapturing });
      }

      return newCapturing;
    });
  }, []);

  // Filter events
  const filterEvents = useCallback(
    (
      filterTypes?: AIEventType[],
      searchQuery?: string,
      toolNames?: string[],
    ) => {
      return events.filter((event) => {
        // Filter by type
        if (
          filterTypes &&
          filterTypes.length > 0 &&
          !filterTypes.includes(event.type)
        ) {
          return false;
        }

        // Filter by tool name
        if (toolNames && toolNames.length > 0) {
          const eventToolName = event.metadata?.toolName;
          if (!eventToolName || !toolNames.includes(eventToolName)) {
            return false;
          }
        }

        // Filter by search query
        if (searchQuery?.trim()) {
          const query = searchQuery.toLowerCase().trim();
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
    },
    [events],
  );

  // Get unique tool names from events
  const getUniqueToolNames = useCallback(() => {
    const toolNames = new Set<string>();
    for (const event of events) {
      if (event.metadata?.toolName) {
        toolNames.add(event.metadata.toolName);
      }
    }
    return Array.from(toolNames).sort();
  }, [events]);

  // Get event statistics
  const getEventStats = useCallback(() => {
    const stats = {
      total: events.length,
      byType: {} as Record<AIEventType, number>,
      byTool: {} as Record<string, number>,
      timeRange:
        events.length > 0
          ? {
              start: Math.min(...events.map((e) => e.timestamp)),
              end: Math.max(...events.map((e) => e.timestamp)),
            }
          : null,
    };

    for (const event of events) {
      // Count by type
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

      // Count by tool
      if (event.metadata?.toolName) {
        const toolName = event.metadata.toolName;
        stats.byTool[toolName] = (stats.byTool[toolName] || 0) + 1;
      }
    }

    return stats;
  }, [events]);

  // Initialize and manage stream interceptor
  useEffect(() => {
    const streamConfig = streamCapture || {
      enabled,
      endpoints: ["/api/chat"], // Exact match for most common endpoint
      autoConnect: true, // Always auto-connect by default
    };

    debugLog("[AI Devtools] Stream interceptor effect running", {
      enabled: streamConfig.enabled,
      autoConnect: streamConfig.autoConnect,
      endpoints: streamConfig.endpoints,
      isCapturing,
    });

    if (streamConfig.enabled && streamConfig.autoConnect) {
      debugLog("[AI Devtools] Creating stream interceptor...");

      // Create a wrapper function to ensure we're using the latest addEvent
      const eventHandler = (event: AIEvent) => {
        debugLog("[AI Devtools] Event captured:", {
          type: event.type,
          timestamp: event.timestamp,
          hasData: !!event.data,
        });
        addEvent(event);
      };

      // Initialize stream interceptor
      streamInterceptor.current = new StreamInterceptor({
        onEvent: eventHandler,
        endpoints: streamConfig.endpoints || ["/api/chat"],
        enabled: isCapturing,
        debug,
      });

      debugLog("[AI Devtools] Stream interceptor created, patching fetch...");

      // Start intercepting
      streamInterceptor.current.patch();

      debugLog("[AI Devtools] Fetch patched successfully");

      // Cleanup on unmount
      return () => {
        debugLog("[AI Devtools] Cleaning up stream interceptor");
        if (streamInterceptor.current) {
          streamInterceptor.current.unpatch();
          streamInterceptor.current = null;
        }

        // Cleanup throttle timer
        if (throttleTimer.current) {
          clearTimeout(throttleTimer.current);
          throttleTimer.current = null;
        }
      };
    }
  }, [addEvent, isCapturing, streamCapture, enabled]);

  return {
    events,
    isCapturing,
    clearEvents,
    toggleCapturing,
    filterEvents,
    getUniqueToolNames,
    getEventStats,
  };
}
