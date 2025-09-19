/**
 * Working state detection that uses the same approach as the chat component
 */

// Import the new store functions
import { useChatStore } from "@ai-sdk-tools/store";

// Check if store package is available
export function isStorePackageAvailable(): boolean {
  try {
    // Check if the store hook is available
    return typeof useChatStore === 'function';
  } catch (error) {
    return false;
  }
}

// Get all available store IDs (simplified for new context-based system)
export function getAvailableStoreIds(): string[] {
  // The new implementation uses React Context, so there's only one store per Provider
  return ["context-store"];
}

// Get store state (simplified for new context-based system)
export function getStoreState(_storeId: string = "context-store"): unknown {
  try {
    // Note: This would need to be called from within a React component
    // For devtools, we might need a different approach
    console.warn("getStoreState: Context-based store requires React component context");
    return null;
  } catch (error) {
    return null;
  }
}

// Subscribe to store changes (simplified for new context-based system)
export function subscribeToStoreChanges(
  _storeId: string,
  _callback: (state: unknown) => void,
): () => void {
  try {
    // Note: Context-based stores don't support direct subscription outside React
    console.warn("subscribeToStoreChanges: Context-based store requires React component context");
    return () => {};
  } catch (error) {
    return () => {};
  }
}
