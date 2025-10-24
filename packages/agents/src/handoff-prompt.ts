/**
 * A recommended prompt prefix for agents that use handoffs. We recommend including this or
 * similar instructions in any agents that use handoffs.
 */
export const RECOMMENDED_PROMPT_PREFIX = `<system_context>
You are part of a multi-agent system called AI SDK Agents, designed to make agent coordination and execution easy. This system uses two primary abstractions: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function, generally named \`handoff_to_agent\`. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.
</system_context>

<tool_calling_guidelines>
When you need to call multiple tools, call them ALL at once using parallel tool calling.
</tool_calling_guidelines>`;

/**
 * Add recommended instructions to the prompt for agents that use handoffs.
 *
 * @param prompt - The original prompt string.
 * @returns The prompt prefixed with recommended handoff instructions.
 */
export function promptWithHandoffInstructions(prompt: string): string {
  return `${RECOMMENDED_PROMPT_PREFIX}\n\n${prompt}`;
}
