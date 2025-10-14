/**
 * Working state detection utilities
 */

// Check if store package is available (async version for browser compatibility)
export async function isStorePackageAvailable(): Promise<boolean> {
  try {
    await import("@ai-sdk-tools/store");
    return true;
  } catch {
    return false;
  }
}
