import type { AgentStatus } from "@/types/agents";

// Generate user-friendly status messages
export const getStatusMessage = (status?: AgentStatus | null) => {
  if (!status) {
    return null;
  }

  const { agent, status: state } = status;

  if (state === "executing") {
    const messages: Record<
      Exclude<AgentStatus["agent"], "orchestrator" | "general">,
      string
    > = {
      reports: "Generating financial reports...",
      transactions: "Fetching transactions...",
      invoices: "Managing invoices...",
      timeTracking: "Processing time entries...",
      customers: "Accessing customer data...",
      analytics: "Running analytics...",
      operations: "Processing request...",
      research: "Searching the web...",
    };

    return messages[agent as keyof typeof messages];
  }

  if (state === "completing") {
    return "Completing task...";
  }

  return null;
};

// Generate user-friendly tool messages
export const getToolMessage = (toolName: string | null) => {
  if (!toolName) return null;

  const toolMessages: Record<string, string> = {
    // Reports tools
    revenue: "Calculating revenue metrics...",
    profitLoss: "Generating profit & loss statement...",
    cashFlow: "Analyzing cash flow...",
    balanceSheet: "Preparing balance sheet...",
    expenses: "Breaking down expenses...",
    burnRate: "Calculating burn rate...",
    runway: "Projecting runway...",
    spending: "Analyzing spending patterns...",
    taxSummary: "Generating tax summary...",

    // Analytics tools
    businessHealth: "Analyzing business health...",
    cashFlowForecast: "Forecasting cash flow...",
    stressTest: "Running stress test scenarios...",

    // Customer tools
    getCustomer: "Retrieving customer data...",
    createCustomer: "Creating customer record...",
    updateCustomer: "Updating customer information...",
    profitabilityAnalysis: "Analyzing customer profitability...",

    // Invoice tools
    listInvoices: "Fetching invoices...",
    getInvoice: "Retrieving invoice details...",
    createInvoice: "Creating invoice...",
    updateInvoice: "Updating invoice...",

    // Transaction tools
    listTransactions: "Fetching transactions...",
    getTransaction: "Retrieving transaction details...",

    // Time tracking tools
    startTimer: "Starting timer...",
    stopTimer: "Stopping timer...",
    getTimeEntries: "Fetching time entries...",
    createTimeEntry: "Creating time entry...",
    updateTimeEntry: "Updating time entry...",
    deleteTimeEntry: "Deleting time entry...",
    getProjects: "Fetching projects...",

    // Operations tools
    listInbox: "Checking inbox...",
    getBalances: "Retrieving balances...",
    listDocuments: "Fetching documents...",
    exportData: "Exporting data...",

    // Research tools
    web_search: "Searching the web...",
  };

  return toolMessages[toolName];
};
