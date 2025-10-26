import { tool } from "ai";
import { getWriter } from "@ai-sdk-tools/artifacts";
import { z } from "zod";
import { BalanceSheetArtifact } from "@/ai/artifacts/balance-sheet";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateBalanceSheet } from "@/ai/utils/fake-data";
import { delay } from "@/lib/delay";

/**
 * Balance Sheet Tool
 *
 * Provides balance sheet analysis with:
 * - Assets (current and non-current)
 * - Liabilities (current and non-current)
 * - Equity
 * - Financial ratios
 */
export const balanceSheetTool = tool({
  description: `Get balance sheet analysis for a specified date or period.`,
  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    categories: z
      .array(z.enum(["assets", "liabilities", "equity"]))
      .optional()
      .describe("Specific balance sheet categories to include"),
    useArtifact: z
      .boolean()
      .optional()
      .default(false)
      .describe("When the user asks for visual report, use this flag to enable the visualization"),
  }),

  execute: async function* (
    { from, to, currency, categories, useArtifact },
    executionOptions,
  ) {
    try {
      const writer = getWriter(executionOptions);

      if (!useArtifact) {
         const data = generateBalanceSheet({ from, to, currency, categories });
        yield { text: `Balance sheet data for ${from} to ${to}: Total assets: ${currency || "USD"} ${data.assets.totalAssets.toLocaleString()}. Current ratio: ${data.ratios.currentRatio.toFixed(2)}.` };
      
        return data;
      }

    // Artifact mode - stream the balance sheet with visualization
    const analysis = BalanceSheetArtifact.stream(
      {
        stage: "loading",
        title: `Balance Sheet as of ${to}`,
        asOfDate: to,
        currency: currency || "USD",
        progress: 0,
        assets: {
          currentAssets: {
            cash: 0,
            accountsReceivable: 0,
            inventory: 0,
            prepaidExpenses: 0,
            total: 0,
          },
          nonCurrentAssets: {
            propertyPlantEquipment: 0,
            intangibleAssets: 0,
            investments: 0,
            total: 0,
          },
          totalAssets: 0,
        },
        liabilities: {
          currentLiabilities: {
            accountsPayable: 0,
            shortTermDebt: 0,
            accruedExpenses: 0,
            total: 0,
          },
          nonCurrentLiabilities: {
            longTermDebt: 0,
            deferredRevenue: 0,
            otherLiabilities: 0,
            total: 0,
          },
          totalLiabilities: 0,
        },
        equity: {
          commonStock: 0,
          retainedEarnings: 0,
          additionalPaidInCapital: 0,
          totalEquity: 0,
        },
        ratios: {
          currentRatio: 0,
          quickRatio: 0,
          debtToEquity: 0,
          workingCapital: 0,
        },
      },
      writer,
    );

    yield { text: `Generating balance sheet for ${to}...` };
    await delay(300);

    // Generate mock data
    const data = generateBalanceSheet({ from, to, currency, categories });

    // Step 1: Processing assets
    await analysis.update({ stage: "processing", progress: 0.2 });
    yield { text: "Calculating assets..." };
    await delay(400);

    await analysis.update({
      assets: data.assets,
      progress: 0.4,
    });

    // Step 2: Processing liabilities
    yield { text: "Calculating liabilities..." };
    await delay(400);

    await analysis.update({
      liabilities: data.liabilities,
      progress: 0.6,
    });

    // Step 3: Processing equity
    yield { text: "Calculating equity..." };
    await delay(400);

    await analysis.update({
      equity: data.equity,
      progress: 0.8,
    });

    // Step 4: Analyzing
    await analysis.update({ stage: "analyzing" });
    yield { text: "Analyzing financial position..." };
    await delay(500);

    // Calculate insights
    const currentRatio =
      data.assets.currentAssets.total /
      data.liabilities.currentLiabilities.total;
    const quickRatio =
      (data.assets.currentAssets.cash +
        data.assets.currentAssets.accountsReceivable) /
      data.liabilities.currentLiabilities.total;
    const debtToEquity =
      data.liabilities.totalLiabilities / data.equity.totalEquity;
    const workingCapital =
      data.assets.currentAssets.total -
      data.liabilities.currentLiabilities.total;

    const liquidity =
      currentRatio >= 2
        ? ("strong" as const)
        : currentRatio >= 1
          ? ("adequate" as const)
          : ("concerning" as const);

    const leverage =
      debtToEquity < 0.5
        ? ("conservative" as const)
        : debtToEquity < 1.5
          ? ("moderate" as const)
          : ("high" as const);

    const highlights: string[] = [];
    const concerns: string[] = [];

    if (currentRatio >= 2) {
      highlights.push("Strong liquidity position with current ratio above 2.0");
    }
    if (debtToEquity < 0.5) {
      highlights.push("Conservative leverage with low debt-to-equity ratio");
    }
    if (workingCapital > 0) {
      highlights.push(
        `Positive working capital of ${currency || "USD"} ${Math.abs(workingCapital).toLocaleString()}`,
      );
    }

    if (currentRatio < 1) {
      concerns.push("Current ratio below 1.0 indicates liquidity concerns");
    }
    if (debtToEquity > 2) {
      concerns.push("High leverage with debt-to-equity ratio above 2.0");
    }

    // Complete the artifact with all required fields
    const finalData = {
      title: `Balance Sheet as of ${to}`,
      stage: "complete" as const,
      currency: currency || "USD",
      asOfDate: to,
      progress: 1,
      assets: data.assets,
      liabilities: data.liabilities,
      equity: data.equity,
      ratios: {
        currentRatio,
        quickRatio,
        debtToEquity,
        workingCapital,
      },
      insights: {
        liquidity,
        leverage,
        highlights,
        concerns,
      },
    };

    await analysis.complete(finalData);

    yield {
      text: `Balance sheet analysis complete. Total assets: ${currency || "USD"} ${data.assets.totalAssets.toLocaleString()}. Current ratio: ${currentRatio.toFixed(2)}. Liquidity: ${liquidity}.`,
      forceStop: true,
    };

    return { 
      ...finalData,
      forceStop: true,
    };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
