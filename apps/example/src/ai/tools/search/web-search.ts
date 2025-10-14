import { openai } from "@ai-sdk/openai";
import type { AppContext } from "@/ai/agents/shared";

export function createWebSearchTool(context: AppContext) {
  return openai.tools.webSearch({
    searchContextSize: "medium",
    userLocation: {
      type: "approximate",
      city: context.city,
      country: context.country,
      region: context.region,
      timezone: context.timezone,
    },
  });
}
