import { artifact } from "ai-sdk-tools";
import { z } from "zod";

export const RevenueArtifact = artifact(
  "revenue",
  z.object({
    title: z.string(),
    asOfDate: z.string(),
    stage: z.enum(["generating", "complete"]),
    progress: z.number().min(0).max(1),
    data: z.object({
      totalRevenue: z.number(),
      growthRate: z.number(),
      averageDealSize: z.number(),
      monthlyRevenue: z.array(
        z.object({
          month: z.string(),
          revenue: z.number(),
          growth: z.number(),
        }),
      ),
      revenueByCategory: z.array(
        z.object({
          category: z.string(),
          revenue: z.number(),
          percentage: z.number(),
        }),
      ),
      quarterlyTrends: z.array(
        z.object({
          quarter: z.string(),
          revenue: z.number(),
          growth: z.number(),
        }),
      ),
      topCustomers: z.array(
        z.object({
          name: z.string(),
          revenue: z.number(),
          deals: z.number(),
        }),
      ),
    }),
  }),
);

export type RevenueArtifact = z.infer<typeof RevenueArtifact>;
