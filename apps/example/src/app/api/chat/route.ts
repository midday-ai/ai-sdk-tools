import type { AgentEvent } from "@ai-sdk-tools/agents";
import { convertToModelMessages, smoothStream } from "ai";
import type { NextRequest } from "next/server";
import { buildAppContext } from "@/ai/agents/shared";
import { triageAgent } from "@/ai/agents/triage";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success, remaining } = await checkRateLimit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
        remaining,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Parse request body
  const { messages } = await request.json();

  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appContext = buildAppContext({
    userId: "user-123",
    fullName: "John Doe",
    email: "john@acme.com",
    teamId: "team-456",
    companyName: "Acme Inc.",
    baseCurrency: "USD",
    locale: "en-US",
    timezone: "America/New_York",
  });

  return triageAgent.toUIMessageStream({
    messages: convertToModelMessages(messages),
    strategy: "auto", // Hybrid routing: programmatic + LLM fallback
    maxRounds: 5, // Max agent handoffs
    maxSteps: 10, // Max tool calls per agent
    context: appContext,
    experimental_transform: smoothStream({ chunking: "word" }),
    sendReasoning: true,
    onFinish: (options) => {
      console.log("onFinish", options);
    },
    onEvent: (event: AgentEvent) => {
      // Log lifecycle events for debugging
      console.log(`[AGENT EVENT] ${event.type}:`, {
        agent: "agent" in event ? event.agent : undefined,
        requestId: appContext.requestId,
      });
    },
  });
}
