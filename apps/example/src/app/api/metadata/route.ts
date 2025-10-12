import { analyticsAgent } from "@/ai/agents/analytics";
import { customersAgent } from "@/ai/agents/customers";
import { generalAgent } from "@/ai/agents/general";
import { invoicesAgent } from "@/ai/agents/invoices";
import { operationsAgent } from "@/ai/agents/operations";
import { reportsAgent } from "@/ai/agents/reports";
import { timeTrackingAgent } from "@/ai/agents/time-tracking";
import { transactionsAgent } from "@/ai/agents/transactions";

// Agent metadata interface
interface AgentMetadata {
  name: string;
  description: string;
  tools: string[];
}

interface ToolMetadata {
  name: string;
  description: string;
  agent: string;
}

interface MetadataResponse {
  agents: AgentMetadata[];
  tools: ToolMetadata[];
}

// Helper to extract tool names from an agent
function getToolNames(agent: {
  configuredTools?: Record<string, unknown>;
}): string[] {
  if (!agent.configuredTools) return [];
  return Object.keys(agent.configuredTools).filter(
    (name) => name !== "handoff_to_agent" && name !== "updateWorkingMemory",
  );
}

// Agent configurations with descriptions
const agentRegistry = [
  {
    agent: reportsAgent,
    description:
      "Financial metrics and reports (revenue, P&L, burn rate, runway)",
  },
  {
    agent: analyticsAgent,
    description: "Advanced forecasting and business intelligence",
  },
  {
    agent: transactionsAgent,
    description: "Transaction history and details",
  },
  {
    agent: invoicesAgent,
    description: "Invoice management",
  },
  {
    agent: timeTrackingAgent,
    description: "Time tracking and timers",
  },
  {
    agent: customersAgent,
    description: "Customer management and profitability",
  },
  {
    agent: operationsAgent,
    description: "Inbox, documents, balances, data export",
  },
  {
    agent: generalAgent,
    description: "General conversation and assistance",
  },
];

export async function GET() {
  try {
    const agents: AgentMetadata[] = [];
    const tools: ToolMetadata[] = [];

    for (const { agent, description } of agentRegistry) {
      const toolNames = getToolNames(agent);

      agents.push({
        name: agent.name,
        description,
        tools: toolNames,
      });

      // Add tools with descriptions
      for (const toolName of toolNames) {
        tools.push({
          name: toolName,
          description: `${toolName} tool from ${agent.name} agent`,
          agent: agent.name,
        });
      }
    }

    const response: MetadataResponse = {
      agents,
      tools,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate metadata" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
