import { tool } from "ai";
import { z } from "zod";
import { generateDeletedTimeEntry } from "@/ai/utils/fake-data";

export const deleteTimeEntryTool = tool({
  description: `Delete a time tracking entry.`,

  inputSchema: z.object({
    entryId: z.string().describe("Time entry ID to delete"),
  }),

  execute: async (params) => generateDeletedTimeEntry(params),
});
