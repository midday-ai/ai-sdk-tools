import type { AgentStatus } from "@/types/agents";

// Generate user-friendly status messages
export const getStatusMessage = (status?: AgentStatus | null) => {
  if (!status) {
    return null;
  }

  const { agent, status: state } = status;

  if (state === "routing") {
    return "Thinking...";
  }

  if (state === "executing") {
    const messages: Record<AgentStatus["agent"], string> = {
      orchestrator: "Coordinating response across systems...",
      general: "Processing your request...",
      reports: "Generating your financial reports...",
      transactions: "Retrieving your transaction data...",
      invoices: "Managing your invoice operations...",
      timeTracking: "Processing your time tracking data...",
      customers: "Accessing customer information...",
      analytics: "Performing financial analysis...",
      operations: "Executing your request...",
      research: "Gathering current market information...",
    };

    return messages[agent];
  }

  if (state === "completing") {
    return "Finalizing your response...";
  }

  return null;
};

// Generate user-friendly tool messages
export const getToolMessage = (toolName: string | null) => {
  if (!toolName) return null;

  const toolMessages: Record<string, string> = {
    // Reports tools
    revenue: "Looking at your revenue...",
    profitLoss: "Checking your profit & loss...",
    cashFlow: "Reviewing your cash flow...",
    balanceSheet: "Getting your balance sheet...",
    expenses: "Checking your expenses...",
    burnRate: "Calculating your monthly spending...",
    runway: "Checking how long your money will last...",
    spending: "Looking at your spending habits...",
    taxSummary: "Preparing your tax summary...",

    // Analytics tools
    businessHealth: "Checking how healthy your business is...",
    cashFlowForecast: "Predicting your future cash flow...",
    stressTest: "Testing different scenarios...",

    // Customer tools
    getCustomer: "Looking up customer info...",
    createCustomer: "Adding a new customer...",
    updateCustomer: "Updating customer info...",
    profitabilityAnalysis: "Checking which customers are most profitable...",

    // Invoice tools
    listInvoices: "Getting your invoices...",
    getInvoice: "Looking up invoice details...",
    createInvoice: "Creating a new invoice...",
    updateInvoice: "Updating invoice...",

    // Transaction tools
    listTransactions: "Getting your transactions...",
    getTransaction: "Looking up transaction details...",

    // Time tracking tools
    startTimer: "Starting your timer...",
    stopTimer: "Stopping your timer...",
    getTimeEntries: "Getting your time entries...",
    createTimeEntry: "Adding time entry...",
    updateTimeEntry: "Updating time entry...",
    deleteTimeEntry: "Removing time entry...",
    getProjects: "Getting your projects...",

    // Operations tools
    listInbox: "Checking your inbox...",
    getBalances: "Getting your account balances...",
    listDocuments: "Looking at your documents...",
    exportData: "Preparing your data export...",

    // Research tools
    webSearch: "Searching the web...",

    // Memory tools
    updateWorkingMemory: "Saving this to memory...",

    // Handoff tools
    handoff_to_agent: "Thinking...",
  };

  return toolMessages[toolName];
};

