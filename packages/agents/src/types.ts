import type { MemoryConfig } from "@ai-sdk-tools/memory";
import type {
  IdGenerator,
  LanguageModel,
  LanguageModelUsage,
  ModelMessage,
  StepResult,
  StreamTextResult,
  Tool,
  UIMessage,
  UIMessageStreamOnFinishCallback,
  UIMessageStreamWriter,
} from "ai";
import type { AgentRunContext } from "./run-context.js";

/**
 * Interface for context objects that include memory identifiers
 */
export interface MemoryIdentifiers {
  chatId?: string;
  userId?: string;
  metadata?: {
    chatId?: string;
    userId?: string;
  };
}

/**
 * Extended execution context with internal memory properties
 */
export interface ExtendedExecutionContext extends Record<string, unknown> {
  _memoryAddition?: string;
}

/**
 * Handoff data structure
 */
export interface HandoffData {
  agent: string;
  reason?: string;
  data?: Record<string, unknown>;
}

/**
 * ConfiguredHandoff - represents an agent with handoff configuration
 */
export interface HandoffConfig<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Callback when handoff is invoked */
  onHandoff?: (context: AgentRunContext<TContext>) => void | Promise<void>;
  /** Input filter to modify data passed to the next agent */
  inputFilter?: HandoffInputFilter;
}

export interface ConfiguredHandoff<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  agent: Agent<TContext>;
  config?: HandoffConfig<TContext>;
}

// Forward declaration
export interface Agent<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  name: string;
  instructions: string | ((context: TContext) => string);
  matchOn?: (string | RegExp)[] | ((message: string) => boolean);
  onEvent?: (event: AgentEvent) => void | Promise<void>;
  inputGuardrails?: InputGuardrail[];
  outputGuardrails?: OutputGuardrail[];
  permissions?: ToolPermissions;
  lastMessages?: number;
  generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
  stream(options: AgentStreamOptions): AgentStreamResult;
  getHandoffs(): Array<Agent<any>>;
}

export interface AgentConfig<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Unique name for the agent */
  name: string;
  /**
   * Static instructions or dynamic function that receives context.
   * Function receives the full execution context and returns the system prompt.
   */
  instructions: string | ((context: TContext) => string);
  /** Language model to use */
  model: LanguageModel;
  /** Tools available to the agent - static or dynamic function receiving context */
  tools?: Record<string, Tool> | ((context: TContext) => Record<string, Tool>);
  /** Agents this agent can hand off to */
  handoffs?: Array<Agent<any> | ConfiguredHandoff<any>>;
  /** Description of when to hand off to this agent */
  handoffDescription?: string;
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
  /** Memory configuration - persistent working memory and conversation history */
  memory?: MemoryConfig;
  /** Number of last messages from memory thread to include in context (default: 10) */
  lastMessages?: number;
}

export interface HandoffInstruction {
  /** Target agent to hand off to */
  targetAgent: string;
  /** Context to pass to the target agent */
  context?: string;
  /** Reason for the handoff */
  reason?: string;
  /** Tool results that are already available */
  availableData?: Record<string, any>;
}

export interface HandoffInputData {
  /** The input history before the handoff */
  inputHistory: ModelMessage[];
  /** Items generated before the handoff */
  preHandoffItems: any[];
  /** New items generated during current turn (including tool results) */
  newItems: any[];
  /** Run context */
  runContext?: any;
}

export type HandoffInputFilter = (input: HandoffInputData) => HandoffInputData;

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
  toolChoice?: string;
}

export interface AgentGenerateResult {
  text: string;
  finalAgent: string;
  finalOutput: string;
  handoffs: HandoffInstruction[];
  metadata: { startTime: Date; endTime: Date; duration: number };
  steps?: StepResult<Record<string, Tool>>[];
  finishReason?: string;
  usage?: LanguageModelUsage;
  toolCalls?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
  }>;
}

/**
 * Extended stream result type
 */
export type AgentStreamResult = StreamTextResult<Record<string, Tool>, never>;

/**
 * Lifecycle events emitted by agents
 */
export type AgentEvent =
  | { type: "start"; agent: string; input: string }
  | { type: "agent-start"; agent: string; round: number }
  | {
      type: "agent-step";
      agent: string;
      step: StepResult<Record<string, Tool>>;
    }
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
  user?: { id: string; roles: string[]; [key: string]: unknown };
  usage: { toolCalls: Record<string, number>; tokens: number };
  [key: string]: unknown;
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
export interface AgentStreamOptionsUI<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  // Agent-specific options
  /** New user message - agent automatically loads conversation history from memory */
  message: UIMessage;
  /** Routing strategy */
  strategy?: "auto" | "llm";
  /** Max orchestration rounds */
  maxRounds?: number;
  /** Max steps per agent */
  maxSteps?: number;
  /** Global timeout (ms) */
  timeout?: number;
  /** Direct agent selection - bypasses triage routing */
  agentChoice?: string;
  /** Tool preference - routes to agent with this tool and hints to use it */
  toolChoice?: string;
  /**
   * Context for permissions, guardrails, and artifacts.
   * This object will be wrapped in RunContext<T> and passed to all tools and hooks.
   * The writer will be automatically added when streaming.
   */
  context?: TContext;
  /** Hook before streaming starts */
  beforeStream?: (ctx: {
    writer: UIMessageStreamWriter;
  }) => Promise<boolean | undefined>;
  /** Lifecycle event handler */
  onEvent?: (event: AgentEvent) => void | Promise<void>;

  // AI SDK createUIMessageStream options
  /** Callback when stream finishes with final messages */
  onFinish?: UIMessageStreamOnFinishCallback<never>;
  /** Process errors, e.g. to log them. Returns error message for data stream */
  onError?: (error: unknown) => string;
  /** Generate message ID for the response message */
  generateId?: IdGenerator;

  // AI SDK toUIMessageStream options
  /** Send reasoning parts to client (default: true) */
  sendReasoning?: boolean;
  /** Send source parts to client (default: false) */
  sendSources?: boolean;
  /** Send finish event to client (default: true) */
  sendFinish?: boolean;
  /** Send message start event to client (default: true) */
  sendStart?: boolean;
  /** Extract message metadata to send to client */
  messageMetadata?: (options: {
    part: unknown;
  }) => Record<string, unknown> | undefined;

  // AI SDK response options
  /** AI SDK transform - stream transform function */
  experimental_transform?: unknown;
  /** HTTP status code */
  status?: number;
  /** HTTP status text */
  statusText?: string;
  /** HTTP headers */
  headers?: Record<string, string>;
}

/**
 * Base data part schemas for agent orchestration streaming.
 * Users can extend this interface to add custom data parts.
 *
 * @example Extending with custom data parts
 * ```typescript
 * declare module '@ai-sdk-tools/agents' {
 *   interface AgentDataParts {
 *     'custom-data': {
 *       value: string;
 *       timestamp: number;
 *     };
 *   }
 * }
 * ```
 */
export interface AgentDataParts {
  /** Agent status updates (transient - won't be in message history) */
  "agent-status": {
    status: "routing" | "executing" | "completing";
    agent: string;
  };
  /** Agent handoff events (transient) */
  "agent-handoff": {
    from: string;
    to: string;
    reason?: string;
    routingStrategy?: "programmatic" | "llm";
  };
  /** Rate limit information (transient) */
  "rate-limit": {
    limit: number;
    remaining: number;
    reset: string;
    code?: string;
  };
  /** Suggested prompts (transient) */
  suggestions: {
    prompts: string[];
  };
  // Allow extension with custom data parts
  [key: string]: unknown;
}

/**
 * Generic UI Message type for agents with orchestration data parts.
 * Extends AI SDK's UIMessage with agent-specific data parts.
 *
 * @template TMetadata - Message metadata type (default: never)
 * @template TDataParts - Custom data parts type (default: AgentDataParts)
 *
 * @example Basic usage
 * ```typescript
 * import type { AgentUIMessage } from '@ai-sdk-tools/agents';
 *
 * const { messages } = useChat<AgentUIMessage>({
 *   api: '/api/chat',
 *   onData: (dataPart) => {
 *     if (dataPart.type === 'data-agent-status') {
 *       console.log('Agent status:', dataPart.data);
 *     }
 *   }
 * });
 * ```
 *
 * @example With custom data parts
 * ```typescript
 * interface MyDataParts extends AgentDataParts {
 *   'custom-metric': { value: number };
 * }
 *
 * const { messages } = useChat<AgentUIMessage<never, MyDataParts>>({
 *   api: '/api/chat'
 * });
 * ```
 */
export type AgentUIMessage<
  TMetadata = never,
  TDataParts extends Record<string, unknown> = AgentDataParts,
> = UIMessage<TMetadata, TDataParts>;
