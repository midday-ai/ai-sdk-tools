/**
 * Tool Permissions System
 *
 * Runtime access control for tool execution
 */

import { ToolPermissionDeniedError } from "./guardrails.js";
import type { ToolPermissionContext, ToolPermissions } from "./types.js";

/**
 * Check if a tool can be executed based on permissions
 */
export async function checkToolPermission(
  permissions: ToolPermissions | undefined,
  toolName: string,
  args: unknown,
  context: ToolPermissionContext,
): Promise<void> {
  if (!permissions) return;

  try {
    const result = await permissions.check({ toolName, args, context });

    if (!result.allowed) {
      throw new ToolPermissionDeniedError(
        toolName,
        result.reason || "Permission denied",
      );
    }
  } catch (error) {
    if (error instanceof ToolPermissionDeniedError) {
      throw error;
    }
    // Re-throw other errors as-is
    throw error;
  }
}

/**
 * Create a tool usage tracker for permission context
 */
export function createUsageTracker(): ToolPermissionContext["usage"] {
  return {
    toolCalls: {},
    tokens: 0,
  };
}

/**
 * Update usage tracker with tool call
 */
export function trackToolCall(
  usage: ToolPermissionContext["usage"],
  toolName: string,
): void {
  usage.toolCalls[toolName] = (usage.toolCalls[toolName] || 0) + 1;
}
