/**
 * Shared Agent Configuration
 *
 * Dynamic context and utilities used across all agents
 */

import type { AgentConfig } from "@ai-sdk-tools/agents";
import { Agent } from "@ai-sdk-tools/agents";

/**
 * Application context passed to agents
 * Built dynamically per-request with current date/time
 */
export interface AppContext {
  userId: string;
  fullName: string;
  email: string;
  teamId: string;
  companyName: string;
  baseCurrency: string;
  locale: string;
  currentDate: string;
  currentTime: string;
  currentDateTime: string;
  timezone: string;
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
  email: string;
  teamId: string;
  companyName: string;
  baseCurrency?: string;
  locale?: string;
  timezone?: string;
}): AppContext {
  const now = new Date();
  return {
    userId: params.userId,
    fullName: params.fullName,
    email: params.email,
    teamId: params.teamId,
    companyName: params.companyName,
    baseCurrency: params.baseCurrency || "USD",
    locale: params.locale || "en-US",
    currentDate: now.toISOString().split("T")[0],
    currentTime: now.toTimeString().split(" ")[0],
    currentDateTime: now.toISOString(),
    timezone:
      params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Format context for LLM system prompts
 * Auto-injected by agent instructions functions
 */
export function formatContextForLLM(context: AppContext): string {
  return `
CURRENT CONTEXT:
- Date: ${context.currentDate} ${context.currentTime} (${context.timezone})
- User: ${context.fullName} (${context.email})
- Company: ${context.companyName}
- Currency: ${context.baseCurrency}
- Locale: ${context.locale}

Important: Use the current date/time above for any time-sensitive operations.
`;
}

/**
 * Create a typed agent with AppContext pre-applied
 * This enables automatic type inference for the context parameter
 */
export const createAgent = (config: AgentConfig<AppContext>) =>
  Agent.create<AppContext>(config);
