import { artifact } from "ai-sdk-tools";
import { z } from "zod";

// Define the balance sheet artifact schema
export const BalanceSheetArtifact = artifact(
  "balance-sheet",
  z.object({
    title: z.string(),
    stage: z
      .enum(["loading", "processing", "analyzing", "complete"])
      .default("loading"),
    currency: z.string().default("USD"),
    progress: z.number().min(0).max(1).default(0),
    asOfDate: z.string(),

    // Balance sheet data
    assets: z.object({
      currentAssets: z.object({
        cash: z.number(),
        accountsReceivable: z.number(),
        inventory: z.number(),
        prepaidExpenses: z.number(),
        total: z.number(),
      }),
      nonCurrentAssets: z.object({
        propertyPlantEquipment: z.number(),
        intangibleAssets: z.number(),
        investments: z.number(),
        total: z.number(),
      }),
      totalAssets: z.number(),
    }),

    liabilities: z.object({
      currentLiabilities: z.object({
        accountsPayable: z.number(),
        shortTermDebt: z.number(),
        accruedExpenses: z.number(),
        total: z.number(),
      }),
      nonCurrentLiabilities: z.object({
        longTermDebt: z.number(),
        deferredRevenue: z.number(),
        otherLiabilities: z.number(),
        total: z.number(),
      }),
      totalLiabilities: z.number(),
    }),

    equity: z.object({
      commonStock: z.number(),
      retainedEarnings: z.number(),
      additionalPaidInCapital: z.number(),
      totalEquity: z.number(),
    }),

    // Key financial ratios
    ratios: z.object({
      currentRatio: z.number(),
      quickRatio: z.number(),
      debtToEquity: z.number(),
      workingCapital: z.number(),
    }),

    // Insights
    insights: z
      .object({
        liquidity: z.enum(["strong", "adequate", "concerning"]),
        leverage: z.enum(["conservative", "moderate", "high"]),
        highlights: z.array(z.string()),
        concerns: z.array(z.string()),
      })
      .optional(),
  }),
);
