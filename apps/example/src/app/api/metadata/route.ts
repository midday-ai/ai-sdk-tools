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
function getToolNames(agent: any): string[] {
  if (!agent.configuredTools) return [];
  return Object.keys(agent.configuredTools).filter(
    (name) => name !== "handoff_to_agent" && name !== "updateWorkingMemory",
  );
}

// Tool descriptions mapping
function getToolDescription(toolName: string, agentName: string): string {
  const toolDescriptions: Record<string, string> = {
    // Reports Agent Tools
    revenue: "Show revenue performance and trends",
    profitLoss: "Generate profit & loss statement with detailed breakdown",
    cashFlow: "Analyze cash flow patterns and projections",
    balanceSheet: "Create balance sheet with assets, liabilities, and equity",
    expenses: "Break down expenses by category and time period",
    burnRate: "Calculate monthly burn rate and runway analysis",
    runway: "Project cash runway based on current burn rate",
    spending: "Analyze spending patterns and top vendors",
    taxSummary: "Generate tax summary and compliance reports",
    
    // Analytics Agent Tools
    forecast: "Generate financial forecasts and projections",
    trends: "Identify trends and patterns in financial data",
    insights: "Extract actionable business insights from data",
    businessHealth: "Assess overall business health and performance",
    cashFlowForecast: "Project future cash flow scenarios",
    stressTest: "Run stress tests on financial scenarios",
    
    // Transactions Agent Tools
    transactions: "View and analyze transaction history",
    categorize: "Categorize and tag transactions",
    search: "Search through transaction records",
    listTransactions: "List and filter transaction records",
    getTransaction: "Get detailed information about a specific transaction",
    
    // Invoices Agent Tools
    invoices: "Manage and track invoice status",
    create: "Create new invoices",
    overdue: "Identify and track overdue invoices",
    listInvoices: "List and filter invoice records",
    getInvoice: "Get detailed information about a specific invoice",
    createInvoice: "Create a new invoice with line items",
    updateInvoice: "Update existing invoice details",
    
    // Time Tracking Agent Tools
    timer: "Start and manage time tracking",
    timesheet: "View and manage timesheets",
    projects: "Track time by project",
    startTimer: "Start a new time tracking session",
    stopTimer: "Stop the current time tracking session",
    getTimeEntries: "View time tracking entries and history",
    createTimeEntry: "Create a manual time entry",
    updateTimeEntry: "Update existing time entry details",
    deleteTimeEntry: "Delete a time entry",
    getProjects: "List available projects for time tracking",
    
    // Customers Agent Tools
    customers: "Manage customer information and relationships",
    profitability: "Analyze customer profitability",
    retention: "Track customer retention metrics",
    getCustomer: "Get detailed customer information",
    createCustomer: "Add a new customer to the system",
    updateCustomer: "Update customer information and details",
    profitabilityAnalysis: "Analyze profitability by customer",
    
    // Operations Agent Tools
    inbox: "Process and manage inbox items",
    documents: "Organize and search documents",
    balances: "Check account balances",
    export: "Export data in various formats",
    listInbox: "View and manage inbox items",
    getBalances: "Check current account balances",
    listDocuments: "Browse and search document library",
    exportData: "Export data in CSV, PDF, or other formats",
  };

  return toolDescriptions[toolName] || `${toolName} tool from ${agentName} agent`;
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

      // Add tools with better descriptions
      for (const toolName of toolNames) {
        const toolDescription = getToolDescription(toolName, agent.name);
        tools.push({
          name: toolName,
          description: toolDescription,
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
        "Cache-Control": "no-cache, no-store, must-revalidate", // Disable cache for development
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
