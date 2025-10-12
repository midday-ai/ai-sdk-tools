import type { NextRequest } from "next/server";
import { sharedMemoryProvider } from "@/ai/agents/shared";

export async function GET(_request: NextRequest) {
  const userId = "user-123"; // TODO: Get from auth

  try {
    const chats = (await sharedMemoryProvider.getChats?.(userId)) || [];
    return Response.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return Response.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
