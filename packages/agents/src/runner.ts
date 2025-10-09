import type { ModelMessage } from "ai";
import { debug } from "./debug.js";
import { isHandoffResult } from "./handoff.js";
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

    this.registerAgent(initialAgent);
    this.registerHandoffAgents(initialAgent);

    let currentAgent = initialAgent;
    let totalTurns = 0;
    // Only use initialMessages if explicitly provided (not empty array)
    const messages: ModelMessage[] = runOptions.initialMessages || [];
    let resolvedResult: AgentGenerateResult | null = null;
    const originalInput = input;
    const handoffHistory: HandoffInstruction[] = [];
    const startTime = new Date();

    // Create streaming generator that yields structured data immediately
    const streamGenerator = async function* (
      this: Runner,
    ): AsyncGenerator<StreamChunk> {
      // Start orchestration
      debug("ORCHESTRATION", `Starting with ${currentAgent.name}`, {
        handoffAgents: currentAgent.getHandoffs().map((a) => a.name),
        maxTurns: maxTotalTurns,
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
            debug(
              "STREAM",
              `Chunk ${chunkCount} from ${currentAgent.name}:`,
              chunk.substring(0, 50),
            );

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
                    handoffHistory.push(handoff); // Track handoffs
                    handoffFound = true; // Mark that we found a handoff

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
          yield {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            agent: currentAgent.name,
            role: "system",
          };
          break;
        }
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
            usage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
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
