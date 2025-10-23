/**
 * Shared Agent Configuration
 *
 * Dynamic context and utilities used across all agents
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import { UpstashProvider } from "@ai-sdk-tools/memory/upstash";
import { Redis } from "@upstash/redis";
import type { LanguageModel, Tool } from "ai";

// Load memory template from markdown file
const memoryTemplate = readFileSync(
  join(process.cwd(), "src/ai/agents/memory-template.md"),
  "utf-8",
);

// Load suggestions instructions from markdown file
const suggestionsInstructions = readFileSync(
  join(process.cwd(), "src/ai/agents/suggestions-instructions.md"),
  "utf-8",
);

/**
 * Application context passed to agents
 * Built dynamically per-request with current date/time
 */
export interface AppContext {
  userId: string;
  fullName: string;
  companyName: string;
  baseCurrency: string;
  locale: string;
  currentDateTime: string;
  country?: string;
  city?: string;
  region?: string;
  timezone: string;
  chatId: string;
  // Allow additional properties to satisfy Record<string, unknown> constraint
  [key: string]: unknown;
}

/**
 * Agent configuration type (subset of full AgentConfig from @ai-sdk-tools/agents)
 */
interface AgentConfig<TContext extends Record<string, unknown>> {
  name: string;
  model: LanguageModel;
  instructions: string | ((context: TContext) => string);
  tools?: Record<string, Tool> | ((context: TContext) => Record<string, Tool>);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handoffs?: Array<any>;
  handoffDescription?: string;
  maxTurns?: number;
  modelSettings?: Record<string, unknown>;
  matchOn?: (string | RegExp)[] | ((message: string) => boolean);
}

/**
 * Build application context dynamically
 * Ensures current date/time on every request
 */
export function buildAppContext(params: {
  userId: string;
  fullName: string;
  companyName: string;
  country?: string;
  city?: string;
  region?: string;
  chatId: string;
  baseCurrency?: string;
  locale?: string;
  timezone?: string;
}): AppContext {
  const now = new Date();
  return {
    userId: params.userId,
    fullName: params.fullName,
    companyName: params.companyName,
    country: params.country,
    city: params.city,
    region: params.region,
    chatId: params.chatId,
    baseCurrency: params.baseCurrency || "USD",
    locale: params.locale || "en-US",
    currentDateTime: now.toISOString(),
    timezone:
      params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Common rules for all agents about tool execution
 */
export const COMMON_AGENT_RULES = `<agent-behavior-rules>
- Call tools immediately without explanatory text
- Use parallel tool calls when possible
- Provide specific numbers and actionable insights
- Explain your reasoning
- Lead with the most important information first
</agent-behavior-rules>`;

/**
 * Format context for LLM system prompts
 * Auto-injected by agent instructions functions
 *
 * Note: User-specific info (name, preferences, etc) should be stored in working memory,
 * not hardcoded here. This keeps system context separate from learned user context.
 */
export function formatContextForLLM(context: AppContext): string {
  return `<context>
Date: ${context.currentDateTime}
Timezone: ${context.timezone}
Company: ${context.companyName}
Currency: ${context.baseCurrency}
Locale: ${context.locale}
</context>

Important: Use the current date/time above for time-sensitive operations. User-specific information is maintained in your working memory.`;
}

/**
 * Memory provider instance - used across all agents
 * Can be accessed for direct queries (e.g., listing chats)
 */
export const memoryProvider = new UpstashProvider(
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }),
);

export const createAgent = (config: AgentConfig<AppContext>) => {
  return new Agent({
    modelSettings: {
      parallel_tool_calls: true,
    },
    ...config,
    memory: {
      provider: memoryProvider,
      history: {
        enabled: true,
        limit: 10,
      },
      workingMemory: {
        enabled: true,
        template: memoryTemplate,
        scope: "user",
      },
      chats: {
        enabled: true,
        generateTitle: {
          model: openai("gpt-4.1-nano"),
          instructions: `<task-context>
You are a helpful assistant that can generate titles for conversations.
</task-context>

<rules>
Find the most concise title that captures the essence of the conversation.
Titles should be at most 30 characters.
Titles should be formatted in sentence case, with capital letters at the start of each word. Do not provide a period at the end.
</rules>

<the-ask>
Generate a title for the conversation.
</the-ask>

<output-format>
Return only the title.
</output-format>`,
        },
        generateSuggestions: {
          enabled: true,
          model: openai("gpt-4.1-nano"),
          limit: 5,
          instructions: suggestionsInstructions,
        },
      },
    },
  });
};
