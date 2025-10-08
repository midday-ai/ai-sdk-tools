import { tool } from "ai";
import { z } from "zod";
import { generateUpdatedTimeEntry } from "../../utils/fake-data";

export const updateTimeEntryTool = tool({
  description: `Update an existing time entry.`,

  inputSchema: z.object({
    entryId: z.string().describe("Time entry ID to update"),
    start: z.string().optional().describe("Updated start time"),
    stop: z.string().optional().describe("Updated stop time"),
    description: z.string().optional().describe("Updated description"),
    projectId: z.string().optional().describe("Updated project ID"),
  }),

  execute: async (params) => generateUpdatedTimeEntry(params),
});
