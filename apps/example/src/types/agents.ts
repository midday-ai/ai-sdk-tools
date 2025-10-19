import type {
  AgentDataParts,
  AgentUIMessage as BaseAgentUIMessage,
} from "ai-sdk-tools";

/**
 * Extended agent status type with application-specific agent names
 */
export type AgentStatus = {
  status: "routing" | "executing" | "completing";
  agent:
    | "triage"
    | "orchestrator"
    | "reports"
    | "transactions"
    | "invoices"
    | "timeTracking"
    | "customers"
    | "analytics"
    | "operations"
    | "research"
    | "general";
};
/**
 * Extended data parts interface with application-specific data
 *
 * This demonstrates how to extend the base AgentDataParts with
 * custom data parts for your application.
 */
export interface AppDataParts extends AgentDataParts {
  // Override the agent-status with our extended type
  "agent-status": AgentStatus;
}

/**
 * Custom UI Message type with application-specific data parts
 *
 * This reuses the base AgentUIMessage from the agents package
 * but extends it with application-specific data parts.
 *
 * @example Using in useChat
 * ```typescript
 * const { messages } = useChat<AgentUIMessage>({
 *   api: '/api/chat',
 *   onData: (dataPart) => {
 *     if (dataPart.type === 'data-agent-status') {
 *       console.log('Agent:', dataPart.data.agent);
 *     }
 *   }
 * });
 * ```
 */
export type AgentUIMessage = BaseAgentUIMessage<never, AppDataParts>;

