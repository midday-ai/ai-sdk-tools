#!/usr/bin/env bun

/**
 * Streaming Multi-Agent Test Script
 *
 * Tests real-time streaming with multi-agent handoffs
 * Run with: bun run scripts/test-streaming.ts
 */

import { openai } from "@ai-sdk/openai";
import { tool } from "ai";
import { z } from "zod";
import { Agent, run } from "../src/index.js";
import { printHeader, printStats, showSpinner, stopSpinner } from "./utils.js";

// Set up OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Please set OPENAI_API_KEY environment variable");
  console.log("   export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

export async function testStreaming() {
  printHeader("STREAMING MULTI-AGENT TEST");
  console.log("\nTesting real-time streaming with structured data");

  try {
    // Create calculator tool with loading
    const toolSpinner = showSpinner("Setting up calculator tool...");

    const calculatorTool = tool({
      description: "Perform mathematical calculations",
      inputSchema: z.object({
        expression: z.string().describe("Mathematical expression to evaluate"),
      }),
      execute: async ({ expression }: { expression: string }) => {
        const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        return `${expression} = ${result}`;
      },
    });

    stopSpinner(toolSpinner, "[OK] Calculator tool ready");

    const agentSpinner = showSpinner("Creating specialized agents...");

    const mathAgent = new Agent({
      name: "Math Expert",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a math expert. Use the calculator tool for computations. Be concise. Use plain text only - no LaTeX, no markdown, no special formatting.",
      tools: {
        calculator: calculatorTool,
      },
      maxTurns: 5,
    });

    const writerAgent = new Agent({
      name: "Creative Writer",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a creative writer. Write short, engaging stories in plain text. No markdown, no special formatting, just clean readable text.",
      maxTurns: 5,
    });

    // Create orchestrator optimized for speed
    const orchestrator = Agent.create({
      name: "Task Orchestrator",
      model: openai("gpt-4o-mini"), // Fastest model
      instructions:
        "Route tasks quickly. Use handoff_to_agent immediately for math or writing tasks. Use plain text only - no formatting.",
      handoffs: [mathAgent, writerAgent],
      maxTurns: 1, // Just route, don't think too much
      temperature: 0.1, // Lower temperature = faster, more deterministic
    });

    stopSpinner(agentSpinner, "[OK] Streaming system ready");

    console.log("\nAGENT CONFIGURATION:");
    console.log(
      `  ${mathAgent.name} - Mathematical computations with calculator`,
    );
    console.log(`  ${writerAgent.name} - Creative content generation`);
    console.log(`  ${orchestrator.name} - Request routing and orchestration`);

    // Test streaming with handoffs
    const question =
      "Calculate 25 * 37 and then write a short story about the result";
    console.log(`\nINPUT: ${question}`);
    console.log("\nSTREAM: Real-time output below");
    console.log("-".repeat(70));

    // Use OpenAI SDK pattern: run with { stream: true }
    const streamResult = await run(orchestrator, question, {
      stream: true,
      maxTotalTurns: 20,
      onHandoff: (handoff) => {
        console.log(`\n[HANDOFF EVENT] ${handoff.targetAgent}`);
      },
    });

    // Process the stream
    let currentAgent = "";
    let processingSpinner: NodeJS.Timeout | null = null;
    let textBuffer = "";

    for await (const chunk of streamResult.stream) {
      switch (chunk.type) {
        case "orchestration-status":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }
          console.log(`[${chunk.status.toUpperCase()}] ${chunk.agent}`);
          break;

        case "agent-thinking":
          if (processingSpinner) clearInterval(processingSpinner);
          processingSpinner = showSpinner(`${chunk.agent} thinking...`);
          break;

        case "text-delta":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }

          if (chunk.agent !== currentAgent) {
            if (currentAgent && textBuffer) {
              console.log(`\n[DONE] ${currentAgent}\n`);
              textBuffer = "";
            }
            console.log(`[OUTPUT] ${chunk.agent}:`);
            console.log("-".repeat(40));
            currentAgent = chunk.agent;
          }

          // Collect all text first, then display at the end to test
          textBuffer += chunk.text;
          break;

        case "agent-switch":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }
          console.log(`\n[HANDOFF] ${chunk.fromAgent} -> ${chunk.toAgent}`);
          if (chunk.reason) console.log(`          Reason: ${chunk.reason}`);
          if (chunk.context) console.log(`          Context: ${chunk.context}`);
          break;

        case "tool-call":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }
          console.log(`\n[TOOL] ${chunk.toolName}`);
          console.log(`       Args: ${JSON.stringify(chunk.args)}`);
          break;

        case "tool-result": {
          const resultDisplay =
            typeof chunk.result === "object"
              ? JSON.stringify(chunk.result, null, 2)
              : chunk.result;
          console.log(`[RESULT] ${resultDisplay}`);
          break;
        }

        case "agent-complete":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }

          // Display the complete buffered text
          if (textBuffer) {
            console.log(textBuffer);
            textBuffer = "";
          }

          console.log(`\n[COMPLETE] ${chunk.agent}`);
          break;

        case "error":
          if (processingSpinner) {
            clearInterval(processingSpinner);
            process.stdout.write("\r");
            processingSpinner = null;
          }
          console.log(`\n[ERROR] ${chunk.error}`);
          break;

        case "workflow-progress":
          console.log(
            `\n[WORKFLOW] Step ${chunk.currentStep}/${chunk.totalSteps}`,
          );
          console.log(`           ${chunk.stepName}`);
          break;

        default:
          console.log(`\n[DEBUG] Unknown chunk: ${JSON.stringify(chunk)}`);
          break;
      }
    }

    if (processingSpinner) {
      clearInterval(processingSpinner);
      process.stdout.write("\r");
    }

    console.log(`\n${"=".repeat(70)}`);

    // Get final result
    const finalSpinner = showSpinner("Collecting final results...");
    const finalResult = await streamResult.result;
    stopSpinner(finalSpinner, "[OK] Results collected");

    console.log("\nFINAL RESULT SUMMARY:");
    printStats({
      "Final Agent": finalResult.finalAgent,
      Handoffs: finalResult.handoffs?.length || 0,
      Steps: finalResult.steps?.length || 0,
      Duration: `${finalResult.metadata?.duration || 0}ms`,
    });

    console.log(`\n${"=".repeat(70)}`);
    console.log("STREAMING TEST COMPLETED");
    console.log("=".repeat(70));
  } catch (error) {
    console.log(`\nFATAL ERROR: ${error}`);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testStreaming();
}
