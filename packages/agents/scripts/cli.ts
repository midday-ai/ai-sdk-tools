#!/usr/bin/env bun

/**
 * AI SDK Tools - Agents CLI Test Runner
 *
 * Unified CLI interface that imports and orchestrates all tests
 * Run with: bun run cli
 */

import packageJson from "../package.json" with { type: "json" };
import { testBasicAgent } from "./test-basic.js";
import { testHandoffs } from "./test-handoffs.js";
import { testMultiProvider } from "./test-multi-provider.js";
import { testOpenAIComparison } from "./test-openai-comparison.js";
import { testStreaming } from "./test-streaming.js";
import { testAgentWithTools } from "./test-tools.js";
import { getInput } from "./utils.js";

// Set up OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: Please set OPENAI_API_KEY environment variable");
  console.log("       export OPENAI_API_KEY=sk-...");
  process.exit(1);
}

function printLogo() {
  console.clear();
  const logo = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ██╗    ███████╗██████╗ ██╗  ██╗                   ║
║    ██╔══██╗██║    ██╔════╝██╔══██╗██║ ██╔╝                   ║
║    ███████║██║    ███████╗██║  ██║█████╔╝                    ║
║    ██╔══██║██║    ╚════██║██║  ██║██╔═██╗                    ║
║    ██║  ██║██║    ███████║██████╔╝██║  ██╗                   ║
║    ╚═╝  ╚═╝╚═╝    ╚══════╝╚═════╝ ╚═╝  ╚═╝                   ║
║                                                               ║
║      █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗     ║
║     ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝     ║
║     ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗     ║
║     ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║     ║
║     ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║     ║
║     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝     ║
║                                                               ║
║                    AI SDK AGENTS v${packageJson.version}                      ║
║                Multi-Agent Orchestration                     ║
║                                                               ║
║                   https://ai-sdk-tools.dev                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;
  console.log(logo);
}

function printMenu() {
  console.log(`
${"=".repeat(70)}
                            TEST MENU
${"=".repeat(70)}

[1] Basic Agent Test
    Single agent without handoffs

[2] Multi-Agent Handoffs  
    Agent-to-agent transfers with routing

[3] Agent with Tools
    Custom tools integration (calculator, weather)

[4] Streaming Demo
    Real-time streaming with structured data

[5] OpenAI SDK Comparison
    API compatibility demonstration

[6] Multi-Provider Demo
    Different AI providers for different tasks

[0] Exit

${"=".repeat(70)}
`);
}

async function main() {
  while (true) {
    printLogo();
    printMenu();

    const choice = await getInput("Select test (1-6, 0 to exit): ");

    if (choice === "0") {
      console.log("\nGoodbye!");
      break;
    }

    try {
      switch (choice) {
        case "1":
          await testBasicAgent();
          break;
        case "2":
          await testHandoffs();
          break;
        case "3":
          await testAgentWithTools();
          break;
        case "4":
          await testStreaming();
          break;
        case "5":
          await testOpenAIComparison();
          break;
        case "6":
          await testMultiProvider();
          break;
        default:
          console.log("\nInvalid choice. Please select 1-6 or 0 to exit.");
      }

      console.log(`\n${"=".repeat(70)}`);
      await getInput("Press Enter to continue...");
    } catch (error) {
      console.log(`\nFATAL ERROR: ${error}`);
      await getInput("Press Enter to continue...");
    }
  }

  process.exit(0);
}

main();
