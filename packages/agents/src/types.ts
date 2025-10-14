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
  _updateWorkingMemoryTool?: Tool;
}

/**
 * Handoff data structure
 */
export interface HandoffData {
  agent: string;
  reason?: string;
  data?: Record<string, unknown>;
}

// Forward declaration
export interface Agent<
  TContext extends Record<string, unknown> = Record<string, unknown>
> {
  name: string;
  instructions: string | ((context: TContext) => string);
  matchOn?: (string | RegExp)[] | ((message: string) => boolean);
  onEvent?: (event: AgentEvent) => void | Promise<void>;
  inputGuardrails?: InputGuardrail[];
  outputGuardrails?: OutputGuardrail[];
  permissions?: ToolPermissions;
  generate(options: AgentGenerateOptions): Promise<AgentGenerateResult>;
  stream(options: AgentStreamOptions): AgentStreamResult;
  getHandoffs(): Array<Agent<any>>;
}

export interface AgentConfig<
  TContext extends Record<string, unknown> = Record<string, unknown>
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
  handoffs?: Array<Agent<any>>;
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
  /**
   * Handoff context configuration - controls how much conversation history is passed during agent handoffs.
   *
   * This solves the critical issue where agents lose conversation context during multi-turn tasks
   * or when handing off to specialist agents. Configure how many messages each agent type receives
   * to ensure proper conversation continuity.
   *
   * @see HandoffContextConfig for detailed configuration options
   */
  handoffContext?: HandoffContextConfig;
  /**
   * Enable message search capability - allows agents to search through conversation history
   *
   * When enabled and the memory provider supports search functionality, agents will have
   * access to a built-in searchMessages tool for finding relevant information in past conversations.
   *
   * Can be a boolean to simply enable/disable, or an object to configure scope:
   * - `enabled: true` - enables search with default scope (chat)
   * - `{ enabled: true, scope: 'user' }` - enables search with user-wide scope
   *
   * @default false
   */
  enableMessageSearch?: boolean | { enabled: boolean; scope?: "chat" | "user" };
}

/**
 * Configuration for handoff context - controls how much conversation history is passed during agent handoffs.
 *
 * This configuration solves the issue where agents lose conversation context during multi-turn tasks
 * or when handing off to specialist agents. By default, the current agent only gets the latest message
 * and specialist agents only get the last 8 messages, which can cause agents to "forget" what they're doing.
 *
 * @example
 * ```typescript
 * const agent = new Agent({
 *   name: "task-manager",
 *   model: openai("gpt-4"),
 *   instructions: "You manage complex tasks...",
 *   handoffs: [specialistAgent],
 *   handoffContext: {
 *     currentAgentMessages: 'all',  // Current agent gets full conversation
 *     specialistMessages: 20        // Specialists get exactly 20 messages
 *   }
 * });
 *
 * // For cases where you want to limit context but ensure minimum preservation:
 * const agent2 = new Agent({
 *   name: "task-manager-2",
 *   model: openai("gpt-4"),
 *   instructions: "You manage complex tasks...",
 *   handoffs: [specialistAgent],
 *   handoffContext: {
 *     currentAgentMessages: 5,   // Current agent gets exactly 5 messages
 *     specialistMessages: 10     // Specialists get exactly 10 messages
 *   }
 * });
 *
 * // For default behavior with intelligent context preservation:
 * const agent3 = new Agent({
 *   name: "task-manager-3",
 *   model: openai("gpt-4"),
 *   instructions: "You manage complex tasks...",
 *   handoffs: [specialistAgent]
 *   // No handoffContext specified - uses defaults with minimum 20 messages
 * });
 * ```
 */
export interface HandoffContextConfig {
  /**
   * Number of messages to pass to the current agent during execution.
   *
   * When an agent is working on a multi-step task, it needs to remember what it was doing.
   * By default, the current agent only gets the latest message (1), which causes it to lose
   * context of the original task.
   *
   * Intelligent context management:
   * - If set to `'all'`, passes the entire conversation history
   * - If set to a specific number, respects that exact number (no minimum enforcement)
   * - If undefined, uses default (1) but enforces a minimum of 20 messages to prevent context loss
   *
   * This approach ensures context preservation while respecting explicit user configuration.
   *
   * - `number`: Pass exactly the last N messages to the current agent
   * - `'all'`: Pass the entire conversation history to the current agent
   * - `undefined`: Use default (1 message) but with minimum 20 for context preservation
   *
   * @default 1
   * @example currentAgentMessages: 'all' // Current agent gets full context
   */
  currentAgentMessages?: number | "all";

  /**
   * Number of messages to pass to specialist agents during handoffs.
   *
   * When an agent hands off to a specialist, the specialist needs enough context to
   * understand the user's request and what the previous agent was trying to accomplish.
   * By default, specialists only get the last 8 messages, which may not be enough context.
   *
   * Intelligent context management:
   * - If set to `'all'`, passes the entire conversation history
   * - If set to a specific number, respects that exact number (no minimum enforcement)
   * - If undefined, uses default (8) but enforces a minimum of 20 messages to prevent context loss
   *
   * This approach ensures context preservation while respecting explicit user configuration.
   *
   * - `number`: Pass exactly the last N messages to specialist agents
   * - `'all'`: Pass the entire conversation history to specialist agents
   * - `undefined`: Use default (8 messages) but with minimum 20 for context preservation
   *
   * @default 8
   * @example specialistMessages: 20 // Specialists get more context
   */
  specialistMessages?: number | "all";
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
  TContext extends Record<string, unknown> = Record<string, unknown>
> {
  // Agent-specific options
  /** Single new message - agent loads history from memory (recommended when memory is enabled) */
  message?: UIMessage;
  /** Full message array - for apps without memory or manual control */
  messages?: ModelMessage[];
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
  TDataParts extends Record<string, unknown> = AgentDataParts
> = UIMessage<TMetadata, TDataParts>;
