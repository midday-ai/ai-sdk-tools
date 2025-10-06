import { analyzeBurnRateTool, cachedAnalyzeBurnRateTool } from "./burn-rate";
import { complexBurnRateAnalysis, complexBurnRateAnalysisTool } from "./complex-burn-rate";

// Export production tools
export const tools = {
  analyzeBurnRate: cachedAnalyzeBurnRateTool, // Simple cached version
  complexAnalysis: complexBurnRateAnalysisTool, // Complex cached version (mirrors real app)
  complexAnalysisUncached: complexBurnRateAnalysis, // Uncached for comparison
};

// Also export original for comparison
export const originalTools = {
  analyzeBurnRate: analyzeBurnRateTool,
};
