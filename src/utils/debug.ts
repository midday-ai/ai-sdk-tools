/**
 * Debug logging utility for AI SDK Devtools
 * Provides controlled logging that only outputs when debug mode is enabled
 */

export function createDebugLogger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.log(...args);
    }
  };
}
