import { NextResponse } from "next/server";
import { memoryProvider } from "@/ai/agents/shared";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    if (!memoryProvider.getChats) {
      return NextResponse.json({ chats: [] });
    }

    const chats = await memoryProvider.getChats({
      userId,
      search,
      limit,
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  }
}
