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
## Working Memory

You have access to persistent working memory that stores user preferences, context, and important facts across conversations.

**ALWAYS call updateWorkingMemory when:**
- User shares OR corrects their name, role, company, or preferences
- User provides OR updates important facts you should remember
- User corrects previous information about themselves
- Any new or changed context that should persist for future conversations

**Template structure to follow:**
\`\`\`
${template}
\`\`\`

**Critical:** After calling updateWorkingMemory, respond to the user confirming the update.
`.trim();
}
