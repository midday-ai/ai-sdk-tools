import { tool } from "ai";
import { z } from "zod";
import { generateDocuments } from "../../utils/fake-data";

export const listDocumentsTool = tool({
  description: `List stored documents with filtering and search.
  
Search and filter documents by tags, date, or text query.`,

  inputSchema: z.object({
    q: z.string().optional().describe("Search query"),
    tags: z.array(z.string()).optional().describe("Filter by document tags"),
    pageSize: z.number().min(1).max(100).optional().default(20),
  }),

  execute: async (params) => generateDocuments(params),
});
