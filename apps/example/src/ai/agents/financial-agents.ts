import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import { tool } from "ai";
import { z } from "zod";

const calculatorTool = tool({
  description: "Perform mathematical calculations",
  inputSchema: z.object({
    expression: z.string().describe("Mathematical expression to evaluate"),
  }),
  execute: async ({ expression }: { expression: string }) => {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, "");
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `${expression} = ${result}`;
    } catch (_error) {
      return `Error: Invalid expression ${expression}`;
    }
  },
});

const writerAgent = new Agent({
  name: "Creative Writer",
  model: openai("gpt-4o-mini"),
  instructions:
    "You are a creative writer. Write short, engaging stories in plain text. No markdown, no special formatting, just clean readable text.",
  maxTurns: 5,
});

const mathAgent = new Agent({
  name: "Math Expert",
  model: openai("gpt-4o-mini"),
  instructions: "You are a math expert. Never calculate manually. Be concise.",
  tools: {
    calculator: calculatorTool,
  },
  handoffs: [writerAgent],
  maxTurns: 5,
});

export const orchestratorAgent = Agent.create({
  name: "Task Orchestrator",
  model: openai("gpt-4o-mini"),
  instructions:
    "You are a task router. For math problems, hand off to Math Expert. For creative writing, hand off to Creative Writer. Make one handoff per request.",
  handoffs: [mathAgent, writerAgent],
  maxTurns: 2,
  temperature: 0.1,
});
