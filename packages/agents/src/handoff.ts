import { tool } from "ai";
import { z } from "zod";
import type { Agent, HandoffInstruction } from "./types.js";

/**
 * Creates a handoff instruction for transferring to another agent
 */
export function createHandoff(
  targetAgent: Agent | string,
  context?: string,
  reason?: string,
): HandoffInstruction {
  const targetName =
    typeof targetAgent === "string" ? targetAgent : targetAgent.name;

  return {
    targetAgent: targetName,
    context,
    reason,
  };
}

/**
 * Handoff tool that agents can use to transfer to other agents
 */
export function createHandoffTool(availableAgents: Agent[]) {
  return tool({
    description: "Transfer the conversation to another specialized agent",
    inputSchema: z.object({
      targetAgent: z.enum(availableAgents.map((agent) => agent.name)),
      context: z
        .string()
        .optional()
        .describe("Context or summary to pass to the target agent"),
      reason: z.string().optional().describe("Reason for the handoff"),
    }),
    execute: async ({ targetAgent, context, reason }) => {
      // This will be handled by the runner
      return createHandoff(targetAgent, context, reason);
    },
  });
}

/**
 * Checks if a result contains a handoff instruction
 */
export function isHandoffResult(result: unknown): result is HandoffInstruction {
  return (
    typeof result === "object" &&
    result !== null &&
    "targetAgent" in result &&
    typeof (result as HandoffInstruction).targetAgent === "string"
  );
}
