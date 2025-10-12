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
## Memory Instructions

You can remember important information using the \`updateWorkingMemory\` tool.

**When to use it:**
- User shares important facts about themselves
- You learn preferences or patterns
- Context changes that you'll need later

**How to use it:**
- Call \`updateWorkingMemory\` with updated content
- Follow the template structure below
- Update naturally - don't mention it to users

**Template:**
\`\`\`
${template}
\`\`\`

Your memory persists across the conversation. Update it proactively.
`.trim();
}
