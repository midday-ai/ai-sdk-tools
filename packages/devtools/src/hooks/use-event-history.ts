"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AIEvent, DevtoolsConfig } from "../types";
import { HistoryStorage } from "../utils/history-storage";

export interface UseEventHistoryOptions {
  events: AIEvent[];
  config: DevtoolsConfig['history'];
  enabled: boolean;
}

export interface UseEventHistoryReturn {
  historyEvents: AIEvent[];
  isLoadingHistory: boolean;
  fetchHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  availableSessions: string[];
  currentSessionId: string;
}

export function useEventHistory({
  events,
  config,
  enabled,
}: UseEventHistoryOptions): UseEventHistoryReturn {
  const [historyEvents, setHistoryEvents] = useState<AIEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);
  
  // Batch processing state
  const eventQueue = useRef<AIEvent[]>([]);
  const lastSavedEventCount = useRef(0);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageRef = useRef<HistoryStorage | null>(null);

  // Get current session ID
  const currentSessionId = config?.sessionId || 'default-session';
  const maxEventsPerSession = config?.maxEventsPerSession || 1000;

  // Initialize storage
  useEffect(() => {
    if (enabled && config) {
      storageRef.current = new HistoryStorage(config);
      // Load available sessions
      loadAvailableSessions();
    }
  }, [enabled, config]);

  // Load available sessions
  const loadAvailableSessions = useCallback(async () => {
    if (!storageRef.current) return;
    try {
      const sessions = await storageRef.current.listSessions();
      setAvailableSessions(sessions);
    } catch (error) {
      console.warn("[AI Devtools] Failed to load available sessions:", error);
    }
  }, []);

  // Batch processing: add events to queue and maintain maxEventsPerSession
  useEffect(() => {
    if (!enabled || !config) return;

    // Only process new events
    const newEvents = events.slice(lastSavedEventCount.current);

    if (newEvents.length > 0) {
      eventQueue.current.push(...newEvents);

      // Check if we're above maxEventsPerSession
      if (eventQueue.current.length > maxEventsPerSession) {
        const toRemove = eventQueue.current.length - maxEventsPerSession;
        // Console log for removal
        console.log(
          `[AI Devtools] Max events per session (${maxEventsPerSession}) reached in event queue. Removing oldest ${toRemove} events.`
        );
        eventQueue.current = eventQueue.current.slice(
          eventQueue.current.length - maxEventsPerSession
        );
      } else {
        // For debugging, indicate check is happening, but not over limit
        console.log(
          `[AI Devtools] Event queue length is ${eventQueue.current.length}. maxEventsPerSession is ${maxEventsPerSession}. No removal needed.`
        );
      }
      lastSavedEventCount.current = events.length;

      // Schedule flush
      scheduleFlush();
    }
  }, [events, enabled, config, maxEventsPerSession]);

  // Schedule flush with debouncing
  const scheduleFlush = useCallback(() => {
    if (flushTimer.current) {
      clearTimeout(flushTimer.current);
    }
    flushTimer.current = setTimeout(() => {
      flushEvents();
    }, 2000); // Flush every 2 seconds
  }, []);

  // Flush events to storage, enforcing maxEventsPerSession on storage as well
  const flushEvents = useCallback(async () => {
    if (!storageRef.current || eventQueue.current.length === 0) return;

    try {
      // Fetch all previous events for session
      let prevSessionEvents: AIEvent[] = [];
      try {
        prevSessionEvents = await storageRef.current.fetchEvents(currentSessionId);
      } catch {
        prevSessionEvents = [];
      }

      // Append new events to the end
      let allEvents = [...prevSessionEvents, ...eventQueue.current];

      if (allEvents.length > maxEventsPerSession) {
        const toRemove = allEvents.length - maxEventsPerSession;
        console.log(
          `[AI Devtools] Max events per session (${maxEventsPerSession}) reached in storage flush. Removing oldest ${toRemove} events from combined list before save.`
        );
        allEvents = allEvents.slice(allEvents.length - maxEventsPerSession);
      } else {
        console.log(
          `[AI Devtools] After flush, total events to save: ${allEvents.length} (under/at maxEventsPerSession: ${maxEventsPerSession})`
        );
      }

      await storageRef.current.saveEvents(currentSessionId, allEvents);

      eventQueue.current = [];
      
      // Update available sessions
      await loadAvailableSessions();
    } catch (error) {
      console.warn("[AI Devtools] Failed to flush events:", error);
    }
  }, [currentSessionId, loadAvailableSessions, maxEventsPerSession]);

  // Fetch history for current session; enforce maxEventsPerSession client-side as well
  const fetchHistory = useCallback(async () => {
    if (!storageRef.current) return;

    setIsLoadingHistory(true);
    try {
      let fetchedEvents = await storageRef.current.fetchEvents(currentSessionId);
      if (fetchedEvents.length > maxEventsPerSession) {
        const toRemove = fetchedEvents.length - maxEventsPerSession;
        console.log(
          `[AI Devtools] Max events per session (${maxEventsPerSession}) reached on history fetch. Removing oldest ${toRemove} events from loaded history.`
        );
        fetchedEvents = fetchedEvents.slice(fetchedEvents.length - maxEventsPerSession);
      } else {
        console.log(
          `[AI Devtools] Loaded ${fetchedEvents.length} events from history (maxEventsPerSession: ${maxEventsPerSession}). No removal needed.`
        );
      }
      setHistoryEvents(fetchedEvents);
    } catch (error) {
      console.warn("[AI Devtools] Failed to fetch history:", error);
      setHistoryEvents([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [currentSessionId, maxEventsPerSession]);

  // Clear history
  const clearHistory = useCallback(async () => {
    if (!storageRef.current) return;

    try {
      await storageRef.current.clearSession(currentSessionId);
      setHistoryEvents([]);
      await loadAvailableSessions();
    } catch (error) {
      console.warn("[AI Devtools] Failed to clear history:", error);
    }
  }, [currentSessionId, loadAvailableSessions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
      }
      // Flush remaining events, enforcing the session cap
      if (eventQueue.current.length > 0) {
        flushEvents();
      }
    };
  }, [flushEvents]);

  // Auto-fetch history when component mounts and history is enabled
  useEffect(() => {
    if (enabled && config?.enabled) {
      fetchHistory();
    }
  }, [enabled, config?.enabled, fetchHistory]);

  return {
    historyEvents,
    isLoadingHistory,
    fetchHistory,
    clearHistory,
    availableSessions,
    currentSessionId,
  };
}
