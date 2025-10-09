import type { UIMessage } from "ai";

export type AgentStatus = {
  status: "routing" | "executing" | "completing";
  agent:
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
 * Custom UI Message type with agent orchestration status data
 */
export type AgentUIMessage = UIMessage<
  never, // metadata type
  {
    // Agent status updates (transient - won't be in message history)
    "agent-status": AgentStatus;
  } // data parts type
>;
