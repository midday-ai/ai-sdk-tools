/**
 * Working state detection that uses the same approach as the chat component
 */

// Import the store functions directly (same as chat component)
import { getChatStoreIds, getChatStore } from "@ai-sdk-tools/store";

// Check if store package is available
export function isStorePackageAvailable(): boolean {
  try {
    // Check if the required functions are available
    const hasRequiredFunctions = typeof getChatStoreIds === 'function' && typeof getChatStore === 'function';
    return hasRequiredFunctions;
  } catch (error) {
    return false;
  }
}

// Get all available store IDs
export function getAvailableStoreIds(): string[] {
  try {
    const storeIds = getChatStoreIds();
    
    // If no store IDs are found, try to create a default store
    if (storeIds.length === 0) {
      getChatStore('default');
      return getChatStoreIds();
    }
    
    return storeIds;
  } catch (error) {
    return [];
  }
}

// Get store state by ID
export function getStoreState(storeId: string = "default"): unknown {
  try {
    const store = getChatStore(storeId);
    return store.getState();
  } catch (error) {
    return null;
  }
}

// Subscribe to store changes
export function subscribeToStoreChanges(
  storeId: string,
  callback: (state: unknown) => void,
): () => void {
  try {
    const store = getChatStore(storeId);
    return store.subscribe(callback);
  } catch (error) {
    return () => {};
  }
}
