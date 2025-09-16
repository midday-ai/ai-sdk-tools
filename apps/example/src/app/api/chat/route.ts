import { openai } from "@ai-sdk/openai";
import { artifacts } from "@ai-sdk-tools/artifacts";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { tools } from "@/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set up artifact context with the streaming response writer
      artifacts.setContext({ writer });

      const result = streamText({
        model: openai("gpt-4o"),
        system: `You are a helpful financial analysis assistant specializing in burn rate analysis. 

When users ask about burn rate analysis, financial health, runway calculations, or expense tracking, use the analyzeBurnRateTool to create interactive charts and insights.

Key capabilities:
- Analyze monthly financial data (revenue, expenses, cash balance)
- Calculate burn rate and runway metrics
- Generate trend analysis (improving, stable, declining)
- Provide alerts and recommendations
- Create interactive visualizations

Always use the tool when users provide financial data or ask for burn rate analysis.`,
        messages: convertToModelMessages(messages),
        tools,
        onFinish: async (result) => {
          // Handle any cleanup or additional processing if needed
          console.log("Burn rate analysis completed:", result);
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
