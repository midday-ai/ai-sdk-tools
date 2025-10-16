import { tool } from "ai";
import { z } from "zod";
import type { 
  Agent, 
  HandoffInstruction, 
  HandoffConfig, 
  ConfiguredHandoff,
} from "./types.js";

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
 * Creates a configured handoff from an agent
 */
export function handoff<TContext extends Record<string, unknown> = Record<string, unknown>>(
  agent: Agent<TContext>,
  config?: HandoffConfig<TContext>
): ConfiguredHandoff<TContext> {
  return {
    agent,
    config,
  };
}

/**
 * Generates the message that will be given as tool output to the model that requested the handoff
 */
export function getTransferMessage<TContext extends Record<string, unknown>>(agent: Agent<TContext>): string {
  return JSON.stringify({ assistant: agent.name });
}

/**
 * Handoff tool that agents can use to transfer to other agents
 * Updated to work with ConfiguredHandoff
 */
export function createHandoffTool(availableHandoffs: Array<Agent | ConfiguredHandoff>) {
  const agentNames = availableHandoffs.map((h) => 
    'agent' in h ? h.agent.name : h.name
  );

  return tool({
    description: `Transfer the conversation to another specialized agent.
    
Available agents: ${agentNames.join(', ')}`,
    inputSchema: z.object({
      targetAgent: z.enum(agentNames as [string, ...string[]]),
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
 * The standard name for the handoff tool
 */
export const HANDOFF_TOOL_NAME = "handoff_to_agent";

/**
 * Checks if a tool name is the handoff tool
 */
export function isHandoffTool(toolName: string | undefined): boolean {
  return toolName === HANDOFF_TOOL_NAME;
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
