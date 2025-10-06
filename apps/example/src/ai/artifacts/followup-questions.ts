import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the follow-up questions artifact schema
export const followupQuestionsArtifact = artifact(
  "followup-questions",
  z.object({
    questions: z.array(z.string()).describe("Array of follow-up questions"),
    context: z.string().describe("Context for the questions (e.g., 'burn_rate_analysis')"),
    timestamp: z.string().optional().describe("When the questions were generated"),
  }),
);
