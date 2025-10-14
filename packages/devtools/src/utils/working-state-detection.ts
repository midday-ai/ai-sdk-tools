/**
 * Working state detection utilities
 */

// Check if store package is available
export function isStorePackageAvailable(): boolean {
  try {
    require("@ai-sdk-tools/store");
    return true;
  } catch {
    return false;
  }
}
