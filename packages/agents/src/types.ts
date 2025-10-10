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
  matchOn?: (string | RegExp)[] | ((message: string) => boolean);
  onEvent?: (event: any) => void | Promise<void>;
  inputGuardrails?: any[];
  outputGuardrails?: any[];
  permissions?: any;
  generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
  stream(options: AgentStreamOptions): AgentStreamResult;
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
  /** Programmatic routing patterns */
  matchOn?: (string | RegExp)[] | ((message: string) => boolean);
  /** Lifecycle event handler */
  onEvent?: (event: AgentEvent) => void | Promise<void>;
  /** Input guardrails - run before agent execution */
  inputGuardrails?: InputGuardrail[];
  /** Output guardrails - run after agent execution */
  outputGuardrails?: OutputGuardrail[];
  /** Tool permissions - control tool access */
  permissions?: ToolPermissions;
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
  prompt?: string;
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
  /** Routing strategy */
  strategy?: "auto" | "llm";
  /** Max steps per agent */
  maxSteps?: number;
  /** Global timeout in ms */
  timeout?: number;
  /** Per-agent timeout in ms */
  agentTimeout?: number;
  /** Context for permissions and guardrails */
  context?: Record<string, unknown>;
  /** Lifecycle event handler */
  onEvent?: (event: AgentEvent) => void | Promise<void>;
  /** Whether this is a streaming run (internal) */
  stream?: boolean;
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

/**
 * Lifecycle events emitted by agents
 */
export type AgentEvent =
  | { type: "start"; agent: string; input: string }
  | { type: "agent-start"; agent: string; round: number }
  | { type: "agent-step"; agent: string; step: any }
  | { type: "agent-finish"; agent: string; round: number }
  | { type: "agent-handoff"; from: string; to: string; reason?: string }
  | { type: "agent-complete"; totalRounds: number }
  | { type: "agent-error"; error: Error }
  | { type: "tool-call"; agent: string; toolName: string; args: unknown }
  | { type: "handoff"; from: string; to: string; reason?: string }
  | { type: "complete"; agent: string; output: string }
  | { type: "error"; agent: string; error: Error };

/**
 * Guardrail result
 */
export interface GuardrailResult {
  tripwireTriggered: boolean;
  outputInfo?: unknown;
}

/**
 * Input guardrail - runs before agent execution
 */
export interface InputGuardrail {
  name: string;
  execute: (args: {
    input: string;
    context?: unknown;
  }) => Promise<GuardrailResult>;
}

/**
 * Output guardrail - runs after agent execution
 */
export interface OutputGuardrail<TOutput = unknown> {
  name: string;
  execute: (args: {
    agentOutput: TOutput;
    context?: unknown;
  }) => Promise<GuardrailResult>;
}

/**
 * Tool permission context
 */
export interface ToolPermissionContext {
  user?: { id: string; roles: string[]; [key: string]: any };
  usage: { toolCalls: Record<string, number>; tokens: number };
  [key: string]: any;
}

/**
 * Tool permission result
 */
export interface ToolPermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Tool permission check function
 */
export type ToolPermissionCheck = (ctx: {
  toolName: string;
  args: unknown;
  context: ToolPermissionContext;
}) => ToolPermissionResult | Promise<ToolPermissionResult>;

/**
 * Tool permissions configuration
 */
export interface ToolPermissions {
  check: ToolPermissionCheck;
}

/**
 * Options for agent.toUIMessageStream()
 */
export interface AgentStreamOptionsUI {
  /** User input text */
  input: string;
  /** Message history (user controls slicing) */
  messages?: ModelMessage[];
  /** Routing strategy */
  strategy?: "auto" | "llm";
  /** Max orchestration rounds */
  maxRounds?: number;
  /** Max steps per agent */
  maxSteps?: number;
  /** Global timeout (ms) */
  timeout?: number;
  /**
   * Context for permissions, guardrails, and artifacts.
   * This object will be wrapped in RunContext<T> and passed to all tools and hooks.
   * The writer will be automatically added when streaming.
   */
  context?: Record<string, unknown>;
  /** Hook before streaming starts */
  beforeStream?: (ctx: { writer: any }) => Promise<boolean | undefined>;
  /** Transform chunks before writing */
  onChunk?: (chunk: StreamChunk) => unknown;
  /** AI SDK transform */
  experimental_transform?: any;
  /** Lifecycle event handler */
  onEvent?: (event: AgentEvent) => void | Promise<void>;
}
