#!/usr/bin/env bun

/**
 * Agent with Tools Test Script
 *
 * Tests agents with custom tools
 * Run with: bun run scripts/test-tools.ts
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

export async function testAgentWithTools() {
  printHeader("AGENT WITH TOOLS TEST");
  console.log("\nTesting custom tools integration");

  try {
    // Create custom tools with loading
    const toolSpinner = showSpinner("Creating calculator and weather tools...");

    const calculatorTool = tool({
      description: "Perform mathematical calculations",
      inputSchema: z.object({
        expression: z
          .string()
          .describe(
            'Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)")',
          ),
      }),
      execute: async ({ expression }: { expression: string }) => {
        try {
          // Simple safe evaluation (in production, use a proper math parser)
          const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, "");
          const result = Function(`"use strict"; return (${sanitized})`)();
          return `${expression} = ${result}`;
        } catch (_error) {
          return `Error evaluating ${expression}: Invalid expression`;
        }
      },
    });

    const weatherTool = tool({
      description: "Get weather information for a location",
      inputSchema: z.object({
        location: z.string().describe("City name or location"),
      }),
      execute: async ({ location }: { location: string }) => {
        // Mock weather data
        const temperatures = [18, 22, 25, 28, 15, 12, 30];
        const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];

        const temp =
          temperatures[Math.floor(Math.random() * temperatures.length)];
        const condition =
          conditions[Math.floor(Math.random() * conditions.length)];

        return `Weather in ${location}: ${temp}°C, ${condition}`;
      },
    });

    stopSpinner(toolSpinner, "[OK] Tools created");

    // Create agent with tools
    const agentSpinner = showSpinner("Creating agent with tools...");

    const assistantAgent = new Agent({
      name: "Smart Assistant",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a helpful assistant with access to calculator and weather tools. Use them when appropriate.",
      tools: {
        calculator: calculatorTool,
        weather: weatherTool,
      },
      maxTurns: 8,
    });

    stopSpinner(agentSpinner, "[OK] Agent with tools ready");

    console.log("\nAGENT CONFIGURATION:");
    console.log(`  ${assistantAgent.name} - Calculator and weather tools`);

    // Test questions that should use tools
    const questions = [
      "Calculate 15 * 23 + 47",
      "What's the weather like in Paris?",
      "Calculate the area of a circle with radius 5 (use π ≈ 3.14159)",
      "What's 25% of 400 and what's the weather in Tokyo?",
    ];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      console.log(`\n${"=".repeat(50)}`);
      console.log(`TEST ${i + 1} OF ${questions.length}`);
      console.log("=".repeat(50));

      console.log(`\nINPUT: ${question}`);

      const processingSpinner = showSpinner("Processing with tools...");
      const result = await run(assistantAgent, question);
      stopSpinner(processingSpinner, "[OK] Processing complete");

      console.log("\nOUTPUT:");
      console.log("-".repeat(50));
      console.log(result.finalOutput);

      printStats({
        Agent: result.finalAgent,
        "Tool Calls": result.toolCalls?.length || 0,
        Duration: `${result.metadata?.duration || 0}ms`,
        Steps: result.steps?.length || 0,
      });

      // Show tool usage if any
      if (result.steps) {
        for (const step of result.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            console.log("\nTOOLS USED:");
            for (const toolCall of step.toolCalls) {
              console.log(
                `  ${toolCall.toolName}: ${JSON.stringify(toolCall.input)}`,
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`\nFATAL ERROR: ${error}`);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAgentWithTools();
}
