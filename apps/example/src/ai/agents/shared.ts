/**
 * Shared Agent Configuration
 *
 * Dynamic context and utilities used across all agents
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Redis } from "@upstash/redis";
import type { AgentConfig } from "ai-sdk-tools";
import { Agent, UpstashProvider } from "ai-sdk-tools";

// Load memory template from markdown file
const memoryTemplate = readFileSync(
  join(process.cwd(), "src/ai/agents/memory-template.md"),
  "utf-8"
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
 * Format context for LLM system prompts
 * Auto-injected by agent instructions functions
 *
 * Note: User-specific info (name, preferences, etc) should be stored in working memory,
 * not hardcoded here. This keeps system context separate from learned user context.
 */
export function formatContextForLLM(context: AppContext): string {
  return `
CURRENT CONTEXT:
- Date: ${context.currentDateTime}
- Timezone: ${context.timezone}
- Company: ${context.companyName}
- Currency: ${context.baseCurrency}
- Locale: ${context.locale}

Important: 
- Use the current date/time above for any time-sensitive operations
- User-specific information (name, role, preferences) is maintained in your working memory
`;
}

/**
 * Shared memory provider instance - used across all agents
 * Can be accessed for direct queries (e.g., listing chats)
 */
export const sharedMemoryProvider = new UpstashProvider(
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
);

/**
 * Create a typed agent with AppContext pre-applied
 * This enables automatic type inference for the context parameter
 *
 * All agents automatically get shared memory configuration
 */
export const createAgent = (config: AgentConfig<AppContext>) =>
  Agent.create<AppContext>({
    ...config,
    memory: {
      provider: sharedMemoryProvider,
      workingMemory: {
        enabled: true,
        scope: "user",
        template: memoryTemplate,
      },
      history: {
        enabled: true,
        limit: 10,
      },
      chats: {
        enabled: true,
        generateTitle: true, // Uses agent's model
      },
    },
    handoffContext: {
      currentAgentMessages: "all", // Current agent gets full conversation context
      specialistMessages: 20, // Specialist agents get last 20 messages
    },
  });
