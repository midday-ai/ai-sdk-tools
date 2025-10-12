import { smoothStream } from "ai";
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

  // Get only the last message from client
  const { message, id, agentChoice, toolChoice } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = `user-${ip}`;

  const appContext = buildAppContext({
    userId,
    fullName: "John Doe",
    companyName: "Acme Inc.",
    baseCurrency: "USD",
    locale: "en-US",
    timezone: "America/New_York",
    chatId: id,
  });

  return triageAgent.toUIMessageStream({
    message,
    strategy: "auto",
    maxRounds: 5,
    maxSteps: 10,
    context: appContext,
    agentChoice,
    toolChoice,
    experimental_transform: smoothStream({ chunking: "word" }),
    sendReasoning: true,
    sendSources: true,
  });
}
