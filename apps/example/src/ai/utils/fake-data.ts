/**
 * Fake Data Generators for Financial Tools
 *
 * Generates realistic financial data for development and testing
 */

import { faker } from "@faker-js/faker";

/**
 * Hash function for consistent seeding
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Generate revenue metrics for a date range
 */
export function generateRevenueMetrics(params: {
  from: string;
  to: string;
  currency?: string;
}) {
  // Seed with date range for consistency
  faker.seed(hashString(`revenue-${params.from}-${params.to}`));
  
  const currency = params.currency || "USD";
  const totalRevenue = faker.number.float({
    min: 50000,
    max: 500000,
    fractionDigits: 2,
  });

  return {
    period: {
      from: params.from,
      to: params.to,
    },
    currency,
    total: totalRevenue,
    breakdown: {
      recurring: faker.number.float({
        min: totalRevenue * 0.6,
        max: totalRevenue * 0.8,
        fractionDigits: 2,
      }),
      oneTime: faker.number.float({
        min: totalRevenue * 0.2,
        max: totalRevenue * 0.4,
        fractionDigits: 2,
      }),
    },
    growth: {
      percentChange: faker.number.float({
        min: -15,
        max: 45,
        fractionDigits: 1,
      }),
      trend: faker.helpers.arrayElement(["increasing", "stable", "decreasing"]),
    },
  };
}

/**
 * Generate profit & loss metrics
 */
export function generateProfitLossMetrics(params: {
  from: string;
  to: string;
  currency?: string;
}) {
  // Seed with date range for consistency
  faker.seed(hashString(`profitloss-${params.from}-${params.to}`));
  
  const currency = params.currency || "USD";
  const revenue = faker.number.float({
    min: 100000,
    max: 500000,
    fractionDigits: 2,
  });
  const expenses = faker.number.float({
    min: revenue * 0.5,
    max: revenue * 0.9,
    fractionDigits: 2,
  });
  const profit = revenue - expenses;

  return {
    period: {
      from: params.from,
      to: params.to,
    },
    currency,
    revenue,
    expenses: {
      total: expenses,
      breakdown: {
        operating: faker.number.float({
          min: expenses * 0.4,
          max: expenses * 0.6,
          fractionDigits: 2,
        }),
        personnel: faker.number.float({
          min: expenses * 0.3,
          max: expenses * 0.5,
          fractionDigits: 2,
        }),
        other: faker.number.float({
          min: expenses * 0.1,
          max: expenses * 0.2,
          fractionDigits: 2,
        }),
      },
    },
    profit: {
      gross: profit,
      net: profit * 0.85,
      margin: ((profit / revenue) * 100).toFixed(1),
    },
  };
}

/**
 * Generate runway metrics
 */
export function generateRunwayMetrics(params: {
  from: string;
  to: string;
  currency?: string;
}) {
  // Seed with date range for consistency
  faker.seed(hashString(`runway-${params.from}-${params.to}`));
  
  const currency = params.currency || "USD";
  const cashBalance = faker.number.float({
    min: 200000,
    max: 1500000,
    fractionDigits: 2,
  });
  const monthlyBurn = faker.number.float({
    min: 30000,
    max: 120000,
    fractionDigits: 2,
  });
  const runwayMonths = Math.floor(cashBalance / monthlyBurn);

  return {
    period: {
      from: params.from,
      to: params.to,
    },
    currency,
    cashBalance,
    monthlyBurn,
    runway: {
      months: runwayMonths,
      estimatedEndDate: new Date(
        Date.now() + runwayMonths * 30 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      status:
        runwayMonths > 18
          ? "healthy"
          : runwayMonths > 12
            ? "moderate"
            : "critical",
    },
  };
}

/**
 * Generate burn rate metrics
 */
export function generateBurnRateMetrics(params: {
  from: string;
  to: string;
  currency?: string;
}) {
  // Seed with date range for consistency
  faker.seed(hashString(`burnrate-${params.from}-${params.to}`));
  
  const currency = params.currency || "USD";
  const monthlyBurn = faker.number.float({
    min: 30000,
    max: 150000,
    fractionDigits: 2,
  });

  return {
    period: {
      from: params.from,
      to: params.to,
    },
    currency,
    burnRate: {
      current: monthlyBurn,
      average: monthlyBurn * 0.95,
      trend: faker.helpers.arrayElement(["increasing", "stable", "decreasing"]),
    },
    breakdown: {
      gross: monthlyBurn,
      net: monthlyBurn * 0.85,
    },
    efficiency: {
      revenueMultiple: faker.number.float({
        min: 0.3,
        max: 2.5,
        fractionDigits: 2,
      }),
    },
  };
}

/**
 * Generate spending metrics
 */
export function generateSpendingMetrics(params: {
  from: string;
  to: string;
  currency?: string;
  breakdown?: "general" | "category" | "merchant" | "tag";
}) {
  // Seed with date range for consistency
  faker.seed(hashString(`spending-${params.from}-${params.to}`));
  
  const currency = params.currency || "USD";
  const totalSpending = faker.number.float({
    min: 50000,
    max: 300000,
    fractionDigits: 2,
  });

  const categoryBreakdown = [
    { name: "Office & Operations", amount: totalSpending * 0.25 },
    { name: "Personnel", amount: totalSpending * 0.35 },
    { name: "Marketing", amount: totalSpending * 0.15 },
    { name: "Technology", amount: totalSpending * 0.2 },
    { name: "Other", amount: totalSpending * 0.05 },
  ];

  return {
    period: {
      from: params.from,
      to: params.to,
    },
    currency,
    total: totalSpending,
    breakdown:
      params.breakdown === "category"
        ? categoryBreakdown.map((cat) => ({
            category: cat.name,
            amount: parseFloat(cat.amount.toFixed(2)),
            percentage: ((cat.amount / totalSpending) * 100).toFixed(1),
          }))
        : undefined,
    trends: {
      percentChange: faker.number.float({
        min: -10,
        max: 25,
        fractionDigits: 1,
      }),
      averageTransaction: faker.number.float({
        min: 500,
        max: 5000,
        fractionDigits: 2,
      }),
    },
  };
}

/**
 * Generate a list of transactions
 */
export function generateTransactions(params: {
  pageSize?: number;
  start?: string;
  end?: string;
  type?: "income" | "expense";
}) {
  const count = params.pageSize || 20;
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const amount = faker.number.float({
      min: 50,
      max: 5000,
      fractionDigits: 2,
    });
    const type =
      params.type || faker.helpers.arrayElement(["income", "expense"]);
    const isIncome = type === "income";

    transactions.push({
      id: faker.string.uuid(),
      date: faker.date
        .between({
          from: params.start || "2024-01-01",
          to: params.end || new Date().toISOString(),
        })
        .toISOString(),
      name: isIncome
        ? faker.helpers.arrayElement([
            "Client Payment",
            "Invoice Payment",
            "Revenue",
            "Sales",
          ])
        : faker.helpers.arrayElement([
            "Office Supplies",
            "Software Subscription",
            "Marketing Campaign",
            "Consulting Services",
            "Travel Expenses",
          ]),
      amount: isIncome ? amount : -amount,
      currency: "USD",
      status: faker.helpers.arrayElement(["completed", "pending", "posted"]),
      category: isIncome
        ? faker.helpers.arrayElement(["revenue", "sales"])
        : faker.helpers.arrayElement([
            "office",
            "software",
            "marketing",
            "travel",
          ]),
      bankAccount: faker.helpers.arrayElement([
        "Checking Account",
        "Business Account",
        "Savings Account",
      ]),
    });
  }

  return {
    data: transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    pagination: {
      total: count,
      pageSize: count,
      hasMore: faker.datatype.boolean(),
    },
  };
}

/**
 * Generate a single transaction
 */
export function generateTransaction(id: string) {
  const amount = faker.number.float({ min: 50, max: 5000, fractionDigits: 2 });
  const isIncome = faker.datatype.boolean();

  return {
    id,
    date: faker.date.recent({ days: 30 }).toISOString(),
    name: isIncome
      ? faker.helpers.arrayElement([
          "Client Payment - Acme Corp",
          "Invoice #1234 Payment",
          "Monthly Subscription Revenue",
        ])
      : faker.helpers.arrayElement([
          "Office Supplies - Staples",
          "AWS Cloud Services",
          "Google Ads Campaign",
          "Consulting - Jane Doe",
        ]),
    amount: isIncome ? amount : -amount,
    currency: "USD",
    status: "completed",
    category: isIncome ? "revenue" : "operating-expense",
    bankAccount: "Business Checking",
    description: faker.lorem.sentence(),
    attachments: faker.datatype.boolean()
      ? [
          {
            name: "receipt.pdf",
            size: faker.number.int({ min: 10000, max: 500000 }),
            type: "application/pdf",
          },
        ]
      : [],
    tags: faker.helpers.arrayElements(
      ["important", "recurring", "tax-deductible", "client-work"],
      { min: 0, max: 2 },
    ),
  };
}

/**
 * Generate a list of invoices
 */
export function generateInvoices(params: {
  pageSize?: number;
  start?: string;
  end?: string;
  statuses?: string[];
}) {
  const count = params.pageSize || 15;
  const invoices = [];

  for (let i = 0; i < count; i++) {
    const amount = faker.number.float({
      min: 1000,
      max: 25000,
      fractionDigits: 2,
    });
    const status =
      params.statuses && params.statuses.length > 0
        ? faker.helpers.arrayElement(params.statuses)
        : faker.helpers.arrayElement(["paid", "unpaid", "overdue", "draft"]);

    const issueDate = faker.date.recent({ days: 60 });
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    invoices.push({
      id: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
      invoiceNumber: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
      issueDate: issueDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      amount,
      currency: "USD",
      status,
      customer: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        email: faker.internet.email(),
      },
      items: faker.number.int({ min: 1, max: 5 }),
      paidAmount: status === "paid" ? amount : 0,
    });
  }

  return {
    data: invoices.sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    ),
    pagination: {
      total: count,
      pageSize: count,
      hasMore: faker.datatype.boolean(),
    },
  };
}

/**
 * Generate a single invoice
 */
export function generateInvoice(id: string) {
  const amount = faker.number.float({
    min: 2000,
    max: 50000,
    fractionDigits: 2,
  });
  const status = faker.helpers.arrayElement(["paid", "unpaid", "overdue"]);

  const issueDate = faker.date.recent({ days: 45 });
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const lineItems = Array.from(
    { length: faker.number.int({ min: 2, max: 5 }) },
    () => {
      const itemAmount = faker.number.float({
        min: 500,
        max: 10000,
        fractionDigits: 2,
      });
      return {
        description: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        unitPrice: itemAmount,
        total: itemAmount,
      };
    },
  );

  return {
    id,
    invoiceNumber: id,
    issueDate: issueDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    status,
    customer: {
      id: faker.string.uuid(),
      name: faker.company.name(),
      email: faker.internet.email(),
      address: {
        line1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: "United States",
      },
    },
    lineItems,
    subtotal: lineItems.reduce((sum, item) => sum + item.total, 0),
    tax: amount * 0.1,
    total: amount,
    paidAmount: status === "paid" ? amount : 0,
    currency: "USD",
    notes: faker.lorem.paragraph(),
    paymentTerms: "Net 30",
  };
}

/**
 * New fake data generators for additional tools
 */

// Reports
export function generateCashFlowMetrics(params: any) {
  // Seed with date range for consistency
  faker.seed(hashString(`cashflow-${params.from}-${params.to}`));
  
  const operating = faker.number.float({
    min: 50000,
    max: 200000,
    fractionDigits: 2,
  });
  const investing = faker.number.float({
    min: -50000,
    max: -10000,
    fractionDigits: 2,
  });
  const financing = faker.number.float({
    min: -20000,
    max: 30000,
    fractionDigits: 2,
  });

  return {
    period: { from: params.from, to: params.to },
    currency: params.currency || "USD",
    cashFlow: {
      operating,
      investing,
      financing,
      netCashFlow: operating + investing + financing,
    },
    categories: params.categories || ["operating", "investing", "financing"],
  };
}

export function generateBalanceSheet(params: any) {
  // Generate current assets breakdown
  const cash = faker.number.float({
    min: 50000,
    max: 150000,
    fractionDigits: 2,
  });
  const accountsReceivable = faker.number.float({
    min: 40000,
    max: 120000,
    fractionDigits: 2,
  });
  const inventory = faker.number.float({
    min: 30000,
    max: 100000,
    fractionDigits: 2,
  });
  const prepaidExpenses = faker.number.float({
    min: 5000,
    max: 20000,
    fractionDigits: 2,
  });
  const currentAssetsTotal =
    cash + accountsReceivable + inventory + prepaidExpenses;

  // Generate non-current assets breakdown
  const propertyPlantEquipment = faker.number.float({
    min: 150000,
    max: 400000,
    fractionDigits: 2,
  });
  const intangibleAssets = faker.number.float({
    min: 50000,
    max: 200000,
    fractionDigits: 2,
  });
  const investments = faker.number.float({
    min: 50000,
    max: 150000,
    fractionDigits: 2,
  });
  const nonCurrentAssetsTotal =
    propertyPlantEquipment + intangibleAssets + investments;

  const totalAssets = currentAssetsTotal + nonCurrentAssetsTotal;

  // Generate current liabilities breakdown
  const accountsPayable = faker.number.float({
    min: 20000,
    max: 80000,
    fractionDigits: 2,
  });
  const shortTermDebt = faker.number.float({
    min: 15000,
    max: 60000,
    fractionDigits: 2,
  });
  const accruedExpenses = faker.number.float({
    min: 10000,
    max: 40000,
    fractionDigits: 2,
  });
  const currentLiabilitiesTotal =
    accountsPayable + shortTermDebt + accruedExpenses;

  // Generate non-current liabilities breakdown
  const longTermDebt = faker.number.float({
    min: 50000,
    max: 150000,
    fractionDigits: 2,
  });
  const deferredRevenue = faker.number.float({
    min: 20000,
    max: 80000,
    fractionDigits: 2,
  });
  const otherLiabilities = faker.number.float({
    min: 10000,
    max: 50000,
    fractionDigits: 2,
  });
  const nonCurrentLiabilitiesTotal =
    longTermDebt + deferredRevenue + otherLiabilities;

  const totalLiabilities = currentLiabilitiesTotal + nonCurrentLiabilitiesTotal;

  // Generate equity breakdown
  const commonStock = faker.number.float({
    min: 100000,
    max: 300000,
    fractionDigits: 2,
  });
  const additionalPaidInCapital = faker.number.float({
    min: 50000,
    max: 150000,
    fractionDigits: 2,
  });
  const retainedEarnings =
    totalAssets - totalLiabilities - commonStock - additionalPaidInCapital;
  const totalEquity = commonStock + additionalPaidInCapital + retainedEarnings;

  return {
    asOf: params.to,
    currency: params.currency || "USD",
    assets: {
      currentAssets: {
        cash,
        accountsReceivable,
        inventory,
        prepaidExpenses,
        total: currentAssetsTotal,
      },
      nonCurrentAssets: {
        propertyPlantEquipment,
        intangibleAssets,
        investments,
        total: nonCurrentAssetsTotal,
      },
      totalAssets,
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable,
        shortTermDebt,
        accruedExpenses,
        total: currentLiabilitiesTotal,
      },
      nonCurrentLiabilities: {
        longTermDebt,
        deferredRevenue,
        otherLiabilities,
        total: nonCurrentLiabilitiesTotal,
      },
      totalLiabilities,
    },
    equity: {
      commonStock,
      retainedEarnings,
      additionalPaidInCapital,
      totalEquity,
    },
    ratios: {
      currentRatio: Number(
        (currentAssetsTotal / currentLiabilitiesTotal).toFixed(2),
      ),
      debtToEquity: Number((totalLiabilities / totalEquity).toFixed(2)),
    },
  };
}

export function generateExpensesMetrics(params: any) {
  // Seed with date range for consistency
  faker.seed(hashString(`expenses-${params.from}-${params.to}`));
  
  const total = faker.number.float({
    min: 50000,
    max: 200000,
    fractionDigits: 2,
  });
  const recurring = faker.number.float({
    min: total * 0.6,
    max: total * 0.8,
    fractionDigits: 2,
  });

  return {
    period: { from: params.from, to: params.to },
    currency: params.currency || "USD",
    total,
    recurring,
    oneTime: total - recurring,
    byCategory: {
      operating: faker.number.float({
        min: total * 0.3,
        max: total * 0.5,
        fractionDigits: 2,
      }),
      personnel: faker.number.float({
        min: total * 0.3,
        max: total * 0.4,
        fractionDigits: 2,
      }),
      marketing: faker.number.float({
        min: total * 0.1,
        max: total * 0.2,
        fractionDigits: 2,
      }),
    },
  };
}

export function generateTaxSummary(params: any) {
  const income = faker.number.float({
    min: 50000,
    max: 200000,
    fractionDigits: 2,
  });

  return {
    period: { from: params.from, to: params.to },
    currency: params.currency || "USD",
    taxType: params.taxType,
    estimatedLiability: income * 0.25,
    deductibleExpenses: faker.number.float({
      min: 20000,
      max: 80000,
      fractionDigits: 2,
    }),
    quarterlyEstimates: [
      { quarter: "Q1", amount: income * 0.0625 },
      { quarter: "Q2", amount: income * 0.0625 },
      { quarter: "Q3", amount: income * 0.0625 },
      { quarter: "Q4", amount: income * 0.0625 },
    ],
  };
}

// Invoices
export function generateCreatedInvoice(params: any) {
  return {
    id: faker.string.uuid(),
    invoiceNumber: faker.string.alphanumeric(8).toUpperCase(),
    status: params.status || "draft",
    customerId: params.customerId,
    total: params.total,
    currency: params.currency,
    createdAt: new Date().toISOString(),
    message: `Invoice ${params.sendImmediately ? "created and sent" : "created as draft"}`,
  };
}

export function generateUpdatedInvoice(params: any) {
  return {
    id: params.invoiceId,
    status: params.status,
    total: params.total,
    updatedAt: new Date().toISOString(),
    message: params.sendToCustomer
      ? "Invoice updated and sent to customer"
      : "Invoice updated",
  };
}

// Time Tracker
export function generateStartedTimer(params: any) {
  return {
    id: faker.string.uuid(),
    projectId: params.projectId,
    description: params.description,
    startTime: params.startTime || new Date().toISOString(),
    status: "running",
  };
}

export function generateStoppedTimer(params: any) {
  const start = new Date(Date.now() - 3600000);
  const stop = params.stopTime ? new Date(params.stopTime) : new Date();
  const duration = Math.floor((stop.getTime() - start.getTime()) / 1000);

  return {
    id: params.entryId || faker.string.uuid(),
    duration,
    stopTime: stop.toISOString(),
    status: "stopped",
  };
}

export function generateTimeEntries(params: any) {
  const entries = Array.from(
    { length: faker.number.int({ min: 5, max: 15 }) },
    () => {
      const duration = faker.number.int({ min: 1800, max: 28800 });
      return {
        id: faker.string.uuid(),
        projectId: params.projectId || faker.string.uuid(),
        description: faker.lorem.sentence(),
        duration,
        date: faker.date
          .between({ from: params.from, to: params.to })
          .toISOString()
          .split("T")[0],
      };
    },
  );

  return { data: entries, total: entries.length };
}

export function generateTrackerProjects(params: any) {
  const projects = Array.from(
    { length: faker.number.int({ min: 3, max: 8 }) },
    () => ({
      id: faker.string.uuid(),
      name: faker.company.buzzPhrase(),
      status: faker.helpers.arrayElement(["in_progress", "completed"]),
      totalHours: faker.number.float({ min: 10, max: 500, fractionDigits: 1 }),
    }),
  );

  return {
    data: projects.filter(
      (p) => params.status === "all" || p.status === params.status,
    ),
  };
}

export function generateCreatedTimeEntry(params: any) {
  const start = new Date(params.start);
  const stop = new Date(params.stop);
  const duration = Math.floor((stop.getTime() - start.getTime()) / 1000);

  return {
    id: faker.string.uuid(),
    projectId: params.projectId,
    duration,
    start: params.start,
    stop: params.stop,
    description: params.description,
  };
}

export function generateUpdatedTimeEntry(params: any) {
  return {
    id: params.entryId,
    ...params,
    updatedAt: new Date().toISOString(),
  };
}

export function generateDeletedTimeEntry(params: any) {
  return {
    id: params.entryId,
    deleted: true,
    message: "Time entry deleted successfully",
  };
}

// Customers
export function generateCustomer(params: any) {
  return {
    id: params.customerId,
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    tags: faker.helpers.arrayElements(["VIP", "Enterprise", "SMB", "New"], 2),
  };
}

export function generateCreatedCustomer(params: any) {
  return {
    id: faker.string.uuid(),
    ...params,
    createdAt: new Date().toISOString(),
  };
}

export function generateUpdatedCustomer(params: any) {
  return {
    id: params.customerId,
    ...params,
    updatedAt: new Date().toISOString(),
  };
}

export function generateCustomerProfitability(params: any) {
  const revenue = faker.number.float({
    min: 50000,
    max: 200000,
    fractionDigits: 2,
  });
  const costs = faker.number.float({
    min: revenue * 0.3,
    max: revenue * 0.6,
    fractionDigits: 2,
  });

  return {
    customerId: params.customerId,
    period: { from: params.from, to: params.to },
    revenue,
    costs,
    netProfit: revenue - costs,
    profitMargin: `${(((revenue - costs) / revenue) * 100).toFixed(1)}%`,
  };
}

// Analytics
export function generateBusinessHealthScore(params: any) {
  const cashFlowScore = faker.number.int({ min: 60, max: 95 });
  const revenueScore = faker.number.int({ min: 70, max: 95 });
  const expenseScore = faker.number.int({ min: 65, max: 90 });
  const growthScore = faker.number.int({ min: 50, max: 85 });

  const overallScore = Math.round(
    (cashFlowScore + revenueScore + expenseScore + growthScore) / 4,
  );

  return {
    overallScore,
    breakdown: {
      cashFlow: {
        score: cashFlowScore,
        status: cashFlowScore > 75 ? "healthy" : "needs attention",
      },
      revenue: {
        score: revenueScore,
        status: revenueScore > 75 ? "healthy" : "needs attention",
      },
      expenses: {
        score: expenseScore,
        status: expenseScore > 75 ? "healthy" : "needs attention",
      },
      growth: {
        score: growthScore,
        status: growthScore > 70 ? "positive" : "moderate",
      },
    },
    recommendations: params.includeRecommendations
      ? [
          "Increase cash reserves by 10%",
          "Optimize recurring expenses",
          "Diversify revenue streams",
        ]
      : [],
  };
}

export function generateCashFlowForecast(params: any) {
  const forecasts = Array.from({ length: params.forecastMonths }, (_, i) => {
    const base = faker.number.float({
      min: 50000,
      max: 150000,
      fractionDigits: 2,
    });
    return {
      month: i + 1,
      predicted: base,
      confidenceInterval: params.includeConfidenceIntervals
        ? {
            lower: base * 0.85,
            upper: base * 1.15,
          }
        : undefined,
    };
  });

  return { currency: params.currency || "USD", forecasts };
}

export function generateCashFlowStressTest(params: any) {
  return {
    scenarios: params.scenarios.map((scenario: string) => ({
      name: scenario.replace(/_/g, " "),
      impact: faker.number.float({
        min: -50000,
        max: -10000,
        fractionDigits: 2,
      }),
      survivalMonths: faker.number.int({ min: 3, max: 18 }),
      recommendation: "Increase cash reserves or reduce expenses",
    })),
  };
}

// Operations
export function generateInboxItems(params: any) {
  const items = Array.from({ length: params.pageSize || 20 }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(["receipt", "invoice", "document"]),
    status:
      params.status === "all"
        ? faker.helpers.arrayElement(["pending", "done"])
        : params.status,
    amount: faker.number.float({ min: 10, max: 5000, fractionDigits: 2 }),
    date: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
    description: faker.lorem.sentence(),
  }));

  return { data: items, total: items.length };
}

export function generateBalances(params: any) {
  const accounts = Array.from({ length: 3 }, () => ({
    id: faker.string.uuid(),
    name: faker.finance.accountName(),
    balance: faker.number.float({ min: 5000, max: 100000, fractionDigits: 2 }),
    currency: faker.helpers.arrayElement(["USD", "EUR", "GBP"]),
  }));

  return {
    accounts: params.accountId
      ? accounts.filter((a) => a.id === params.accountId)
      : accounts,
    totalInBaseCurrency: accounts.reduce((sum, a) => sum + a.balance, 0),
    baseCurrency: params.baseCurrency || "USD",
  };
}

export function generateDocuments(params: any) {
  const docs = Array.from({ length: params.pageSize || 20 }, () => ({
    id: faker.string.uuid(),
    name: faker.system.fileName(),
    type: faker.helpers.arrayElement(["pdf", "image", "spreadsheet"]),
    tags: faker.helpers.arrayElements(
      ["tax", "receipt", "contract", "invoice"],
      2,
    ),
    uploadedAt: faker.date.recent({ days: 60 }).toISOString(),
    size: faker.number.int({ min: 1000, max: 5000000 }),
  }));

  return { data: docs, total: docs.length };
}

export function generateDataExport(params: any) {
  return {
    exportId: faker.string.uuid(),
    dataType: params.dataType,
    format: params.format,
    period: { from: params.from, to: params.to },
    downloadUrl: `https://example.com/exports/${faker.string.uuid()}.${params.format}`,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    status: "ready",
  };
}
