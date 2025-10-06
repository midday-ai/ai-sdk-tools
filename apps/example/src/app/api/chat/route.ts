import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { setContext } from "@/ai/context";
import { tools } from "@/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set up typed context with user information and mock database
      setContext({
        writer,
        userId: "123",
        fullName: "John Doe",
        db: {}, // Mock database object
        user: {
          teamId: "team-123",
          baseCurrency: "USD",
          locale: "en-US",
          fullName: "John Doe",
        },
      });

      const result = streamText({
        model: openai("gpt-4o"),
        system: `You are a helpful financial analysis assistant specializing in burn rate analysis. 

Available tools:
- analyzeBurnRate: Simple burn rate analysis with charts (cached)
- complexAnalysis: Complex analysis with database queries, multiple streaming, and follow-ups (cached) - mirrors real-world tool
- complexAnalysisUncached: Same as complexAnalysis but without caching (for comparison)

When users ask about:
- Simple burn rate analysis → use analyzeBurnRate
- Complex analysis testing → use complexAnalysis or complexAnalysisUncached
- Cache testing → compare complexAnalysis vs complexAnalysisUncached

Key capabilities:
- Multiple streaming layers (initial message, analysis, follow-ups)
- Database context preservation
- Artifact updates (charts, metrics, toasts)
- Follow-up question generation
- Complete caching support

Use complexAnalysis to test the full streaming cache implementation.`,
        messages: convertToModelMessages(messages),
        tools,
        experimental_context: { writer }, 
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
