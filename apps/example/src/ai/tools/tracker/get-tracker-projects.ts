import { tool } from "ai";
import { z } from "zod";
import { generateTrackerProjects } from "@/ai/utils/fake-data";

export const getTrackerProjectsTool = tool({
  description: `Get list of time tracking projects`,

  inputSchema: z.object({
    status: z
      .enum(["in_progress", "completed", "all"])
      .optional()
      .default("all")
      .describe("Filter by project status"),
  }),

  execute: async (params) => generateTrackerProjects(params),
});
