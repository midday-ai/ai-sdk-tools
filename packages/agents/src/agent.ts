import {
  Experimental_Agent as AISDKAgent,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type ModelMessage,
  type StepResult,
  stepCountIs,
  type Tool,
} from "ai";
import { debug } from "./debug.js";
import { createHandoffTool, isHandoffResult } from "./handoff.js";
import { promptWithHandoffInstructions } from "./handoff-prompt.js";
import { writeAgentStatus } from "./streaming.js";
import type {
  AgentConfig,
  AgentEvent,
  AgentGenerateOptions,
  AgentGenerateResult,
  AgentStreamOptions,
  AgentStreamOptionsUI,
  AgentStreamResult,
  HandoffInstruction,
  Agent as IAgent,
  InputGuardrail,
  OutputGuardrail,
  ToolPermissions,
} from "./types.js";
import { extractTextFromMessage } from "./utils.js";

export class Agent<
  TContext extends Record<string, unknown> = Record<string, unknown>,
> implements IAgent<TContext>
{
  public readonly name: string;
  public readonly instructions: string | ((context: TContext) => string);
  public readonly matchOn?:
    | (string | RegExp)[]
    | ((message: string) => boolean);
  public readonly onEvent?: (event: AgentEvent) => void | Promise<void>;
  public readonly inputGuardrails?: InputGuardrail[];
  public readonly outputGuardrails?: OutputGuardrail[];
  public readonly permissions?: ToolPermissions;
  private readonly aiAgent: AISDKAgent<Record<string, Tool>>;
  private readonly handoffAgents: Array<IAgent<any>>;

  constructor(config: AgentConfig<TContext>) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.matchOn = config.matchOn;
    this.onEvent = config.onEvent;
    this.inputGuardrails = config.inputGuardrails;
    this.outputGuardrails = config.outputGuardrails;
    this.permissions = config.permissions;
    this.handoffAgents = config.handoffs || [];

    // Prepare tools with handoff capability
    const tools = { ...config.tools };
    if (this.handoffAgents.length > 0) {
      tools.handoff_to_agent = createHandoffTool(this.handoffAgents);
    }

    // Note: If instructions is a function, it will be resolved per-call in stream()
    // We still need to create the AI SDK Agent with initial instructions for backwards compatibility
    const baseInstructions =
      typeof config.instructions === "string" ? config.instructions : "";
    const systemPrompt =
      this.handoffAgents.length > 0
        ? promptWithHandoffInstructions(baseInstructions)
        : baseInstructions;

    // Create AI SDK Agent
    this.aiAgent = new AISDKAgent<Record<string, Tool>>({
      model: config.model,
      system: systemPrompt,
      tools,
      stopWhen: stepCountIs(config.maxTurns || 10),
      temperature: config.temperature,
      ...config.modelSettings,
    });
  }

  async generate(options: AgentGenerateOptions): Promise<AgentGenerateResult> {
    const startTime = new Date();

    try {
      const result =
        options.messages && options.messages.length > 0
          ? await this.aiAgent.generate({
              messages: [
                ...options.messages,
                { role: "user", content: options.prompt || "Continue" },
              ],
            })
          : await this.aiAgent.generate({
              prompt: options.prompt,
            });

      const endTime = new Date();

      // Extract handoffs from steps
      const handoffs: HandoffInstruction[] = [];
      if (result.steps) {
        for (const step of result.steps) {
          if (step.toolResults) {
            for (const toolResult of step.toolResults) {
              if (isHandoffResult(toolResult.output)) {
                handoffs.push(toolResult.output as HandoffInstruction);
              }
            }
          }
        }
      }

      return {
        text: result.text || "",
        finalAgent: this.name,
        finalOutput: result.text || "",
        handoffs,
        metadata: {
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
        },
        steps: result.steps,
        finishReason: result.finishReason,
        usage: result.usage,
        toolCalls: result.toolCalls?.map((tc) => ({
          toolCallId: tc.toolCallId,
          toolName: tc.toolName,
          args: "args" in tc ? tc.args : undefined,
        })),
      };
    } catch (error) {
      throw new Error(
        `Agent ${this.name} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  stream(
    options: AgentStreamOptions | { messages: ModelMessage[] },
  ): AgentStreamResult {
    debug("STREAM", `${this.name} stream called`);

    // Extract our internal execution context (we map to/from AI SDK's experimental_context at boundaries)
    const executionContext = (options as Record<string, unknown>)
      .executionContext as Record<string, unknown> | undefined;
    const maxSteps = (options as Record<string, unknown>).maxSteps as
      | number
      | undefined;
    const onStepFinish = (options as Record<string, unknown>).onStepFinish as
      | ((step: unknown) => void | Promise<void>)
      | undefined;

    // Resolve instructions dynamically (static string or function)
    const resolvedInstructions =
      typeof this.instructions === "function"
        ? this.instructions(executionContext as TContext)
        : this.instructions;

    // Add handoff instructions if needed
    const systemPrompt =
      this.handoffAgents.length > 0
        ? promptWithHandoffInstructions(resolvedInstructions)
        : resolvedInstructions;

    // Build additional options to pass to AI SDK
    const additionalOptions: Record<string, unknown> = {
      system: systemPrompt, // Override system prompt per call
    };
    if (executionContext)
      additionalOptions.experimental_context = executionContext;
    if (maxSteps) additionalOptions.maxSteps = maxSteps;
    if (onStepFinish) additionalOptions.onStepFinish = onStepFinish;

    // Handle simple { messages } format (like working code)
    if ("messages" in options && !("prompt" in options) && options.messages) {
      debug("ORCHESTRATION", `Stream with messages only`, {
        messageCount: options.messages.length,
      });
      return this.aiAgent.stream({
        messages: options.messages,
        ...additionalOptions,
      } as any) as AgentStreamResult;
    }

    // Handle full AgentStreamOptions format
    const opts = options as AgentStreamOptions;
    debug("ORCHESTRATION", `Stream options for ${this.name}`, {
      hasPrompt: !!opts.prompt,
      messageCount: opts.messages?.length || 0,
    });

    if (!opts.prompt && (!opts.messages || opts.messages.length === 0)) {
      throw new Error("No prompt or messages provided to stream method");
    }

    // If we have messages, append prompt as user message
    if (opts.messages && opts.messages.length > 0 && opts.prompt) {
      return this.aiAgent.stream({
        messages: [...opts.messages, { role: "user", content: opts.prompt }],
        ...additionalOptions,
      } as any) as AgentStreamResult;
    }

    // Prompt only
    if (opts.prompt) {
      return this.aiAgent.stream({
        prompt: opts.prompt,
        ...additionalOptions,
      } as any) as AgentStreamResult;
    }

    throw new Error("No valid options provided to stream method");
  }

  getHandoffs(): Array<IAgent<any>> {
    return this.handoffAgents;
  }

  /**
   * Convert agent execution to UI Message Stream Response
   * High-level API for Next.js route handlers
   *
   * This follows the working pattern from the route.ts reference code
   */
  toUIMessageStream(options: AgentStreamOptionsUI): Response {
    const {
      messages,
      strategy = "auto",
      maxRounds = 5,
      maxSteps = 5,
      context,
      beforeStream,
      onEvent,
      // AI SDK createUIMessageStream options
      onFinish,
      onError,
      generateId,
      // AI SDK toUIMessageStream options
      sendReasoning,
      sendSources,
      sendFinish,
      sendStart,
      messageMetadata,
      // Response options
      status,
      statusText,
      headers,
    } = options;

    // Extract input from last message for routing
    const lastMessage = messages[messages.length - 1];
    const input = extractTextFromMessage(lastMessage);

    const stream = createUIMessageStream({
      originalMessages: messages as never[],
      onFinish,
      onError,
      generateId,
      execute: async ({ writer }) => {
        // Import context utilities
        const { createExecutionContext } = await import("./context.js");

        // Create execution context with user context and writer
        const executionContext = createExecutionContext({
          context: (context || {}) as Record<string, unknown>,
          writer,
          metadata: {
            agent: this.name,
            requestId: `req_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          },
        });

        try {
          // Execute beforeStream hook - allows for rate limiting, auth, etc.
          if (beforeStream) {
            const shouldContinue = await beforeStream({ writer });
            if (shouldContinue === false) {
              writer.write({ type: "finish" } as any);
              return;
            }
          }

          // Prepare conversation messages
          const conversationMessages = [...messages];

          // Get handoff agents (specialists)
          const specialists = this.getHandoffs();

          // Emit orchestrator start (even if we skip to specialist via programmatic routing)
          writeAgentStatus(writer, {
            status: "routing",
            agent: this.name,
          });

          if (onEvent) {
            await onEvent({
              type: "agent-start",
              agent: this.name,
              round: 0,
            });
          }

          // Determine starting agent using programmatic routing
          let currentAgent: IAgent<any> = this;

          if (strategy === "auto" && specialists.length > 0) {
            // Try programmatic classification
            const matchedAgent = specialists.find((agent) => {
              if (!agent.matchOn) return false;
              if (typeof agent.matchOn === "function") {
                return agent.matchOn(input);
              }
              if (Array.isArray(agent.matchOn)) {
                return agent.matchOn.some((pattern) => {
                  if (typeof pattern === "string") {
                    return input.toLowerCase().includes(pattern.toLowerCase());
                  }
                  if (pattern instanceof RegExp) {
                    return pattern.test(input);
                  }
                  return false;
                });
              }
              return false;
            });

            if (matchedAgent) {
              currentAgent = matchedAgent;
              console.log(`[ROUTING] Programmatic match: ${currentAgent.name}`);

              // Mark orchestrator as completing
              writeAgentStatus(writer, {
                status: "completing",
                agent: this.name,
              });

              if (onEvent) {
                await onEvent({
                  type: "agent-finish",
                  agent: this.name,
                  round: 0,
                });
              }

              // Emit handoff event for programmatic routing
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: matchedAgent.name,
                  reason: "Programmatic routing match",
                  routingStrategy: "programmatic",
                },
                transient: true,
              } as never);

              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: matchedAgent.name,
                  reason: "Programmatic routing match",
                });
              }
            }
          }

          let round = 0;
          const usedSpecialists = new Set<string>();

          // If we used programmatic routing, mark specialist as used
          if (currentAgent !== this) {
            usedSpecialists.add(currentAgent.name);
          }

          while (round++ < maxRounds) {
            // Send status: agent executing
            writeAgentStatus(writer, {
              status: "executing",
              agent: currentAgent.name,
            });

            const messagesToSend =
              currentAgent === this
                ? [conversationMessages[conversationMessages.length - 1]] // Latest only
                : conversationMessages.slice(-8); // Recent context

            // Emit agent start event
            if (onEvent) {
              await onEvent({
                type: "agent-start",
                agent: currentAgent.name,
                round,
              });
            }

            const result = currentAgent.stream({
              messages: messagesToSend,
              executionContext: executionContext,
              maxSteps, // Limit tool calls per round
              onStepFinish: async (step: unknown) => {
                if (onEvent) {
                  await onEvent({
                    type: "agent-step",
                    agent: currentAgent.name,
                    step: step as StepResult<Record<string, Tool>>,
                  });
                }
              },
            } as any);

            // This automatically converts fullStream to proper UI message chunks
            // Pass toUIMessageStream options from user config
            const uiStream = result.toUIMessageStream({
              sendReasoning,
              sendSources,
              sendFinish,
              sendStart,
              messageMetadata,
            });

            // Track for orchestration
            let textAccumulated = "";
            let handoffData: any = null;
            const toolCallNames = new Map<string, string>(); // toolCallId -> toolName
            let hasStartedContent = false;

            // Stream UI chunks - AI SDK handles all the formatting!
            for await (const chunk of uiStream) {
              // Clear status on first actual content (text or tool)
              if (
                !hasStartedContent &&
                (chunk.type === "text-delta" ||
                  chunk.type === "tool-input-start")
              ) {
                writeAgentStatus(writer, {
                  status: "completing",
                  agent: currentAgent.name,
                });
                hasStartedContent = true;
              }

              // Write chunk - type assertion needed because our custom AgentUIMessage
              // type is more restrictive than the chunks from toUIMessageStream()
              writer.write(chunk as any);

              // Track text for conversation history
              if (chunk.type === "text-delta") {
                textAccumulated += chunk.delta;
              }

              // Track tool names when they start
              if (chunk.type === "tool-input-start") {
                toolCallNames.set(chunk.toolCallId, chunk.toolName);
              }

              // Detect handoff from tool output
              if (chunk.type === "tool-output-available") {
                const toolName = toolCallNames.get(chunk.toolCallId);
                if (toolName === "handoff") {
                  handoffData = chunk.output;
                  console.log("[Handoff Detected]", handoffData);
                }
              }
            }

            // Update conversation
            if (textAccumulated) {
              conversationMessages.push({
                role: "assistant",
                content: textAccumulated,
              });
            }

            // Emit agent finish event
            if (onEvent) {
              await onEvent({
                type: "agent-finish",
                agent: currentAgent.name,
                round,
              });
            }

            // Handle orchestration flow
            if (currentAgent === this) {
              if (handoffData) {
                // Check if this specialist has already been used
                if (usedSpecialists.has(handoffData.agent)) {
                  // Don't route to the same specialist twice - task is complete
                  break;
                }

                // Send routing status
                writeAgentStatus(writer, {
                  status: "routing",
                  agent: "orchestrator",
                });

                // Mark specialist as used and route to it
                usedSpecialists.add(handoffData.agent);
                const nextAgent = specialists.find(
                  (a) => a.name === handoffData.agent,
                );
                if (nextAgent) {
                  currentAgent = nextAgent;

                  writer.write({
                    type: "data-agent-handoff",
                    data: {
                      from: this.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                      routingStrategy: "llm",
                    },
                    transient: true,
                  } as never);

                  // Emit handoff event
                  if (onEvent) {
                    await onEvent({
                      type: "agent-handoff",
                      from: this.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                    });
                  }
                }
              } else {
                // Orchestrator done, no more handoffs
                break;
              }
            } else {
              // Specialist done
              if (handoffData) {
                // Specialist handed off to another specialist
                if (usedSpecialists.has(handoffData.agent)) {
                  // Already used this specialist - complete
                  break;
                }

                // Route to next specialist
                usedSpecialists.add(handoffData.agent);
                const nextAgent = specialists.find(
                  (a) => a.name === handoffData.agent,
                );
                if (nextAgent) {
                  const previousAgent = currentAgent;
                  currentAgent = nextAgent;

                  // Write handoff to stream for devtools
                  writer.write({
                    type: "data-agent-handoff",
                    data: {
                      from: previousAgent.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                      routingStrategy: "llm",
                    },
                    transient: true,
                  } as never);

                  // Emit handoff event
                  if (onEvent) {
                    await onEvent({
                      type: "agent-handoff",
                      from: previousAgent.name,
                      to: nextAgent.name,
                      reason: handoffData.reason,
                    });
                  }
                }
              } else {
                // No handoff - specialist is done, complete the task
                break;
              }
            }
          }

          // Emit completion event
          if (onEvent) {
            await onEvent({
              type: "agent-complete",
              totalRounds: round,
            });
          }

          writer.write({ type: "finish" });
        } catch (error) {
          console.error("[AGENT] Error in toUIMessageStream:", error);

          // Emit error event
          if (onEvent) {
            await onEvent({
              type: "agent-error",
              error: error instanceof Error ? error : new Error(String(error)),
            });
          }

          writer.write({
            type: "error",
            error: error instanceof Error ? error.message : String(error),
          } as any);
          writer.write({ type: "finish" } as any);
        }
      },
    });

    const response = createUIMessageStreamResponse({
      stream,
      status,
      statusText,
      headers,
    });

    return response;
  }

  static create<
    TContext extends Record<string, unknown> = Record<string, unknown>,
  >(config: AgentConfig<TContext>): Agent<TContext> {
    return new Agent<TContext>(config);
  }
}
