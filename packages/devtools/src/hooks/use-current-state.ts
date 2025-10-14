"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Type for the store API - we'll use any to avoid complex type issues
type StoreApi = any;

// Store context will be dynamically imported if available

export interface UseCurrentStateOptions {
  enabled?: boolean;
}

export interface UseCurrentStateReturn {
  isStoreAvailable: boolean;
  availableStoreIds: string[];
  currentStates: Record<string, unknown>;
  refreshStates: () => void;
}

// Remove unused dummy context

export function useCurrentState(
  options: UseCurrentStateOptions = {},
): UseCurrentStateReturn {
  const { enabled = true } = options;

  const [currentStates, setCurrentStates] = useState<Record<string, unknown>>(
    {},
  );
  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const [storeContext, setStoreContext] = useState<React.Context<any> | undefined>(undefined);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Create a dummy context for when store is not available
  const DummyContext = useRef(
    React.createContext<StoreApi | undefined>(undefined),
  ).current;

  // Dynamically load the store context if available
  useEffect(() => {
    let isMounted = true;

    const loadStoreContext = async () => {
      try {
        // Try to dynamically import the store package
        const storeModule = await import("@ai-sdk-tools/store");
        if (isMounted && storeModule.ChatStoreContext) {
          setStoreContext(storeModule.ChatStoreContext);
          setIsStoreAvailable(true);
        }
      } catch {
        // Store package is not available
        if (isMounted) {
          setStoreContext(undefined);
          setIsStoreAvailable(false);
        }
      }
    };

    loadStoreContext();

    return () => {
      isMounted = false;
    };
  }, []);

  // Use the store context if available, otherwise use dummy
  const contextToUse = storeContext || DummyContext;
  const storeApi: StoreApi | undefined = useContext(contextToUse);

  const availableStoreIds = isStoreAvailable ? ["default"] : [];

  // Refresh states function
  const refreshStates = useCallback(() => {
    if (!storeApi || !isStoreAvailable) return;

    try {
      const state = storeApi.getState();
      setCurrentStates({
        default: state,
      });
    } catch {
      // Failed to get state
    }
  }, [storeApi, isStoreAvailable]);

  // Subscribe to store changes
  useEffect(() => {
    if (!enabled || !storeApi || !isStoreAvailable) return;

    try {
      // Subscribe to the Zustand store
      const unsubscribe = storeApi.subscribe((newState: unknown) => {
        setCurrentStates({
          default: newState,
        });
      });

      // Initial state sync
      refreshStates();

      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch {
      // Failed to subscribe
      return undefined;
    }
  }, [enabled, storeApi, isStoreAvailable, refreshStates]);

  return {
    isStoreAvailable,
    availableStoreIds,
    currentStates,
    refreshStates,
  };
}
