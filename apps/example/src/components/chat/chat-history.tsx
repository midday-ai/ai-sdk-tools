"use client";

import { generateId } from "ai";
import { MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatInterface } from "@/hooks/use-chat-interface";
import { cn } from "@/lib/utils";

interface ChatSession {
  chatId: string;
  userId?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export function ChatHistory() {
  const { chatId: currentChatId, setChatId } = useChatInterface();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchChats = useCallback(async (searchTerm?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      params.set("limit", "20");

      const response = await fetch(`/api/chats?${params.toString()}`);
      const data = await response.json();
      // Convert ISO strings back to Date objects
      const chatsWithDates = (data.chats || []).map(
        (chat: {
          chatId: string;
          userId?: string;
          title?: string;
          createdAt: string;
          updatedAt: string;
          messageCount: number;
        }) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        }),
      );
      setChats(chatsWithDates);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Skip initial render (handled by initial fetch effect)
    if (search === "") {
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      fetchChats(search);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, fetchChats]);

  // Initial fetch on mount
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      {/* Search */}
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {search ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          <div className="p-2">
            {chats.map((chat) => (
              <Link
                key={chat.chatId}
                href={`/${chat.chatId}`}
                className={cn(
                  "group flex items-start gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent",
                  currentChatId === chat.chatId && "bg-accent",
                )}
              >
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {chat.title || "New Chat"}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(chat.updatedAt)}</span>
                    {chat.messageCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{chat.messageCount} messages</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* New Chat Button at Bottom */}
      <div className="border-t border-border p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newChatId = generateId();
            setChatId(newChatId);
            window.history.pushState({}, "", "/");
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
