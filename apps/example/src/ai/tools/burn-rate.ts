import { tool } from "ai";
import { z } from "zod";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";
import { getCurrentUser } from "@/ai/context";
import { delay } from "@/lib/delay";

export const analyzeBurnRateTool = tool({
  description:
    "Analyze company burn rate with interactive chart data and insights. Use this when users ask about burn rate analysis, financial health, runway calculations, or expense tracking.",
  inputSchema: z.object({
    companyName: z.string().describe("Name of the company to analyze"),
    monthlyData: z
      .array(
        z.object({
          month: z.string().describe("Month in YYYY-MM format"),
          revenue: z.number().describe("Monthly revenue"),
          expenses: z.number().describe("Monthly expenses"),
          cashBalance: z.number().describe("Cash balance at end of month"),
        }),
      )
      .describe("Array of monthly financial data"),
  }),
  execute: async ({ companyName, monthlyData }) => {
    // Get current user context
    const user = getCurrentUser();

    // Step 1: Create with loading state (including user context)
    const analysis = BurnRateArtifact.stream({
      stage: "loading",
      title: `${companyName} Burn Rate Analysis`,
      chartData: [],
      progress: 0,
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

    if (avgBurnRate < 0) {
      recommendations.push("Great! You're generating positive cash flow");
    }

    await delay(400);

    // Step 4: Complete with summary (including user context)
    const finalData = {
      title: `${companyName} Burn Rate Analysis`,
      stage: "complete" as const,
      currency: "USD",
      chartData: analysis.data.chartData,
      progress: 1,
      summary: {
        currentBurnRate: avgBurnRate,
        averageRunway: avgRunway,
        trend,
        alerts,
        recommendations,
      },
    };

    await analysis.complete(finalData);

    // Return the artifact data in the format expected by the AI SDK
    return {
      parts: [
        {
          type: `data-artifact-${BurnRateArtifact.id}`,
          data: {
            id: analysis.id,
            version: 1,
            status: "complete" as const,
            progress: 1,
            payload: finalData,
            createdAt: Date.now(),
          },
        },
      ],
      text: `Completed burn rate analysis for ${companyName} (User: ${user.fullName} - ${user.id}). The analysis shows a ${trend} trend with an average runway of ${avgRunway.toFixed(1)} months. ${alerts.length} alerts and ${recommendations.length} recommendations have been generated.`,
    };
  },
});
