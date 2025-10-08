#!/usr/bin/env bun

import { openai } from "@ai-sdk/openai";
import { Agent, run } from "../src/index.js";
import { printHeader, printStats, showSpinner, stopSpinner } from "./utils.js";

// Set up OpenAI API key (you'll need to set this)
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Please set OPENAI_API_KEY environment variable");
  console.log("   export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

export async function testBasicAgent() {
  printHeader("BASIC AGENT TEST");
  console.log("\nTesting single agent functionality");

  try {
    // Create agent with loading
    const spinner = showSpinner("Creating math helper agent...");

    const agent = new Agent({
      name: "Math Helper",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a helpful math tutor. Explain your reasoning step by step.",
      maxTurns: 3,
    });

    stopSpinner(spinner, "[OK] Agent created");

    console.log(`\nAgent: ${agent.name}`);
    console.log(`Instructions: ${agent.instructions}`);

    // Test the agent
    const question = "What is 15% of 200?";
    console.log(`\nINPUT: ${question}`);

    const processingSpinner = showSpinner("Agent processing request...");
    const result = await run(agent, question);
    stopSpinner(processingSpinner, "[OK] Processing complete");

    console.log("\nOUTPUT:");
    console.log("-".repeat(50));
    console.log(result.finalOutput);

    printStats({
      "Final Agent": result.finalAgent,
      Handoffs: result.handoffs?.length || 0,
      Duration: `${result.metadata?.duration || 0}ms`,
      Steps: result.steps?.length || 0,
    });
  } catch (error) {
    console.log(`\nFATAL ERROR: ${error}`);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBasicAgent();
}
