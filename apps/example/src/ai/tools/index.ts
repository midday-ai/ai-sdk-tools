import { analyzeBurnRateTool, cachedAnalyzeBurnRateTool } from "./burn-rate";

// Export all tools
export const tools = {
  analyzeBurnRate: cachedAnalyzeBurnRateTool, // Use cached version
};

// Also export original for comparison
export const originalTools = {
  analyzeBurnRate: analyzeBurnRateTool,
};
