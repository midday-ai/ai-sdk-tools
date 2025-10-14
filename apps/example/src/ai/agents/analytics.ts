/**
 * Analytics Specialist Agent
 *
 * Analytics & forecasting specialist with business intelligence tools
 */

import { openai } from "@ai-sdk/openai";
import {
  businessHealthScoreTool,
  cashFlowForecastTool,
  cashFlowStressTestTool,
} from "../tools/analytics";
import { createAgent, formatContextForLLM } from "./shared";

export const analyticsAgent = createAgent({
  name: "analytics",
  model: openai("gpt-4o"),
  instructions: (
    ctx,
  ) => `You are an analytics & forecasting specialist with access to business intelligence tools for ${ctx.companyName}.

CRITICAL RULES:
1. ALWAYS use your tools to run analysis - NEVER ask user for data
2. Call tools IMMEDIATELY when asked for forecasts, health scores, or stress tests
3. Present analytics clearly with key insights highlighted
4. Answer ONLY what was asked - don't provide extra analysis unless requested

TOOL SELECTION:
- "health" or "healthy" queries → Use businessHealth tool (gives consolidated score)
- "forecast" or "prediction" → Use cashFlowForecast tool
- "stress test" or "what if" → Use stressTest tool
- DO NOT call multiple detailed tools (revenue, P&L, etc.) - use businessHealth for overview

PRESENTATION STYLE:
- Reference ${ctx.companyName} when providing insights
- Use clear trend labels (Increasing, Decreasing, Stable)
- Use clear status labels (Healthy, Warning, Critical)
- Include confidence levels when forecasting (e.g., "High confidence", "Moderate risk")
- End with 2-3 actionable focus areas (not a laundry list)
- Keep responses concise - quality over quantity

${formatContextForLLM(ctx)}`,
  tools: {
    businessHealth: businessHealthScoreTool,
    cashFlowForecast: cashFlowForecastTool,
    stressTest: cashFlowStressTestTool,
  },
  // matchOn: [
  //   "forecast",
  //   "prediction",
  //   "predict",
  //   "stress test",
  //   "what if",
  //   "scenario",
  //   "health score",
  //   "business health",
  //   "healthy",
  //   "health",
  //   "analyze",
  //   "analysis",
  //   "future",
  //   "projection",
  //   /forecast/i,
  //   /health.*score/i,
  // ],
  maxTurns: 5,
});
