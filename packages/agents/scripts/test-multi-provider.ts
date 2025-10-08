#!/usr/bin/env bun

/**
 * Multi-Provider Test Script
 *
 * Tests agents using different AI providers
 * Run with: bun run scripts/test-multi-provider.ts
 */

import { openai } from "@ai-sdk/openai";
import { Agent, run } from "../src/index.js";
import { printHeader, showSpinner, stopSpinner } from "./utils.js";

// Set up API keys
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: Please set OPENAI_API_KEY environment variable");
  console.log("       export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

export async function testMultiProvider() {
  printHeader("MULTI-PROVIDER DEMO TEST");
  console.log("\nThis shows the advantage over OpenAI Agents SDK:");
  console.log("Different AI providers for different tasks!");
  console.log("(Using GPT-4o for different strengths in this demo)");

  try {
    // Create agents with loading
    const setupSpinner = showSpinner("Setting up multi-provider agents...");

    const creativeAgent = new Agent({
      name: "Creative Writer",
      model: openai("gpt-4o"), // Good for creative tasks
      instructions:
        "You are a creative writer. Write engaging, imaginative content.",
      maxTurns: 5,
    });

    const analyticalAgent = new Agent({
      name: "Data Analyst",
      model: openai("gpt-4o-mini"), // Fast for analysis
      instructions:
        "You are a data analyst. Provide logical, structured analysis.",
      maxTurns: 5,
    });

    const coordinatorAgent = Agent.create({
      name: "Task Coordinator",
      model: openai("gpt-4o-mini"), // Efficient for routing
      instructions:
        "You coordinate tasks between creative and analytical specialists. Route requests appropriately.",
      handoffs: [creativeAgent, analyticalAgent],
      maxTurns: 2,
    });

    stopSpinner(setupSpinner, "[OK] Multi-provider system ready");

    console.log("\nAGENT CONFIGURATION (Multi-Provider):");
    console.log(`  ${creativeAgent.name}: GPT-4o (creative tasks)`);
    console.log(`  ${analyticalAgent.name}: GPT-4o-mini (analysis)`);
    console.log(`  ${coordinatorAgent.name}: GPT-4o-mini (routing)`);

    // Test different types of tasks
    const tasks = [
      {
        task: "Write a short story about a robot learning to paint",
        expectedAgent: "Creative Writer",
      },
      {
        task: "Analyze the pros and cons of remote work vs office work",
        expectedAgent: "Data Analyst",
      },
      {
        task: "Create a marketing campaign for a new coffee shop",
        expectedAgent: "Creative Writer",
      },
    ];

    for (let i = 0; i < tasks.length; i++) {
      const { task, expectedAgent } = tasks[i];
      console.log(`\n📝 Test ${i + 1}: ${task}`);
      console.log(`🎯 Expected to route to: ${expectedAgent}`);
      console.log("🤔 Processing...\n");

      const result = await run(coordinatorAgent, task, {
        maxTotalTurns: 15,
        onHandoff: (handoff) => {
          console.log(`  🔄 Routed to: ${handoff.targetAgent}`);
          const isCorrect = handoff.targetAgent === expectedAgent;
          console.log(
            `  ${isCorrect ? "✅" : "⚠️"} Routing ${isCorrect ? "correct" : "unexpected"}`,
          );
        },
      });

      console.log("✅ Result:");
      console.log(
        `📤 Output: ${result.finalOutput.substring(0, 200)}${result.finalOutput.length > 200 ? "..." : ""}`,
      );
      console.log(`🤖 Final Agent: ${result.finalAgent}`);
      console.log(`🔄 Handoffs: ${result.handoffs?.length || 0}`);
      console.log(`⏱️  Duration: ${result.metadata?.duration || 0}ms`);
      console.log("─".repeat(60));
    }

    console.log("\n🎉 Multi-provider test completed!");
    console.log(
      "🌟 This flexibility is the key advantage over OpenAI-only SDKs!",
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMultiProvider();
}
