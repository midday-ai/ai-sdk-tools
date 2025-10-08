import { tool } from "ai";
import { z } from "zod";

// Mock transaction data
const mockTransactions = [
  {
    id: "tx001",
    date: "2024-01-15",
    amount: 1250.0,
    category: "Software",
    vendor: "Adobe Inc",
    type: "expense",
  },
  {
    id: "tx002",
    date: "2024-01-16",
    amount: 3500.0,
    category: "Marketing",
    vendor: "Google Ads",
    type: "expense",
  },
  {
    id: "tx003",
    date: "2024-01-17",
    amount: 15000.0,
    category: "Revenue",
    vendor: "Client ABC",
    type: "income",
  },
  {
    id: "tx004",
    date: "2024-01-18",
    amount: 800.0,
    category: "Office",
    vendor: "WeWork",
    type: "expense",
  },
  {
    id: "tx005",
    date: "2024-01-19",
    amount: 2200.0,
    category: "Payroll",
    vendor: "ADP",
    type: "expense",
  },
  {
    id: "tx006",
    date: "2024-01-20",
    amount: 12000.0,
    category: "Revenue",
    vendor: "Client XYZ",
    type: "income",
  },
  {
    id: "tx007",
    date: "2024-01-21",
    amount: 450.0,
    category: "Travel",
    vendor: "Delta Airlines",
    type: "expense",
  },
  {
    id: "tx008",
    date: "2024-01-22",
    amount: 1800.0,
    category: "Equipment",
    vendor: "Apple Store",
    type: "expense",
  },
];

export const queryTransactionsTool = tool({
  description: "Query and analyze transaction data",
  inputSchema: z.object({
    filters: z.object({
      category: z.string().optional().describe("Filter by category"),
      type: z
        .enum(["income", "expense", "all"])
        .optional()
        .describe("Filter by transaction type"),
      dateFrom: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      dateTo: z.string().optional().describe("End date (YYYY-MM-DD)"),
      minAmount: z.number().optional().describe("Minimum amount"),
      maxAmount: z.number().optional().describe("Maximum amount"),
    }),
    analysis: z
      .enum(["summary", "totals", "trends", "categories"])
      .describe("Type of analysis to perform"),
  }),
  execute: async ({ filters, analysis }) => {
    let filteredTransactions = mockTransactions;

    // Apply filters
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter((t) =>
        t.category.toLowerCase().includes(filters.category?.toLowerCase()),
      );
    }
    if (filters.type && filters.type !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filters.type,
      );
    }
    if (filters.minAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount >= filters.minAmount!,
      );
    }
    if (filters.maxAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount <= filters.maxAmount!,
      );
    }

    // Perform analysis
    switch (analysis) {
      case "summary":
        return {
          totalTransactions: filteredTransactions.length,
          totalIncome: filteredTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0),
          totalExpenses: filteredTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0),
          transactions: filteredTransactions,
        };

      case "totals": {
        const income = filteredTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          totalIncome: income,
          totalExpenses: expenses,
          netIncome: income - expenses,
          count: filteredTransactions.length,
        };
      }

      case "categories": {
        const categoryTotals = filteredTransactions.reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          },
          {} as Record<string, number>,
        );
        return { categoryBreakdown: categoryTotals };
      }

      case "trends":
        return {
          message:
            "Trend analysis shows consistent revenue growth with controlled expense management",
          transactions: filteredTransactions.slice(0, 5), // Recent transactions
        };

      default:
        return { transactions: filteredTransactions };
    }
  },
});

export const generateChartTool = tool({
  description: "Generate chart data for visualizations",
  inputSchema: z.object({
    chartType: z
      .enum(["bar", "line", "pie", "area"])
      .describe("Type of chart to generate"),
    dataType: z
      .enum(["revenue", "expenses", "categories", "trends"])
      .describe("What data to chart"),
    period: z
      .enum(["daily", "weekly", "monthly"])
      .optional()
      .describe("Time period for the chart"),
  }),
  execute: async ({ chartType, dataType, period = "daily" }) => {
    // Generate mock chart data based on our transactions
    switch (dataType) {
      case "revenue":
        return {
          chartType,
          data: [
            { label: "Jan Week 1", value: 15000 },
            { label: "Jan Week 2", value: 12000 },
            { label: "Jan Week 3", value: 18000 },
            { label: "Jan Week 4", value: 22000 },
          ],
          title: "Revenue Trends",
        };

      case "expenses":
        return {
          chartType,
          data: [
            { label: "Software", value: 1250 },
            { label: "Marketing", value: 3500 },
            { label: "Office", value: 800 },
            { label: "Payroll", value: 2200 },
            { label: "Travel", value: 450 },
            { label: "Equipment", value: 1800 },
          ],
          title: "Expense Breakdown",
        };

      case "categories": {
        const categoryData = mockTransactions.reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          },
          {} as Record<string, number>,
        );

        return {
          chartType,
          data: Object.entries(categoryData).map(([label, value]) => ({
            label,
            value,
          })),
          title: "Spending by Category",
        };
      }

      default:
        return {
          chartType,
          data: [],
          title: "Chart Data",
        };
    }
  },
});
