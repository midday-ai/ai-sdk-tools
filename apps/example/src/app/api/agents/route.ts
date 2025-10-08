import { convertToModelMessages } from "ai";
import { orchestratorAgent } from "@/ai/agents";

export async function POST(request: Request) {
  const { messages } = await request.json();

  return orchestratorAgent.respond({
    messages: convertToModelMessages(messages),
  });
}
