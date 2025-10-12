import {
  DEFAULT_TEMPLATE,
  formatWorkingMemory,
  getWorkingMemoryInstructions,
  type MemoryConfig,
} from "@ai-sdk-tools/memory";
import {
  Experimental_Agent as AISDKAgent,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  type LanguageModel,
  type ModelMessage,
  type StepResult,
  stepCountIs,
  type Tool,
  tool,
  type UIMessage,
  type UIMessageStreamOnFinishCallback,
  type UIMessageStreamWriter,
} from "ai";
import { z } from "zod";
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
  ExtendedExecutionContext,
  HandoffData,
  HandoffInstruction,
  Agent as IAgent,
  InputGuardrail,
  MemoryIdentifiers,
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
  private readonly memory?: MemoryConfig;
  private readonly model: LanguageModel;
  private readonly aiAgent: AISDKAgent<Record<string, Tool>>;
  private readonly handoffAgents: Array<IAgent<any>>;
  private readonly configuredTools: Record<string, Tool>;

  constructor(config: AgentConfig<TContext>) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.matchOn = config.matchOn;
    this.onEvent = config.onEvent;
    this.inputGuardrails = config.inputGuardrails;
    this.outputGuardrails = config.outputGuardrails;
    this.permissions = config.permissions;
    this.memory = config.memory;
    this.model = config.model;
    this.handoffAgents = config.handoffs || [];

    // Prepare tools with handoff capability
    const tools = { ...config.tools };
    if (this.handoffAgents.length > 0) {
      tools.handoff_to_agent = createHandoffTool(this.handoffAgents);
    }

    // Add working memory tool if enabled
    if (this.memory?.workingMemory?.enabled) {
      tools.updateWorkingMemory = this.createWorkingMemoryTool();
    }

    // Store tools for later reference
    this.configuredTools = tools;

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

    // Get memory addition from context if preloaded
    const extendedContext = executionContext as ExtendedExecutionContext;
    const memoryAddition = extendedContext._memoryAddition || "";

    // Add handoff instructions if needed
    const systemPrompt =
      this.handoffAgents.length > 0
        ? promptWithHandoffInstructions(resolvedInstructions + memoryAddition)
        : resolvedInstructions + memoryAddition;

    // Build additional options to pass to AI SDK
    const additionalOptions: Record<string, unknown> = {
      system: systemPrompt, // Override system prompt per call
    };
    if (executionContext)
      additionalOptions.experimental_context = executionContext;
    if (maxSteps) additionalOptions.maxSteps = maxSteps;
    if (onStepFinish) additionalOptions.onStepFinish = onStepFinish;

    // Inject working memory tool if preloaded in context
    if (extendedContext._updateWorkingMemoryTool) {
      additionalOptions.tools = {
        ...this.configuredTools,
        updateWorkingMemory: extendedContext._updateWorkingMemoryTool,
      };
    }

    // Handle simple { messages } format (like working code)
    if ("messages" in options && !("prompt" in options) && options.messages) {
      debug("ORCHESTRATION", `Stream with messages only`, {
        messageCount: options.messages.length,
      });
      return this.aiAgent.stream({
        messages: options.messages,
        ...additionalOptions,
      }) as unknown as AgentStreamResult;
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
      }) as unknown as AgentStreamResult;
    }

    // Prompt only
    if (opts.prompt) {
      return this.aiAgent.stream({
        prompt: opts.prompt,
        ...additionalOptions,
      }) as unknown as AgentStreamResult;
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
      message,
      messages: providedMessages,
      strategy = "auto",
      maxRounds = 5,
      maxSteps = 5,
      context,
      agentChoice,
      toolChoice,
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

    // Store user message text for later use in onFinish
    let userMessageText = "";

    // Extract input from message or messages
    if (message) {
      userMessageText = extractTextFromMessage(
        convertToModelMessages([message])[0],
      );
    } else if (providedMessages) {
      userMessageText = extractTextFromMessage(
        providedMessages[providedMessages.length - 1],
      );
    }

    // Wrap onFinish to save messages after streaming
    const wrappedOnFinish: UIMessageStreamOnFinishCallback<never> = async (
      event,
    ) => {
      // Save messages and update chat session after stream completes
      if (this.memory?.history?.enabled && context) {
        const { chatId, userId } = this.extractMemoryIdentifiers(
          context as TContext,
        );

        if (!chatId) {
          debug(
            "MEMORY",
            "Cannot save messages: chatId is missing from context",
          );
        } else {
          try {
            const assistantText = this.extractAssistantText(
              event.responseMessage,
            );
            await this.saveConversation(
              chatId,
              userId,
              userMessageText,
              assistantText,
            );
          } catch (err) {
            debug("MEMORY", "Failed to save conversation:", err);
          }
        }
      }

      // Call user's onFinish
      await onFinish?.(event);
    };

    const stream = createUIMessageStream({
      originalMessages: (message ? [message] : providedMessages) as never[],
      onFinish: wrappedOnFinish,
      onError,
      generateId,
      execute: async ({ writer }) => {
        // Handle message vs messages parameter and load history from memory
        let messages: ModelMessage[];

        if (message) {
          // Single message - load history if memory is enabled
          messages = await this.loadMessagesWithHistory(
            message,
            context as TContext,
          );
        } else if (providedMessages) {
          // Messages provided - use as-is
          messages = providedMessages;
        } else {
          throw new Error("Either message or messages must be provided");
        }

        // Extract input from last message for routing
        const lastMessage = messages[messages.length - 1];
        const input = extractTextFromMessage(lastMessage);

        // Import context utilities
        const { createExecutionContext } = await import("./context.js");

        // Load working memory from agent-level config
        let memoryAddition = "";
        if (context && this.memory?.workingMemory?.enabled) {
          memoryAddition = await this.loadWorkingMemory(context as TContext);
        }

        // Generate chat title if this is the first message
        await this.maybeGenerateChatTitle(context as TContext, input, writer);

        // Create execution context with user context and writer
        const executionContext = createExecutionContext({
          context: (context || {}) as Record<string, unknown>,
          writer,
          metadata: {
            agent: this.name,
            requestId: `req_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          },
        });

        // Store memory addition for system prompt injection
        if (memoryAddition) {
          const extendedExecContext =
            executionContext as ExtendedExecutionContext;
          extendedExecContext._memoryAddition = memoryAddition;
        }

        try {
          // Execute beforeStream hook - allows for rate limiting, auth, etc.
          if (beforeStream) {
            const shouldContinue = await beforeStream({ writer });
            if (shouldContinue === false) {
              // Type assertion needed: custom finish message format
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

          // Check for explicit agent or tool choice (highest priority)
          if (agentChoice && specialists.length > 0) {
            const chosenAgent = specialists.find(
              (agent) => agent.name === agentChoice,
            );
            if (chosenAgent) {
              currentAgent = chosenAgent;
              console.log(
                `[ROUTING] Explicit agent choice: ${currentAgent.name}`,
              );

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

              // Emit handoff event for explicit choice
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: chosenAgent.name,
                  reason: "User selected agent",
                  routingStrategy: "explicit",
                },
                transient: true,
              } as never);

              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: chosenAgent.name,
                  reason: "User selected agent",
                });
              }
            }
          } else if (toolChoice && specialists.length > 0) {
            // Find agent that has the requested tool
            const agentWithTool = specialists.find((agent) => {
              const agentImpl = agent as Agent<any>;
              return (
                agentImpl.configuredTools &&
                toolChoice in agentImpl.configuredTools
              );
            });

            if (agentWithTool) {
              currentAgent = agentWithTool;
              console.log(
                `[ROUTING] Tool choice routing: ${toolChoice} → ${currentAgent.name}`,
              );

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

              // Emit handoff event for tool choice
              writer.write({
                type: "data-agent-handoff",
                data: {
                  from: this.name,
                  to: agentWithTool.name,
                  reason: `User requested tool: ${toolChoice}`,
                  routingStrategy: "tool-choice",
                  preferredTool: toolChoice,
                },
                transient: true,
              } as never);

              if (onEvent) {
                await onEvent({
                  type: "agent-handoff",
                  from: this.name,
                  to: agentWithTool.name,
                  reason: `User requested tool: ${toolChoice}`,
                });
              }
            }
          } else if (strategy === "auto" && specialists.length > 0) {
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

            // Type assertion needed: executionContext and onStepFinish types don't strictly match
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
            let handoffData: HandoffData | null = null;
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
                  handoffData = chunk.output as HandoffData;
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

          // Type assertions needed: custom error and finish message formats
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

  /**
   * Extract chatId and userId from context for memory operations
   */
  private extractMemoryIdentifiers(context: TContext): {
    chatId?: string;
    userId?: string;
  } {
    const ctx = context as TContext & MemoryIdentifiers;
    const chatId = ctx.chatId || ctx.metadata?.chatId;
    const userId = ctx.userId || ctx.metadata?.userId;
    return { chatId, userId };
  }

  /**
   * Generate a title for the chat based on the first user message
   */
  private async generateChatTitle(
    chatId: string,
    userMessage: string,
    writer: UIMessageStreamWriter,
    context?: TContext,
  ): Promise<void> {
    if (!this.memory?.chats?.generateTitle) return;

    const config = this.memory.chats.generateTitle;
    const model = typeof config === "object" ? config.model : this.model;
    const instructions =
      typeof config === "object" && config.instructions
        ? config.instructions
        : "Generate a short title based on the user's message. Max 80 characters. No quotes or colons.";

    try {
      // Load working memory to give context to title generation
      let memoryContext = "";
      if (context && this.memory?.workingMemory?.enabled) {
        memoryContext = await this.loadWorkingMemory(context);
      }

      const systemPrompt = memoryContext
        ? `${instructions}\n\n${memoryContext}`
        : instructions;

      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: userMessage,
      });

      await this.memory.provider?.updateChatTitle?.(chatId, text);

      writer.write({
        type: "data-chat-title",
        data: { chatId, title: text },
      });

      debug("MEMORY", `Generated title for ${chatId}: ${text}`);
    } catch (err) {
      debug("MEMORY", "Title generation failed:", err);
    }
  }

  /**
   * Create the updateWorkingMemory tool
   */
  private createWorkingMemoryTool() {
    const scope = this.memory?.workingMemory?.scope || "chat";

    return tool({
      description: getWorkingMemoryInstructions(
        this.memory?.workingMemory?.template || DEFAULT_TEMPLATE,
      ),
      inputSchema: z.object({
        content: z
          .string()
          .describe(
            "Updated working memory content in markdown format. Use the template structure provided.",
          ),
      }),
      execute: async ({ content }, options) => {
        if (!this.memory?.provider) {
          return { success: false, message: "Memory provider not configured" };
        }

        const { getContext } = await import("./context.js");
        const ctx = getContext(
          options as { experimental_context?: Record<string, unknown> },
        );
        const contextData = ctx as TContext | undefined;

        if (!contextData) {
          return { success: false, message: "Context not available" };
        }

        const { chatId, userId } = this.extractMemoryIdentifiers(contextData);

        try {
          await this.memory.provider.updateWorkingMemory({
            chatId,
            userId,
            scope,
            content,
          });
          return {
            success: true,
            message: "Working memory updated successfully",
          };
        } catch (error) {
          debug(
            "MEMORY",
            "Failed to update working memory:",
            error instanceof Error ? error.message : error,
          );
          return { success: false, message: "Failed to update working memory" };
        }
      },
    });
  }

  /**
   * Load working memory and inject into system prompt
   */
  private async loadWorkingMemory(context: TContext): Promise<string> {
    if (!this.memory?.workingMemory?.enabled || !this.memory?.provider) {
      return "";
    }

    const { chatId, userId } = this.extractMemoryIdentifiers(context);
    const scope = this.memory.workingMemory.scope;

    try {
      const memory = await this.memory.provider.getWorkingMemory({
        chatId,
        userId,
        scope,
      });

      if (!memory) return "";

      return formatWorkingMemory(memory);
    } catch (error) {
      debug(
        "MEMORY",
        "Failed to load working memory:",
        error instanceof Error ? error.message : error,
      );
      return "";
    }
  }

  /**
   * Extract assistant text from response message
   */
  private extractAssistantText(responseMessage: UIMessage): string {
    // Convert UIMessage to ModelMessage and extract text
    const modelMessages = convertToModelMessages([responseMessage]);
    if (modelMessages.length > 0) {
      return extractTextFromMessage(modelMessages[0]);
    }
    return "";
  }

  /**
   * Load message history from memory and prepend to the current message.
   * Falls back to just the current message if history is disabled or unavailable.
   *
   * @param message - The current user message
   * @param context - Execution context containing chatId
   * @returns Array of ModelMessages including history + current message
   */
  private async loadMessagesWithHistory(
    message: UIMessage,
    context: TContext | undefined,
  ): Promise<ModelMessage[]> {
    // No memory - just convert the message
    if (!this.memory?.history?.enabled || !context) {
      return convertToModelMessages([message]);
    }

    const { chatId } = this.extractMemoryIdentifiers(context);

    if (!chatId) {
      debug("MEMORY", "Cannot load history: chatId missing from context");
      return convertToModelMessages([message]);
    }

    try {
      const previousMessages =
        (await this.memory.provider.getMessages?.({
          chatId,
          limit: this.memory.history.limit,
        })) || [];

      debug(
        "MEMORY",
        `Loading history for chatId=${chatId}: found ${previousMessages.length} messages`,
      );

      if (previousMessages.length === 0) {
        return convertToModelMessages([message]);
      }

      // Convert stored messages directly to ModelMessages
      const historyMessages = previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content || "",
      }));

      debug(
        "MEMORY",
        `Loaded ${historyMessages.length} history messages for context`,
      );
      return [...historyMessages, ...convertToModelMessages([message])];
    } catch (err) {
      debug("MEMORY", `Load history failed for chatId=${chatId}:`, err);
      return convertToModelMessages([message]);
    }
  }

  /**
   * Update or create a chat session, incrementing message count
   *
   * @param chatId - The chat identifier
   * @param userId - Optional user identifier
   * @param incrementBy - Number to increment message count by (default: 2)
   */
  private async updateChatSession(
    chatId: string,
    userId: string | undefined,
    incrementBy: number = 2,
  ): Promise<void> {
    if (!this.memory?.chats?.enabled) return;

    const existingChat = await this.memory.provider.getChat?.(chatId);

    if (existingChat) {
      // Update existing chat
      await this.memory.provider.saveChat?.({
        ...existingChat,
        messageCount: existingChat.messageCount + incrementBy,
        updatedAt: new Date(),
      });
    } else {
      // Create new chat
      await this.memory.provider.saveChat?.({
        chatId,
        userId,
        messageCount: incrementBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  /**
   * Save user and assistant messages, then update chat session.
   * Messages are saved in parallel for better performance.
   *
   * @param chatId - The chat identifier
   * @param userId - Optional user identifier
   * @param userMessage - The user's message text
   * @param assistantMessage - The assistant's response text
   */
  private async saveConversation(
    chatId: string,
    userId: string | undefined,
    userMessage: string,
    assistantMessage: string,
  ): Promise<void> {
    if (!this.memory?.provider || !this.memory?.history?.enabled) return;

    debug(
      "MEMORY",
      `Saving conversation for chatId=${chatId}: user="${userMessage.substring(0, 50)}..." assistant="${assistantMessage.substring(0, 50)}..."`,
    );

    // Save both messages in parallel for better performance
    await Promise.all([
      this.memory.provider.saveMessage?.({
        chatId,
        userId,
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      }),
      assistantMessage
        ? this.memory.provider.saveMessage?.({
            chatId,
            userId,
            role: "assistant",
            content: assistantMessage,
            timestamp: new Date(),
          })
        : Promise.resolve(),
    ]);

    debug("MEMORY", `Successfully saved conversation for chatId=${chatId}`);

    // Update chat session after saving messages
    await this.updateChatSession(chatId, userId, 2);
  }

  /**
   * Generate a chat title if this is the first message.
   * Runs asynchronously without blocking the response.
   *
   * @param context - Execution context containing chatId
   * @param userMessage - The user's message to generate title from
   * @param writer - Stream writer for sending title update
   */
  private async maybeGenerateChatTitle(
    context: TContext | undefined,
    userMessage: string,
    writer: UIMessageStreamWriter,
  ): Promise<void> {
    if (
      !this.memory?.chats?.enabled ||
      !this.memory?.chats?.generateTitle ||
      !context
    ) {
      return;
    }

    const { chatId } = this.extractMemoryIdentifiers(context);

    if (!chatId) {
      debug("MEMORY", "Cannot generate title: chatId missing from context");
      return;
    }

    const existingChat = await this.memory.provider?.getChat?.(chatId);

    // Only generate for first message
    if (!existingChat || existingChat.messageCount === 0) {
      this.generateChatTitle(chatId, userMessage, writer, context).catch(
        (err) => debug("MEMORY", "Title generation error:", err),
      );
    }
  }

  static create<
    TContext extends Record<string, unknown> = Record<string, unknown>,
  >(config: AgentConfig<TContext>): Agent<TContext> {
    return new Agent<TContext>(config);
  }
}
