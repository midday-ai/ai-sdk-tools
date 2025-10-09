import { tool } from "ai";
import { z } from "zod";
import { generateTimeEntries } from "../../utils/fake-data";

export const getTimeEntriesTool = tool({
  description: `Get time tracking entries with filtering options.
  
Filter by date range, project, or user.`,

  inputSchema: z.object({
    from: z.string().describe("Start date in YYYY-MM-DD format"),
    to: z.string().describe("End date in YYYY-MM-DD format"),
    projectId: z.string().optional().describe("Filter by project ID"),
    assignedId: z.string().optional().describe("Filter by user ID"),
  }),

  execute: async (params) => generateTimeEntries(params),
});
