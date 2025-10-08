#!/usr/bin/env bun

/**
 * OpenAI Agents SDK Comparison Test
 *
 * Tests the exact same example from OpenAI Agents SDK quickstart
 * to show API compatibility
 * Run with: bun run scripts/test-openai-comparison.ts
 */

import { openai } from "@ai-sdk/openai";
import { Agent, run } from "../src/index.js";
import { printHeader, printStats, showSpinner, stopSpinner } from "./utils.js";

// Set up OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: Please set OPENAI_API_KEY environment variable");
  console.log("       export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

export async function testOpenAIComparison() {
  printHeader("OPENAI AGENTS SDK COMPATIBILITY TEST");
  console.log("\nThis replicates the exact quickstart example from:");
  console.log("https://openai.github.io/openai-agents-js/guides/quickstart/");
  console.log("\nDemonstrating identical API but with AI SDK v5 foundation");

  try {
    // Create agents with loading
    const setupSpinner = showSpinner(
      "Creating OpenAI SDK compatible agents...",
    );

    const historyTutorAgent = new Agent({
      name: "History Tutor",
      model: openai("gpt-4o-mini"),
      instructions:
        "You provide assistance with historical queries. Explain important events and context clearly.",
    });

    const mathTutorAgent = new Agent({
      name: "Math Tutor",
      model: openai("gpt-4o-mini"),
      instructions:
        "You provide help with math problems. Explain your reasoning at each step and include examples.",
    });

    // Using Agent.create method (like OpenAI SDK)
    const triageAgent = Agent.create({
      name: "Triage Agent",
      model: openai("gpt-4o-mini"),
      instructions:
        "You determine which agent to use based on the user's homework question",
      handoffs: [historyTutorAgent, mathTutorAgent],
    });

    stopSpinner(setupSpinner, "[OK] OpenAI SDK compatible agents ready");

    console.log("\nAGENT CONFIGURATION (OpenAI SDK style):");
    console.log(`  ${historyTutorAgent.name} - Historical queries`);
    console.log(`  ${mathTutorAgent.name} - Mathematical problems`);
    console.log(`  ${triageAgent.name} - Request routing with handoffs`);

    // Test the exact example from OpenAI quickstart
    const question = "What is the capital of France?";
    console.log(`\nINPUT: ${question}`);

    const processingSpinner = showSpinner(
      "Processing OpenAI SDK compatible request...",
    );
    const result = await run(triageAgent, question);
    stopSpinner(processingSpinner, "[OK] Processing complete");

    console.log("\nOUTPUT (OpenAI SDK Compatible):");
    console.log("-".repeat(50));
    console.log(result.finalOutput); // Same as OpenAI's result.finalOutput

    printStats({
      "Final Agent": result.finalAgent,
      Handoffs: result.handoffs?.length || 0,
      Steps: result.steps?.length || 0,
      Duration: `${result.metadata?.duration || 0}ms`,
    });

    // Test a more complex question that should trigger handoffs
    console.log(`\n${"=".repeat(60)}`);
    console.log("COMPLEX HANDOFF SCENARIO TEST");
    console.log("=".repeat(60));

    const complexQuestion = "What is 25 * 16 and when did the Civil War end?";
    console.log(`\nINPUT: ${complexQuestion}`);

    const complexSpinner = showSpinner(
      "Processing complex multi-domain request...",
    );

    let handoffDetected = false;
    const result2 = await run(triageAgent, complexQuestion, {
      onHandoff: (handoff) => {
        stopSpinner(complexSpinner, `[HANDOFF] -> ${handoff.targetAgent}`);
        if (handoff.reason) console.log(`          Reason: ${handoff.reason}`);
        handoffDetected = true;
      },
    });

    if (!handoffDetected) {
      stopSpinner(complexSpinner, "[OK] Processing complete (no handoffs)");
    }

    console.log("\nOUTPUT (Multi-Domain):");
    console.log("-".repeat(50));
    console.log(result2.finalOutput);

    printStats({
      "Final Agent": result2.finalAgent,
      Handoffs: result2.handoffs?.length || 0,
      Steps: result2.steps?.length || 0,
      Duration: `${result2.metadata?.duration || 0}ms`,
    });

    console.log(`\n${"=".repeat(70)}`);
    console.log("OPENAI AGENTS SDK COMPATIBILITY TEST COMPLETED");
    console.log("Same API, but works with any AI provider!");
    console.log("=".repeat(70));
  } catch (error) {
    console.log(`\nFATAL ERROR: ${error}`);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testOpenAIComparison();
}
