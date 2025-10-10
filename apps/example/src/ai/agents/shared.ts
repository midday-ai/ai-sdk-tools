/**
 * Shared Agent Configuration
 *
 * Common context and utilities used across all agents
 */

/**
 * Agent Context (would come from request in production)
 */
export const AGENT_CONTEXT = {
  companyName: "Acme Inc.",
  date: new Date().toISOString().split("T")[0],
  fullName: "John Doe",
  registeredCountry: "United States",
} as const;

/**
 * Format context for system prompts
 */
export function getContextPrompt(): string {
  return `
CONTEXT:
- Company: ${AGENT_CONTEXT.companyName}
- Date: ${AGENT_CONTEXT.date}
- User: ${AGENT_CONTEXT.fullName}
- Country: ${AGENT_CONTEXT.registeredCountry}
`.trim();
}
