"use client";

import { useEffect, useState, useRef } from "react";
import {
  getAvailableStoreIds,
  getStoreState,
  isStorePackageAvailable,
  subscribeToStoreChanges,
} from "../utils/working-state-detection";

export interface UseCurrentStateOptions {
  enabled?: boolean;
}

export interface UseCurrentStateReturn {
  isStoreAvailable: boolean;
  availableStoreIds: string[];
  currentStates: Record<string, unknown>;
  refreshStates: () => void;
}

export function useCurrentState(
  options: UseCurrentStateOptions = {},
): UseCurrentStateReturn {
  const { enabled = true } = options;

  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const [availableStoreIds, setAvailableStoreIds] = useState<string[]>([]);
  const [currentStates, setCurrentStates] = useState<Record<string, unknown>>({});
  
  const unsubscribeFunctions = useRef<Record<string, () => void>>({});

  // Check if store package is available and get store IDs
  useEffect(() => {
    if (!enabled) return;

    const available = isStorePackageAvailable();
    setIsStoreAvailable(available);

    if (available) {
      const storeIds = getAvailableStoreIds();
      setAvailableStoreIds(storeIds);
    }
  }, [enabled]);

  // Refresh states function
  const refreshStates = () => {
    if (!isStoreAvailable || availableStoreIds.length === 0) return;

    const newStates: Record<string, unknown> = {};
    for (const storeId of availableStoreIds) {
      const state = getStoreState(storeId);
      if (state) {
        newStates[storeId] = state;
      }
    }
    setCurrentStates(newStates);
  };

  // Initial state load
  useEffect(() => {
    if (isStoreAvailable && availableStoreIds.length > 0) {
      refreshStates();
    }
  }, [isStoreAvailable, availableStoreIds]);

  // Subscribe to store changes
  useEffect(() => {
    if (!enabled || !isStoreAvailable || availableStoreIds.length === 0) return;

    // Clean up existing subscriptions
    for (const unsubscribe of Object.values(unsubscribeFunctions.current)) {
      unsubscribe();
    }
    unsubscribeFunctions.current = {};

    // Subscribe to each store
    for (const storeId of availableStoreIds) {
      try {
        const unsubscribe = subscribeToStoreChanges(storeId, (newState) => {
          setCurrentStates(prev => ({
            ...prev,
            [storeId]: newState
          }));
        });
        unsubscribeFunctions.current[storeId] = unsubscribe;
      } catch (error) {
        // Silently fail - store might not be available
      }
    }

    return () => {
      for (const unsubscribe of Object.values(unsubscribeFunctions.current)) {
        unsubscribe();
      }
      unsubscribeFunctions.current = {};
    };
  }, [enabled, isStoreAvailable, availableStoreIds]);

  return {
    isStoreAvailable,
    availableStoreIds,
    currentStates,
    refreshStates,
  };
}
