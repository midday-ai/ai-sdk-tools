import { z } from "zod";
import { artifact } from "../index";

// Define the burn rate artifact
export const BurnRate = artifact(
  "burn-rate",
  z.object({
    title: z.string(),
    stage: z
      .enum(["loading", "processing", "analyzing", "complete"])
      .default("loading"),
    currency: z.string().default("USD"),

    // Chart data
    chartData: z
      .array(
        z.object({
          month: z.string(),
          revenue: z.number(),
          expenses: z.number(),
          burnRate: z.number(),
          runway: z.number(),
        }),
      )
      .default([]),

    // Summary insights
    summary: z
      .object({
        currentBurnRate: z.number(),
        averageRunway: z.number(),
        trend: z.enum(["improving", "stable", "declining"]),
        alerts: z.array(z.string()),
        recommendations: z.array(z.string()),
      })
      .optional(),
  }),
);

// Tool implementation (direct AI SDK format)
export const analyzeBurnRateTool = {
  description: "Analyze company burn rate with chart data and insights",
  inputSchema: z.object({
    companyName: z.string(),
    monthlyData: z.array(
      z.object({
        month: z.string(), // "2024-01"
        revenue: z.number(),
        expenses: z.number(),
        cashBalance: z.number(),
      }),
    ),
  }),
  execute: async ({
    companyName,
    monthlyData,
  }: {
    companyName: string;
    monthlyData: Array<{
      month: string;
      revenue: number;
      expenses: number;
      cashBalance: number;
    }>;
  }) => {
    // Helper function for delays
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Step 1: Create with loading state
    const analysis = BurnRate.stream({
      stage: "loading",
      title: `${companyName} Burn Rate Analysis`,
      chartData: [],
    });

    await delay(500);

    // Step 2: Processing - generate chart data
    analysis.progress = 0.1;
    await analysis.update({ stage: "processing" });

    for (const [index, month] of monthlyData.entries()) {
      const burnRate = month.expenses - month.revenue;
      const runway = burnRate > 0 ? month.cashBalance / burnRate : Infinity;

      await analysis.update({
        chartData: [
          ...analysis.data.chartData,
          {
            month: month.month,
            revenue: month.revenue,
            expenses: month.expenses,
            burnRate,
            runway: Math.min(runway, 24), // Cap at 24 months for display
          },
        ],
        progress: ((index + 1) / monthlyData.length) * 0.7, // 70% for data processing
      });

      await delay(200); // Simulate processing time
    }

    await delay(300);

    // Step 3: Analyzing - generate insights
    await analysis.update({ stage: "analyzing" });
    analysis.progress = 0.9;

    const avgBurnRate =
      analysis.data.chartData.reduce((sum, d) => sum + d.burnRate, 0) /
      analysis.data.chartData.length;
    const avgRunway =
      analysis.data.chartData.reduce((sum, d) => sum + d.runway, 0) /
      analysis.data.chartData.length;

    // Determine trend
    const firstHalf = analysis.data.chartData.slice(
      0,
      Math.floor(analysis.data.chartData.length / 2),
    );
    const secondHalf = analysis.data.chartData.slice(
      Math.floor(analysis.data.chartData.length / 2),
    );
    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.burnRate, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.burnRate, 0) / secondHalf.length;

    const trend =
      secondAvg < firstAvg
        ? ("improving" as const)
        : secondAvg > firstAvg
          ? ("declining" as const)
          : ("stable" as const);

    // Generate alerts and recommendations
    const alerts: string[] = [];
    const recommendations: string[] = [];

    if (avgRunway < 6) {
      alerts.push("Critical: Average runway below 6 months");
      recommendations.push("Consider immediate cost reduction or fundraising");
    } else if (avgRunway < 12) {
      alerts.push("Warning: Average runway below 12 months");
      recommendations.push("Plan fundraising or revenue optimization");
    }

    if (trend === "declining") {
      alerts.push("Burn rate trend is worsening");
      recommendations.push(
        "Review expense categories for optimization opportunities",
      );
    }

    await delay(400);

    // Step 4: Complete with summary
    await analysis.complete({
      title: `${companyName} Burn Rate Analysis`,
      stage: "complete",
      currency: "USD",
      chartData: analysis.data.chartData,
      summary: {
        currentBurnRate: avgBurnRate,
        averageRunway: avgRunway,
        trend,
        alerts,
        recommendations,
      },
    });

    return `Completed burn rate analysis for ${companyName}. Found ${alerts.length} alerts and ${recommendations.length} recommendations.`;
  },
};
