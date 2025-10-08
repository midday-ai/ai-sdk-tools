import type { UIMessage } from "ai";

/**
 * Custom UI Message type with agent orchestration status data
 */
export type AgentUIMessage = UIMessage<
  never, // metadata type
  {
    // Agent status updates (transient - won't be in message history)
    "agent-status": {
      status: "routing" | "executing" | "completing";
      agent:
        | "orchestrator"
        | "reports"
        | "transactions"
        | "invoices"
        | "timeTracking"
        | "customers"
        | "analytics"
        | "operations";
    };
  } // data parts type
>;
