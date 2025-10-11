import type { ModelMessage } from "ai";
import { debug } from "./debug.js";
import {
  MaxTurnsExceededError,
  runInputGuardrails,
  runOutputGuardrails,
} from "./guardrails.js";
import { isHandoffResult } from "./handoff.js";
import { findBestMatch } from "./routing.js";
import type {
  Agent,
  AgentGenerateResult,
  AgentStreamingResult,
  HandoffInstruction,
  RunOptions,
  StreamChunk,
} from "./types.js";

/**
 * Multi-agent execution engine that handles orchestration and handoffs
 */
export class Runner {
  private agents: Map<string, Agent> = new Map();
  private options: RunOptions;

  constructor(options: RunOptions = {}) {
    this.options = {
      maxTotalTurns: 20,
      ...options,
    };
  }

  /**
   * Register an agent with the runner
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.name, agent);
  }

  /**
   * Register multiple agents
   */
  registerAgents(agents: Agent[]): void {
    for (const agent of agents) {
      this.registerAgent(agent);
    }
  }

  /**
   * Run a multi-agent conversation starting with the specified agent
   */
  async run(
    startingAgent: Agent | string,
    input: string,
    options?: Partial<RunOptions>,
  ): Promise<AgentGenerateResult> {
    const runOptions = { ...this.options, ...options };
    const maxTotalTurns = runOptions.maxTotalTurns || 20;

    // Get starting agent
    const initialAgent =
      typeof startingAgent === "string"
        ? this.agents.get(startingAgent)
        : startingAgent;

    if (!initialAgent) {
      throw new Error(
        `Agent not found: ${typeof startingAgent === "string" ? startingAgent : "unknown"}`,
      );
    }

    // Register all agents that might be needed
    this.registerAgent(initialAgent);
    this.registerHandoffAgents(initialAgent);

    let currentAgent = initialAgent;
    let totalTurns = 0;
    const messages: ModelMessage[] = [];

    while (totalTurns < maxTotalTurns) {
      try {
        // Run current agent
        const result = await currentAgent.generate({
          prompt: input,
          messages,
        });

        totalTurns += result.steps?.length || 1;

        // Update messages from steps
        if (result.steps) {
          for (const step of result.steps) {
            if (step.text) {
              messages.push({
                role: "assistant",
                content: step.text,
              });
            }
          }
        }

        // Check for handoffs
        let handoffFound = false;
        if (result.steps) {
          for (const step of result.steps) {
            if (step.toolCalls) {
              for (const toolCall of step.toolCalls) {
                // Find the corresponding tool result
                const toolResult = step.toolResults?.find(
                  (tr) => tr.toolCallId === toolCall.toolCallId,
                );
                if (toolResult && isHandoffResult(toolResult.output)) {
                  const handoff = toolResult.output as HandoffInstruction;

                  // Notify callback
                  if (runOptions.onHandoff) {
                    runOptions.onHandoff(handoff);
                  }

                  // Find target agent
                  const targetAgent = this.agents.get(handoff.targetAgent);
                  if (!targetAgent) {
                    throw new Error(
                      `Target agent not found: ${handoff.targetAgent}`,
                    );
                  }

                  // Add handoff context to messages if provided
                  if (handoff.context) {
                    messages.push({
                      role: "system",
                      content: `Handoff context: ${handoff.context}${handoff.reason ? ` (Reason: ${handoff.reason})` : ""}`,
                    });
                  }

                  // Switch to target agent
                  currentAgent = targetAgent;
                  handoffFound = true;

                  // Clear input for subsequent agents (they'll use messages)
                  input = "";
                  break;
                }
              }
            }
            if (handoffFound) break;
          }
        }

        // If no handoff, we're done
        if (!handoffFound) {
          // Return the result with finalOutput properly set
          return {
            ...result,
            finalOutput: result.finalOutput || result.text || "",
          };
        }
      } catch (error) {
        throw new Error(
          `Error during execution: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    throw new Error("Maximum turns exceeded");
  }

  private registerHandoffAgents(agent: Agent): void {
    const handoffs = agent.getHandoffs();
    for (const handoffAgent of handoffs) {
      this.registerAgent(handoffAgent);
      // Recursively register their handoff agents too
      this.registerHandoffAgents(handoffAgent);
    }
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * Run a streaming multi-agent conversation
   */
  async runStream(
    startingAgent: Agent | string,
    input: string,
    options?: Partial<RunOptions>,
  ): Promise<AgentStreamingResult> {
    const runOptions = { ...this.options, ...options };
    const maxTotalTurns = runOptions.maxTotalTurns || 20;
    const strategy = runOptions.strategy || "auto";
    const context = runOptions.context || {};
    // const usageTracker = createUsageTracker(); // TODO: Implement tool permission tracking

    // Get starting agent
    let initialAgent =
      typeof startingAgent === "string"
        ? this.agents.get(startingAgent)
        : startingAgent;

    if (!initialAgent) {
      throw new Error(
        `Agent not found: ${typeof startingAgent === "string" ? startingAgent : "unknown"}`,
      );
    }

    this.registerAgent(initialAgent);
    this.registerHandoffAgents(initialAgent);

    // HYBRID ROUTING: If strategy is 'auto' and initial agent has handoffs, try programmatic routing first
    if (strategy === "auto" && initialAgent.getHandoffs().length > 0) {
      const specialists = initialAgent.getHandoffs();
      const matchedAgent = findBestMatch(
        specialists,
        input,
        (agent) => agent.matchOn,
      );

      if (matchedAgent) {
        debug("ROUTING", `Programmatic match: ${matchedAgent.name}`);
        // Direct route to specialist (fast path)
        initialAgent = matchedAgent;
      } else {
        debug(
          "ROUTING",
          `No programmatic match, using LLM routing via ${initialAgent.name}`,
        );
        // Use triage agent with LLM routing (fallback)
      }
    }

    let currentAgent = initialAgent;
    let totalTurns = 0;
    // Only use initialMessages if explicitly provided (not empty array)
    const messages: ModelMessage[] = runOptions.initialMessages || [];
    let resolvedResult: AgentGenerateResult | null = null;
    const originalInput = input;
    const handoffHistory: HandoffInstruction[] = [];
    const startTime = new Date();
    const usedAgents = new Set<string>([currentAgent.name]); // Track used agents for duplicate prevention

    // Create streaming generator that yields structured data immediately
    const streamGenerator = async function* (
      this: Runner,
    ): AsyncGenerator<StreamChunk> {
      // Run input guardrails
      try {
        if (currentAgent.inputGuardrails) {
          await runInputGuardrails(
            currentAgent.inputGuardrails,
            input,
            context,
          );
        }
      } catch (error) {
        yield {
          type: "error",
          error: error instanceof Error ? error.message : "Guardrail failed",
          agent: currentAgent.name,
          role: "system",
        };
        return;
      }

      // Emit start event
      if (runOptions.onEvent) {
        try {
          await runOptions.onEvent({
            type: "start",
            agent: currentAgent.name,
            input,
          });
        } catch (error) {
          debug("EVENT", "onEvent handler failed", error);
        }
      }

      // Start orchestration
      debug("ORCHESTRATION", `Starting with ${currentAgent.name}`, {
        handoffAgents: currentAgent.getHandoffs().map((a) => a.name),
        maxTurns: maxTotalTurns,
        strategy,
      });

      // Immediate feedback - orchestration starting
      yield {
        type: "orchestration-status",
        status: "planning",
        agent: currentAgent.name,
        role: "system",
      };

      while (totalTurns < maxTotalTurns) {
        try {
          debug(
            "ORCHESTRATION",
            `Turn ${totalTurns + 1}: ${currentAgent.name} executing`,
          );

          // Show agent thinking
          yield {
            type: "agent-thinking",
            agent: currentAgent.name,
            task: input,
            role: "system",
          };

          yield {
            type: "orchestration-status",
            status: "executing",
            agent: currentAgent.name,
            role: "system",
          };

          // Ensure we have a valid prompt
          // If we have messages (after handoff), use a simple continuation prompt
          const promptToUse =
            messages.length > 0
              ? input || "Please proceed with the task."
              : input || originalInput || "Continue the conversation";

          // Only pass messages if we have any (don't pass empty array)
          const stream = await currentAgent.stream(
            messages.length > 0
              ? { prompt: promptToUse, messages }
              : { prompt: promptToUse, messages: undefined },
          );

          debug(
            "STREAM",
            `Starting to consume textStream for ${currentAgent.name}`,
          );
          let chunkCount = 0;
          const textChunks: string[] = [];

          // Always collect chunks, and stream them immediately
          for await (const chunk of stream.textStream) {
            chunkCount++;
            textChunks.push(chunk);

            // Always yield immediately - we'll suppress orchestrator text in agent.ts
            yield {
              type: "text-delta",
              text: chunk,
              agent: currentAgent.name,
              role: "assistant",
            };
          }
          debug(
            "STREAM",
            `textStream ended for ${currentAgent.name}, total chunks: ${chunkCount}`,
          );

          // Get the completed result for handoff detection
          const result = await stream;

          const steps = await result.steps;
          totalTurns += steps?.length || 1;

          // Check for handoffs
          let handoffFound = false;
          if (steps) {
            for (const step of steps) {
              if (step.toolCalls) {
                debug(
                  "ORCHESTRATION",
                  `Found ${step.toolCalls.length} tool calls`,
                  {
                    tools: step.toolCalls.map((tc) => tc.toolName),
                  },
                );
                for (const toolCall of step.toolCalls) {
                  yield {
                    type: "tool-call",
                    toolName: toolCall.toolName,
                    args:
                      (toolCall as { input?: Record<string, unknown> }).input ||
                      {},
                    agent: currentAgent.name,
                    role: "assistant",
                  };
                }
              }

              if (step.toolResults) {
                for (const toolResult of step.toolResults) {
                  yield {
                    type: "tool-result",
                    toolName: toolResult.toolName,
                    result: toolResult.output,
                    agent: currentAgent.name,
                    role: "assistant",
                  };

                  if (isHandoffResult(toolResult.output)) {
                    const handoff = toolResult.output as HandoffInstruction;
                    console.log("DEBUG: Handoff detected:", handoff);

                    // Check for duplicate agent usage
                    if (usedAgents.has(handoff.targetAgent)) {
                      debug(
                        "ORCHESTRATION",
                        `Preventing duplicate handoff to ${handoff.targetAgent}`,
                      );
                      // Don't handoff, continue with current agent's output
                      break;
                    }

                    handoffHistory.push(handoff); // Track handoffs
                    handoffFound = true; // Mark that we found a handoff

                    // Emit handoff event
                    if (runOptions.onEvent) {
                      try {
                        await runOptions.onEvent({
                          type: "handoff",
                          from: currentAgent.name,
                          to: handoff.targetAgent,
                          reason: handoff.reason,
                        });
                      } catch (error) {
                        debug("EVENT", "onEvent handler failed", error);
                      }
                    }

                    yield {
                      type: "agent-switch",
                      fromAgent: currentAgent.name,
                      toAgent: handoff.targetAgent,
                      reason: handoff.reason,
                      context: handoff.context,
                      agent: currentAgent.name,
                      role: "system",
                    };

                    // Show progress update
                    yield {
                      type: "orchestration-status",
                      status: "routing",
                      agent: handoff.targetAgent,
                      role: "system",
                    };

                    // Find target agent
                    const targetAgent = this.agents.get(handoff.targetAgent);
                    if (!targetAgent) {
                      yield {
                        type: "error",
                        error: `Target agent not found: ${handoff.targetAgent}`,
                        agent: currentAgent.name,
                        role: "system",
                      };
                      return;
                    }

                    // Add handoff context with original question
                    if (handoff.context) {
                      messages.push({
                        role: "system",
                        content: `Handoff context: ${handoff.context}${handoff.reason ? ` (Reason: ${handoff.reason})` : ""}. Original request: ${originalInput}`,
                      });
                    } else {
                      messages.push({
                        role: "system",
                        content: `You are being handed off to handle: ${originalInput}`,
                      });
                    }

                    usedAgents.add(handoff.targetAgent); // Track used agents
                    currentAgent = targetAgent;
                    handoffFound = true;
                    input = ""; // Clear input, let agent respond to system message context
                    console.log("DEBUG: Switched to agent:", currentAgent.name);
                    break;
                  }
                }
              }
              if (handoffFound) break;
            }
          }

          // If no handoff, we're done
          if (!handoffFound) {
            const finalText = (await result.text) || "";

            // Run output guardrails
            try {
              if (currentAgent.outputGuardrails) {
                await runOutputGuardrails(
                  currentAgent.outputGuardrails,
                  finalText,
                  context,
                );
              }
            } catch (error) {
              yield {
                type: "error",
                error:
                  error instanceof Error
                    ? error.message
                    : "Output guardrail failed",
                agent: currentAgent.name,
                role: "system",
              };
              break;
            }

            // Emit complete event
            if (runOptions.onEvent) {
              try {
                await runOptions.onEvent({
                  type: "complete",
                  agent: currentAgent.name,
                  output: finalText,
                });
              } catch (error) {
                debug("EVENT", "onEvent handler failed", error);
              }
            }

            yield {
              type: "agent-complete",
              agent: currentAgent.name,
              finalOutput: finalText || "",
              role: "assistant",
            };

            const endTime = new Date();
            resolvedResult = {
              text: finalText || "",
              finalAgent: currentAgent.name,
              finalOutput: finalText || "",
              handoffs: handoffHistory, // Use tracked handoffs
              metadata: {
                startTime,
                endTime,
                duration: endTime.getTime() - startTime.getTime(), // Proper duration
              },
              steps: await result.steps,
              finishReason: await result.finishReason,
              usage: await result.usage,
            };
            break;
          }
        } catch (error) {
          // Emit error event
          if (runOptions.onEvent) {
            try {
              await runOptions.onEvent({
                type: "error",
                agent: currentAgent.name,
                error:
                  error instanceof Error ? error : new Error(String(error)),
              });
            } catch (eventError) {
              debug("EVENT", "onEvent handler failed", eventError);
            }
          }

          yield {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            agent: currentAgent.name,
            role: "system",
          };
          break;
        }
      }

      // Check if max turns exceeded
      if (totalTurns >= maxTotalTurns && !resolvedResult) {
        const error = new MaxTurnsExceededError(totalTurns, maxTotalTurns);

        if (runOptions.onEvent) {
          try {
            await runOptions.onEvent({
              type: "error",
              agent: currentAgent.name,
              error,
            });
          } catch (eventError) {
            debug("EVENT", "onEvent handler failed", eventError);
          }
        }

        yield {
          type: "error",
          error: error.message,
          agent: currentAgent.name,
          role: "system",
        };
      }
    }.bind(this);

    const streamInstance = streamGenerator();

    return {
      stream: streamInstance,
      result: (async () => {
        // Wait for the stream to complete and return the resolved result
        // Don't consume the stream here as it's being consumed elsewhere
        let attempts = 0;
        const maxAttempts = 100; // Wait up to 10 seconds

        while (!resolvedResult && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (resolvedResult) {
          return resolvedResult;
        } else {
          // Create a basic result if none was set
          const endTime = new Date();
          return {
            text: "",
            finalAgent: currentAgent.name,
            finalOutput: "",
            handoffs: handoffHistory,
            metadata: {
              startTime,
              endTime,
              duration: endTime.getTime() - startTime.getTime(),
            },
            steps: [],
            finishReason: "stop",
            usage: undefined,
          };
        }
      })(),
    };
  }
}

export async function run(
  agent: Agent | string,
  input: string,
  options: RunOptions & { stream: true },
): Promise<AgentStreamingResult>;

export async function run(
  agent: Agent | string,
  input: string,
  options?: RunOptions & { stream?: false },
): Promise<AgentGenerateResult>;

export async function run(
  agent: Agent | string,
  input: string,
  options?: RunOptions & { stream?: boolean },
): Promise<AgentGenerateResult | AgentStreamingResult> {
  const runner = new Runner(options);

  if (options?.stream) {
    // Use the working streaming implementation
    return runner.runStream(agent, input, options);
  }

  return runner.run(agent, input, options);
}

/**
 * Legacy streaming function (use run with { stream: true } instead)
 * @deprecated Use run(agent, input, { stream: true }) instead
 */
export async function runStream(
  agent: Agent | string,
  input: string,
  options?: RunOptions,
): Promise<AgentStreamingResult> {
  const runner = new Runner(options);
  return runner.runStream(agent, input, options);
}
