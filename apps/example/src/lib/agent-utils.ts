import type { AgentStatus } from "@/types/agents";

// Generate user-friendly status messages
export const getStatusMessage = (status?: AgentStatus | null) => {
  if (!status) {
    return null;
  }

  const { agent, status: state } = status;

  console.log("status", status);
  console.log("agent", agent);
  console.log("state", state);

  if (state === "routing") {
    return "Thinking...";
  }

  if (state === "executing") {
    const messages: Record<AgentStatus["agent"], string> = {
      triage: "Thinking...",
      orchestrator: "Coordinating your request...",
      general: "Working on it...",
      reports: "Preparing your financial reports...",
      transactions: "Looking up transactions...",
      invoices: "Checking your invoices...",
      timeTracking: "Reviewing your time entries...",
      customers: "Finding customer details...",
      analytics: "Analyzing your data...",
      operations: "Processing your request...",
      research: "Searching for information...",
    };
  
    return messages[agent];
  }

  return null;
};

// Generate user-friendly tool messages
export const getToolMessage = (toolName: string | null) => {
  if (!toolName) return null;

  const toolMessages: Record<string, string> = {
    // Reports tools
    revenue: "Analyzing revenue data...",
    profitLoss: "Calculating profit & loss...",
    cashFlow: "Analyzing cash flow...",
    balanceSheet: "Generating balance sheet...",
    expenses: "Analyzing expenses...",
    burnRate: "Calculating burn rate...",
    runway: "Calculating runway...",
    spending: "Analyzing spending patterns...",
    taxSummary: "Generating tax summary...",

    // Analytics tools
    businessHealth: "Analyzing business health...",
    cashFlowForecast: "Forecasting cash flow...",
    stressTest: "Running stress test scenarios...",

    // Customer tools
    getCustomer: "Fetching customer data...",
    createCustomer: "Creating new customer...",
    updateCustomer: "Updating customer record...",
    profitabilityAnalysis: "Analyzing customer profitability...",

    // Invoice tools
    listInvoices: "Fetching invoices...",
    getInvoice: "Fetching invoice details...",
    createInvoice: "Creating invoice...",
    updateInvoice: "Updating invoice...",

    // Transaction tools
    listTransactions: "Fetching transactions...",
    getTransaction: "Fetching transaction details...",

    // Time tracking tools
    startTimer: "Starting timer...",
    stopTimer: "Stopping timer...",
    getTimeEntries: "Fetching time entries...",
    createTimeEntry: "Creating time entry...",
    updateTimeEntry: "Updating time entry...",
    deleteTimeEntry: "Deleting time entry...",
    getProjects: "Fetching projects...",

    // Operations tools
    listInbox: "Fetching inbox items...",
    getBalances: "Fetching account balances...",
    listDocuments: "Fetching documents...",
    exportData: "Exporting data...",

    // Research tools
    webSearch: "Searching the web...",

    // Memory tools
    updateWorkingMemory: "Updating working memory...",

    // Handoff tools
    handoff_to_agent: "Routing to specialist...",
  };

  return toolMessages[toolName];
};

