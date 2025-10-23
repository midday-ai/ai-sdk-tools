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
  const { message, id, agentChoice, toolChoice, timezone } =
    await request.json();

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
    baseCurrency: "SEK",
    locale: "sv-SE",
    timezone: timezone || "Europe/Stockholm",
    country: "SE",
    city: "Stockholm",
    region: "Stockholm",
    chatId: id,
  });

  // Pass user preferences to triage agent as context
  // The triage agent will use this information to make better routing decisions
  return triageAgent.toUIMessageStream({
    message,
    strategy: "auto",
    maxRounds: 5,
    maxSteps: 20,
    context: appContext,
    agentChoice,
    toolChoice,
    experimental_transform: smoothStream({
      chunking: "word",
    }),
    sendReasoning: true,
    sendSources: true,
  });
}
