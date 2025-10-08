#!/usr/bin/env bun

import { openai } from "@ai-sdk/openai";
import { Agent, run } from "../src/index.js";
import { printHeader, printStats, showSpinner, stopSpinner } from "./utils.js";

// Set up OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Please set OPENAI_API_KEY environment variable");
  console.log("   export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

export async function testHandoffs() {
  printHeader("MULTI-AGENT HANDOFFS TEST");
  console.log("\nTesting agent-to-agent transfers with routing");

  try {
    // Create specialized agents with loading
    const setupSpinner = showSpinner("Setting up specialized agents...");

    const mathAgent = new Agent({
      name: "Math Tutor",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a math expert. Solve problems step by step with clear explanations.",
      maxTurns: 5,
    });

    const historyAgent = new Agent({
      name: "History Tutor",
      model: openai("gpt-4o-mini"),
      instructions:
        "You are a history expert. Provide historical context and important dates.",
      maxTurns: 5,
    });

    // Create triage agent with handoffs (exactly like OpenAI Agents SDK)
    const triageAgent = Agent.create({
      name: "Triage Agent",
      model: openai("gpt-4o-mini"),
      instructions:
        "You determine which specialist to use based on the question. Use handoff_to_agent tool to transfer to the right expert.",
      handoffs: [mathAgent, historyAgent],
      maxTurns: 2,
    });

    stopSpinner(setupSpinner, "[OK] Multi-agent system ready");

    console.log("\nAGENT CONFIGURATION:");
    console.log(`  ${mathAgent.name} - Mathematical problem solving`);
    console.log(`  ${historyAgent.name} - Historical queries and context`);
    console.log(`  ${triageAgent.name} - Intelligent request routing`);

    // Test questions that should trigger handoffs
    const questions = [
      "What is the square root of 144?",
      "When did World War 2 end?",
      "Calculate 25% of 80 and tell me about the American Revolution",
    ];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      console.log(`\n${"=".repeat(50)}`);
      console.log(`TEST ${i + 1} OF ${questions.length}`);
      console.log("=".repeat(50));

      console.log(`\nINPUT: ${question}`);

      const processingSpinner = showSpinner(
        "Processing with handoff detection...",
      );

      let handoffOccurred = false;
      const result = await run(triageAgent, question, {
        maxTotalTurns: 20,
        onHandoff: (handoff) => {
          stopSpinner(processingSpinner, `[HANDOFF] -> ${handoff.targetAgent}`);
          if (handoff.reason)
            console.log(`          Reason: ${handoff.reason}`);
          if (handoff.context)
            console.log(`          Context: ${handoff.context}`);
          handoffOccurred = true;
        },
      });

      if (!handoffOccurred) {
        stopSpinner(
          processingSpinner,
          "[OK] Processing complete (no handoffs)",
        );
      }

      console.log("\nOUTPUT:");
      console.log("-".repeat(50));
      console.log(result.finalOutput);

      printStats({
        "Final Agent": result.finalAgent,
        Handoffs: result.handoffs?.length || 0,
        Duration: `${result.metadata?.duration || 0}ms`,
      });
    }
  } catch (error) {
    console.log(`\nFATAL ERROR: ${error}`);
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testHandoffs();
}
