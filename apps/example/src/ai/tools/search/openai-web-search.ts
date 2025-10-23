import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import type { AppContext } from "@/ai/agents/shared";

interface SourceItem {
  url: string;
  title: string;
  publishedDate?: string;
}

export function createOpenAIWebSearchTool(appContext: AppContext) {
  return tool({
    description:
      "Search the web for current information, prices, news, and external data. Use comprehensive queries that combine multiple aspects. Returns concise factual data for analysis.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "Comprehensive search query combining multiple aspects (e.g., 'Tesla Model Y price financing lease options 2024')",
        ),
    }),
    execute: async ({ query }) => {
      try {
        // Enhance query with current date context for recent results
        const currentDate = new Date(
          appContext.currentDateTime,
        ).toLocaleDateString();
        const enhancedPrompt = `Current date: ${currentDate}. Search for: ${query}. Focus on recent information. This is a comprehensive search covering multiple aspects.`;

        const result = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: enhancedPrompt,
          stopWhen: stepCountIs(1),
          tools: {
            web_search: openai.tools.webSearch({
              searchContextSize: "low",
              userLocation: {
                type: "approximate" as const,
                country: appContext.country,
                timezone: appContext.timezone,
              },
            }),
          },
          temperature: 0.2,
        });

        // Extract sources from step content
        const rawSources: Array<{ url: string; title?: string }> = [];

        if (result.steps) {
          for (const step of result.steps) {
            // biome-ignore lint/suspicious/noExplicitAny: Step content structure is dynamic
            const content = (step as any).content;

            if (Array.isArray(content)) {
              for (const item of content) {
                // Extract source items from content array
                if (item.type === "source" && item.sourceType === "url") {
                  rawSources.push({
                    url: item.url,
                    title: item.title || item.url,
                  });
                }
              }
            }
          }
        }

        // Format sources for UI compatibility with better date handling
        const formattedSources: SourceItem[] = rawSources
          .map((source) => ({
            url: source.url,
            title: source.title || source.url,
          }))
          // Deduplicate by URL
          .filter(
            (source: SourceItem, index: number, self: SourceItem[]) =>
              index === self.findIndex((s: SourceItem) => s.url === source.url),
          );

        const contextData = result.text || "";

        return {
          query,
          found: formattedSources.length,
          context: contextData, // Raw data summary for agent to use
          sources: formattedSources,
        };
      } catch (error) {
        return {
          query,
          found: 0,
          context: null,
          sources: [],
          error: error instanceof Error ? error.message : "Search failed",
        };
      }
    },
  });
}
