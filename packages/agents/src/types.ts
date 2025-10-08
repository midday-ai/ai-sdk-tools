import type {
  LanguageModel,
  ModelMessage,
  StepResult,
  StreamTextResult,
  Tool,
} from "ai";

// Forward declaration
export interface Agent {
  name: string;
  instructions: string;
  generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
  stream(options: AgentStreamOptions): Promise<AgentStreamResult>;
  getHandoffs(): Agent[];
}

export interface AgentConfig {
  /** Unique name for the agent */
  name: string;
  /** System instructions for the agent */
  instructions: string;
  /** Language model to use */
  model: LanguageModel;
  /** Tools available to the agent */
  tools?: Record<string, Tool>;
  /** Agents this agent can hand off to */
  handoffs?: Agent[];
  /** Maximum number of turns before stopping */
  maxTurns?: number;
  /** Temperature for model responses */
  temperature?: number;
  /** Additional model settings */
  modelSettings?: Record<string, unknown>;
}

export interface HandoffInstruction {
  /** Target agent to hand off to */
  targetAgent: string;
  /** Context to pass to the target agent */
  context?: string;
  /** Reason for the handoff */
  reason?: string;
}

/**
 * Generate options for agents
 */
export interface AgentGenerateOptions {
  prompt: string;
  messages?: ModelMessage[];
}

/**
 * Stream options for agents
 */
export interface AgentStreamOptions {
  prompt: string;
  messages?: ModelMessage[];
}

export interface AgentGenerateResult {
  text: string;
  finalAgent: string;
  finalOutput: string;
  handoffs: HandoffInstruction[];
  metadata: { startTime: Date; endTime: Date; duration: number };
  steps?: StepResult<Record<string, Tool>>[];
  finishReason?: string;
  usage?: unknown;
  toolCalls?: unknown[];
}

/**
 * Extended stream result type
 */
export type AgentStreamResult = StreamTextResult<Record<string, Tool>, never>;

/**
 * Run options for multi-agent orchestration
 */
export interface RunOptions {
  /** Maximum total turns across all agents */
  maxTotalTurns?: number;
  /** Callback for handoff events */
  onHandoff?: (handoff: HandoffInstruction) => void;
  /** Initial message history to start with */
  initialMessages?: ModelMessage[];
}

/**
 * Base chunk with common properties
 */
interface BaseStreamChunk {
  agent: string;
  timestamp?: Date;
}

/**
 * Role-based streaming chunks following AI SDK patterns
 */
export type StreamChunk =
  | (BaseStreamChunk & {
      type: "text-delta";
      text: string;
      role: "assistant";
    })
  | (BaseStreamChunk & {
      type: "agent-switch";
      fromAgent: string;
      toAgent: string;
      reason?: string;
      context?: string;
      role: "system";
    })
  | (BaseStreamChunk & {
      type: "tool-call";
      toolName: string;
      args: Record<string, unknown>;
      role: "assistant";
    })
  | (BaseStreamChunk & {
      type: "tool-result";
      toolName: string;
      result: unknown;
      role: "assistant";
    })
  | (BaseStreamChunk & {
      type: "agent-complete";
      finalOutput: string;
      role: "assistant";
    })
  | (BaseStreamChunk & {
      type: "error";
      error: string;
      role: "system";
    })
  | (BaseStreamChunk & {
      type: "orchestration-status";
      status: "planning" | "routing" | "executing" | "completed";
      role: "system";
    })
  | (BaseStreamChunk & {
      type: "agent-thinking";
      task: string;
      role: "system";
    })
  | (BaseStreamChunk & {
      type: "workflow-progress";
      currentStep: number;
      totalSteps: number;
      stepName: string;
      role: "system";
    });

/**
 * Streaming result for multi-agent workflows
 */
export interface AgentStreamingResult {
  /** Async iterator for streaming chunks */
  stream: AsyncIterable<StreamChunk>;
  /** Final result (available after stream completes) */
  result: Promise<AgentGenerateResult>;
}

export interface AgentRunOptions {
  metadata?: any;
  maxTotalTurns?: number;
}
