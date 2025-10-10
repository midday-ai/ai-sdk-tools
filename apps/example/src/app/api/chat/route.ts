import type { CoreMessage } from "ai";
import { convertToModelMessages } from "ai";
import type { NextRequest } from "next/server";
import { triageAgent } from "@/ai/agents/triage";
import { checkRateLimit, getClientIP } from "@/lib/rate-limiter";
import type { AgentUIMessage } from "@/types/agents";

/**
 * Extract text from a UI message (handles various AI SDK message formats)
 */
function extractMessageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const msg = message as { content?: unknown; parts?: unknown[] };

  // String content
  if (typeof msg.content === "string") return msg.content;

  // Find text in parts array
  const findTextPart = (items?: unknown[]) =>
    items?.find(
      (item): item is { text: string } =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        item.type === "text",
    )?.text || "";

  return findTextPart(msg.parts) || findTextPart(msg.content as unknown[]);
}

/**
 * Convert UI messages to CoreMessage format
 */
function convertUIMessages(messages: AgentUIMessage[]): CoreMessage[] {
  return convertToModelMessages(messages.slice(-8)); // Keep last 8 messages for context
}

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

  const appContext = {
    userId: "user-123",
    fullName: "John Doe",
    db: null, // Mock database (would be real DB in production)
    user: {
      teamId: "team-456",
      baseCurrency: "USD",
      locale: "en-US",
      fullName: "John Doe",
    },
  };

  // Extract latest user message
  const latestMessage = messages[messages.length - 1];
  const userInput = extractMessageText(latestMessage);

  return triageAgent.toUIMessageStream({
    input: userInput,
    messages: convertUIMessages(messages),
    strategy: "auto", // Hybrid routing: programmatic + LLM fallback
    maxRounds: 5, // Max agent handoffs
    maxSteps: 10, // Max tool calls per agent
    timeout: 30000, // 30s global timeout
    context: appContext, // ← Single source of truth for all context
    onEvent: (event) => {
      // Log lifecycle events for debugging
      console.log(`[AGENT EVENT] ${event.type}:`, {
        agent: "agent" in event ? event.agent : undefined,
        details: "details" in event ? event.details : undefined,
      });
    },
  });
}
