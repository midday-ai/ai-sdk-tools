import { openai } from "@ai-sdk/openai";
import { createWebSearchTool } from "../tools/search";
import { analyticsAgent } from "./analytics";
import { operationsAgent } from "./operations";
import { reportsAgent } from "./reports";
import {
  type AppContext,
  COMMON_AGENT_RULES,
  createAgent,
  formatContextForLLM,
} from "./shared";

/**
 * Research agent that gathers data from multiple sources for analysis.
 */
export const researchAgent = createAgent({
  name: "research",
  model: openai("gpt-4o"),
  modelSettings: {
    toolChoice: "required",
  },
  instructions: (
    ctx: AppContext,
  ) => `You are a financial research specialist for ${ctx.companyName}. Analyze affordability with specific calculations and clear recommendations.

<background-data>
${formatContextForLLM(ctx)}
</background-data>

${COMMON_AGENT_RULES}

<workflow>
1. Use webSearch for current pricing and financing options
2. Get financial data from specialists (operations, reports, analytics)
3. Calculate purchase impact on cash runway
4. Provide YES/NO recommendation with specific rationale
</workflow>

<requirements>
- Include specific amounts and timeframes
- Calculate runway impact: "Reduces from X to Y months"
- Provide clear recommendation with confidence level
- Consider alternatives and risk scenarios
</requirements>`,
  tools: (ctx: AppContext) => ({
    webSearch: createWebSearchTool(ctx),
  }),
  handoffs: [operationsAgent, reportsAgent, analyticsAgent],
  maxTurns: 10,
});
