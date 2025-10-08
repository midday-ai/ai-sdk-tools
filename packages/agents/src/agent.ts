import {
  Experimental_Agent as AISDKAgent,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type ModelMessage,
  stepCountIs,
  type Tool,
} from "ai";
import { debug } from "./debug.js";
import { createHandoffTool, isHandoffResult } from "./handoff.js";
import { promptWithHandoffInstructions } from "./handoff-prompt.js";
import { run } from "./runner.js";
import type {
  AgentConfig,
  AgentGenerateOptions,
  AgentGenerateResult,
  AgentStreamOptions,
  AgentStreamResult,
  HandoffInstruction,
} from "./types.js";

export class Agent {
  public readonly name: string;
  public readonly instructions: string;
  private readonly aiAgent: AISDKAgent<Record<string, Tool>>;
  private readonly handoffAgents: Agent[];

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.instructions = config.instructions;
    this.handoffAgents = (config.handoffs as Agent[]) || [];

    // Prepare tools with handoff capability
    const tools = { ...config.tools };
    if (this.handoffAgents.length > 0) {
      tools.handoff_to_agent = createHandoffTool(this.handoffAgents);
    }

    // Add recommended prompt prefix for handoffs
    const systemPrompt =
      this.handoffAgents.length > 0
        ? promptWithHandoffInstructions(config.instructions)
        : config.instructions;

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
      // Use AI SDK Agent's generate method
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
        ...result,
        finalAgent: this.name,
        finalOutput: result.text || "",
        handoffs,
        metadata: {
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
        },
      };
    } catch (error) {
      throw new Error(
        `Agent ${this.name} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async stream(options: AgentStreamOptions): Promise<AgentStreamResult> {
    debug("STREAM", `${this.name} stream called`);
    debug("ORCHESTRATION", `Stream options for ${this.name}`, {
      hasPrompt: !!options.prompt,
      messageCount: options.messages?.length || 0,
    });

    if (
      !options.prompt &&
      (!options.messages || options.messages.length === 0)
    ) {
      throw new Error("No prompt or messages provided to stream method");
    }

    // If we have messages, we need to use a different approach
    if (options.messages && options.messages.length > 0) {
      return this.aiAgent.stream({
        messages: [
          ...options.messages,
          { role: "user", content: options.prompt || "Continue" },
        ],
      });
    }

    return this.aiAgent.stream({
      prompt: options.prompt,
    });
  }

  getHandoffs(): Agent[] {
    return this.handoffAgents;
  }

  // Respond method - uses orchestration for handoffs, native AI SDK for single agents
  async respond(options: { messages: ModelMessage[] }) {
    // If this agent has handoffs, use orchestration
    if (this.handoffAgents.length > 0) {
      debug("ORCHESTRATION", `Starting orchestration with ${this.name}`, {
        handoffAgents: this.handoffAgents.map((a) => a.name),
        messageCount: options.messages.length,
      });

      // Extract text from last message
      const lastMessage = options.messages[options.messages.length - 1] as any;

      // Handle both content and parts structure
      let textContent = "";
      if (lastMessage.parts) {
        // Message has parts structure
        const textPart = lastMessage.parts.find(
          (part: any) => part.type === "text",
        );
        textContent = textPart?.text || "";
      } else if (Array.isArray(lastMessage.content)) {
        // Message has content array
        const textPart = lastMessage.content.find(
          (part: any) => part.type === "text",
        );
        textContent = textPart?.text || "";
      } else {
        // Message has direct content
        textContent = lastMessage.content || "";
      }

      debug(
        "ORCHESTRATION",
        `Extracted user input: "${textContent.substring(0, 100)}..."`,
      );

      // Messages are already in ModelMessage format from the API route

      // Create UI message stream using proper AI SDK v5 pattern
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          const startTime = Date.now();
          debug(
            "STREAM",
            "Starting orchestration stream with full message history",
          );

          // Generate message ID for text deltas
          const messageId = `orchestration-${Date.now()}`;

          try {
            // Use orchestration runner with full message history for proper handoff support
            // Pass all messages except the last one (which is the current user message that will be the prompt)
            const previousMessages =
              options.messages.length > 1
                ? options.messages.slice(0, -1)
                : undefined;

            debug("STREAM", "Starting orchestration with message history:", {
              prompt: `${textContent.substring(0, 50)}...`,
              messageCount: previousMessages?.length || 0,
              hasHandoffs: this.handoffAgents.length > 0,
              totalMessages: options.messages.length,
            });

            const result = await run(this, textContent, {
              stream: true,
              maxTotalTurns: 15,
              initialMessages: previousMessages,
            });

            // Directly write to writer instead of using merge
            try {
              let isFirstTextChunk = true;

              for await (const chunk of result.stream) {
                if (chunk.type === "text-delta") {
                  // Send text-start for the first text chunk
                  if (isFirstTextChunk) {
                    writer.write({
                      type: "text-start",
                      id: messageId,
                    });
                    isFirstTextChunk = false;
                  }

                  writer.write({
                    type: "text-delta",
                    id: messageId,
                    delta: chunk.text,
                  });
                } else if (chunk.type === "tool-call") {
                  debug(
                    "TOOL",
                    `${chunk.agent} using ${chunk.toolName}`,
                    chunk.args,
                  );
                  writer.write({
                    type: "text-delta",
                    id: messageId,
                    delta: `\n🔧 Using ${chunk.toolName}...\n`,
                  });
                } else if (chunk.type === "tool-result") {
                  debug(
                    "TOOL",
                    `${chunk.agent} completed ${chunk.toolName}`,
                    chunk.result,
                  );
                  writer.write({
                    type: "text-delta",
                    id: messageId,
                    delta: `✅ ${chunk.toolName}: ${typeof chunk.result === "string" ? chunk.result : JSON.stringify(chunk.result)}\n`,
                  });
                } else if (chunk.type === "agent-switch") {
                  debug("HANDOFF", `${chunk.agent} → ${chunk.toAgent}`, {
                    context: chunk.context,
                    reason: chunk.reason,
                  });
                  writer.write({
                    type: "text-delta",
                    id: messageId,
                    delta: `\n🔄 Switching to ${chunk.toAgent}${chunk.reason ? ` (${chunk.reason})` : ""}...\n`,
                  });
                } else if (chunk.type === "agent-complete") {
                  debug("COMPLETE", `${chunk.agent} completed`, {
                    outputLength: chunk.finalOutput?.length || 0,
                  });
                  // Don't write finalOutput - we already streamed all text-delta chunks
                }
              }

              // End the text message
              writer.write({
                type: "text-end",
                id: messageId,
              });
            } catch (error) {
              console.error("DEBUG: Error in orchestration stream:", error);
              throw error;
            }

            // Wait for orchestration to complete
            const finalResult = await result.result;
            const duration = Date.now() - startTime;
            debug("PERF", `Orchestration completed in ${duration}ms`, {
              finalAgent: finalResult.finalAgent,
              handoffCount: finalResult.handoffs?.length || 0,
            });
          } catch (error) {
            debug("ERROR", "Orchestration failed", error);
            writer.write({
              type: "text-delta",
              id: messageId,
              delta: `\n❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`,
            });
            writer.write({
              type: "text-end",
              id: messageId,
            });
          }
        },
      });

      return createUIMessageStreamResponse({ stream });
    }

    // For single agents, use native AI SDK
    return this.aiAgent.respond(options as any);
  }

  static create(config: AgentConfig): Agent {
    return new Agent(config);
  }
}
