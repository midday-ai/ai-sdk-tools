import { getWriter } from "@ai-sdk-tools/artifacts";
import { tool } from "ai";
import { z } from "zod";
import { RevenueArtifact } from "@/ai/artifacts/revenue";
import { currencyFilterSchema, dateRangeSchema } from "@/ai/types/filters";
import { generateRevenueMetrics } from "@/ai/utils/fake-data";
import { delay } from "@/lib/delay";

/**
 * Revenue Dashboard Tool
 *
 * Generates a comprehensive revenue dashboard with charts and metrics.
 */
export const revenueDashboardTool = tool({
  description: `Generate a comprehensive revenue dashboard with charts and metrics.`,
  inputSchema: dateRangeSchema.merge(currencyFilterSchema).extend({
    useArtifact: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "When the user asks for visual report, use this flag to enable the visualization",
      ),
  }),

  execute: async function* (
    { from, to, currency, useArtifact },
    executionOptions,
  ) {
    try {
      if (!useArtifact) {
        const metrics = generateRevenueMetrics({ from, to, currency });
        yield {
          text: `Revenue data for ${from} to ${to}: Total revenue is ${currency || "USD"} ${metrics.total.toLocaleString()}. Growth rate: ${metrics.growth.percentChange.toFixed(1)}%.`,
        };
        return metrics;
      }

      const writer = getWriter(executionOptions);

      // Artifact mode - stream the revenue dashboard with visualization
      const analysis = RevenueArtifact.stream(
        {
          title: "Revenue Dashboard",
          asOfDate: to,
          stage: "generating",
          progress: 0,
          data: {
            totalRevenue: 0,
            growthRate: 0,
            averageDealSize: 0,
            monthlyRevenue: [],
            revenueByCategory: [],
            quarterlyTrends: [],
            topCustomers: [],
          },
        },
        writer,
      );

      yield { text: `Generating revenue dashboard for ${from} to ${to}...` };
      await delay(300);

      // Generate realistic fake data for development
      const metrics = generateRevenueMetrics({ from, to, currency });

      // Generate additional data for the dashboard
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyRevenue = months.map((month, _index) => ({
        month,
        revenue: Math.floor(metrics.total * (0.7 + Math.random() * 0.6)),
        growth: Math.floor((Math.random() - 0.5) * 20),
      }));

      const revenueByCategory = [
        {
          category: "SaaS Subscriptions",
          revenue: Math.floor(metrics.total * 0.4),
          percentage: 40,
        },
        {
          category: "Professional Services",
          revenue: Math.floor(metrics.total * 0.3),
          percentage: 30,
        },
        {
          category: "Consulting",
          revenue: Math.floor(metrics.total * 0.2),
          percentage: 20,
        },
        {
          category: "Other",
          revenue: Math.floor(metrics.total * 0.1),
          percentage: 10,
        },
      ];

      const quarterlyTrends = [
        {
          quarter: "Q1",
          revenue: Math.floor(metrics.total * 0.22),
          growth: 5.2,
        },
        {
          quarter: "Q2",
          revenue: Math.floor(metrics.total * 0.25),
          growth: 8.1,
        },
        {
          quarter: "Q3",
          revenue: Math.floor(metrics.total * 0.28),
          growth: 12.3,
        },
        {
          quarter: "Q4",
          revenue: Math.floor(metrics.total * 0.25),
          growth: 3.7,
        },
      ];

      const topCustomers = [
        {
          name: "Acme Corp",
          revenue: Math.floor(metrics.total * 0.15),
          deals: 3,
        },
        {
          name: "TechStart Inc",
          revenue: Math.floor(metrics.total * 0.12),
          deals: 2,
        },
        {
          name: "Global Solutions",
          revenue: Math.floor(metrics.total * 0.1),
          deals: 1,
        },
        {
          name: "Innovation Labs",
          revenue: Math.floor(metrics.total * 0.08),
          deals: 2,
        },
        {
          name: "Future Systems",
          revenue: Math.floor(metrics.total * 0.06),
          deals: 1,
        },
      ];

      // Step 1: Processing revenue data
      await analysis.update({ stage: "generating", progress: 0.2 });
      yield { text: "Calculating revenue metrics..." };
      await delay(400);

      await analysis.update({
        data: {
          totalRevenue: metrics.total,
          growthRate: metrics.growth.percentChange,
          averageDealSize: Math.floor(metrics.total / 15),
          monthlyRevenue: [],
          revenueByCategory: [],
          quarterlyTrends: [],
          topCustomers: [],
        },
        progress: 0.4,
      });

      // Step 2: Processing monthly trends
      yield { text: "Analyzing monthly trends..." };
      await delay(400);

      await analysis.update({
        data: {
          totalRevenue: metrics.total,
          growthRate: metrics.growth.percentChange,
          averageDealSize: Math.floor(metrics.total / 15),
          monthlyRevenue,
          revenueByCategory: [],
          quarterlyTrends: [],
          topCustomers: [],
        },
        progress: 0.6,
      });

      // Step 3: Processing categories
      yield { text: "Breaking down revenue by category..." };
      await delay(400);

      await analysis.update({
        data: {
          totalRevenue: metrics.total,
          growthRate: metrics.growth.percentChange,
          averageDealSize: Math.floor(metrics.total / 15),
          monthlyRevenue,
          revenueByCategory,
          quarterlyTrends: [],
          topCustomers: [],
        },
        progress: 0.8,
      });

      // Step 4: Finalizing
      await analysis.update({ stage: "complete" });
      yield { text: "Finalizing dashboard..." };
      await delay(300);

      // Complete the artifact with all data
      const finalData = {
        title: "Revenue Dashboard",
        asOfDate: to,
        stage: "complete" as const,
        progress: 1,
        data: {
          totalRevenue: metrics.total,
          growthRate: metrics.growth.percentChange,
          averageDealSize: Math.floor(metrics.total / 15),
          monthlyRevenue,
          revenueByCategory,
          quarterlyTrends,
          topCustomers,
        },
      };

      await analysis.complete(finalData);

      return finalData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
