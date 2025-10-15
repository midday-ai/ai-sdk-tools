import type { ConversationMessage, WorkingMemory } from "./types.js";

/**
 * Default working memory template
 */
export const DEFAULT_TEMPLATE = `# Working Memory

## Key Facts
- [Important information goes here]

## Current Focus
- [What the user is working on]

## Preferences
- [User preferences and settings]
`;

/**
 * Format working memory for system prompt
 */
export function formatWorkingMemory(memory: WorkingMemory | null): string {
  if (!memory?.content) return "";
  return `\n## Working Memory\n\n${memory.content}\n`;
}

/**
 * Format conversation history
 */
export function formatHistory(
  messages: ConversationMessage[],
  limit = 10,
): string {
  if (!messages.length) return "";

  const recent = messages.slice(-limit);
  const formatted = recent
    .map((m) => `**${m.role}**: ${m.content}`)
    .join("\n\n");

  return `\n## Recent Messages\n\n${formatted}\n`;
}

/**
 * Instructions for working memory
 */
export function getWorkingMemoryInstructions(template: string): string {
  return `
## Working Memory Instructions

You have access to persistent working memory that stores data across agent handoffs.

**CRITICAL: Check working memory BEFORE making handoffs or tool calls**

**Memory Usage Rules:**
1. **ALWAYS check working memory first** - Use \`updateWorkingMemory\` to read existing data
2. **Store tool results** - After calling tools, store results in working memory for other agents
3. **Avoid redundant calls** - If data exists in memory, use it instead of calling tools again
4. **Coordinate handoffs** - Check if other agents have already provided needed data

**When to use updateWorkingMemory:**
- **Before handoffs**: Check for existing data from other agents
- **After tool calls**: Store results for future use
- **User context**: Remember preferences, facts, and patterns
- **Cross-agent data**: Share data between different specialists

**Handoff Coordination:**
- If you need data that might exist in working memory, check first
- Only hand off to agents when you need NEW data not available in memory
- Coordinate with other agents by storing and retrieving shared data
- Avoid multiple parallel handoffs for the same information

**Template:**
\`\`\`
${template}
\`\`\`

**Remember: Working memory persists across the entire conversation and agent handoffs. Use it to coordinate efficiently with other agents.**
`.trim();
}
