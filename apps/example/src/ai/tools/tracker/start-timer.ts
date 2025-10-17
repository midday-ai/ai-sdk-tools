import { tool } from "ai";
import { z } from "zod";
import { generateStartedTimer } from "@/ai/utils/fake-data";

/**
 * Start Timer Tool
 *
 * Start a new timer for time tracking.
 */
export const startTimerTool = tool({
  description: `Start a new timer for tracking time on a project`,

  inputSchema: z.object({
    projectId: z.string().describe("Project ID to track time for"),
    description: z
      .string()
      .optional()
      .describe("Optional description of the work"),
    startTime: z
      .string()
      .optional()
      .describe("Start time in ISO 8601 format (defaults to now)"),
  }),

  execute: async (params) => {
    return generateStartedTimer(params);
  },
});
