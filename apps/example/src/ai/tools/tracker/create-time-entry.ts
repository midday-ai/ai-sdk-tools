import { tool } from "ai";
import { z } from "zod";
import { generateCreatedTimeEntry } from "@/ai/utils/fake-data";

export const createTimeEntryTool = tool({
  description: `Create a manual time entry (not from timer)`,

  inputSchema: z.object({
    projectId: z.string().describe("Project ID"),
    start: z.string().describe("Start time in ISO 8601 format"),
    stop: z.string().describe("Stop time in ISO 8601 format"),
    description: z.string().optional().describe("Description of work"),
    assignedId: z
      .string()
      .optional()
      .describe("User ID (defaults to current user)"),
  }),

  execute: async (params) => generateCreatedTimeEntry(params),
});
