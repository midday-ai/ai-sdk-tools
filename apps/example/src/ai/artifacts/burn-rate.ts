import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the burn rate artifact schema
export const BurnRateArtifact = artifact(
  "burn-rate",
  z.object({
    title: z.string(),
    stage: z
      .enum(["loading", "processing", "analyzing", "complete"])
      .default("loading"),
    currency: z.string().default("USD"),
    progress: z.number().min(0).max(1).default(0),

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
