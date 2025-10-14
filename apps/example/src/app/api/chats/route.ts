import type { NextRequest } from "next/server";
import { sharedMemoryProvider } from "@/ai/agents/shared";
import { getClientIP } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const userId = `user-${ip}`;

  try {
    const chats = (await sharedMemoryProvider.getChats?.(userId)) || [];
    return Response.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return Response.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
