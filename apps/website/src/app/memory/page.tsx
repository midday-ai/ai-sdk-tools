import type { Metadata } from "next";
import MemoryContent from "@/components/memory-content";

export const metadata: Metadata = {
  title: "AI SDK Memory - Persistent Context for AI Agents",
  description:
    "Working memory and conversation history for AI agents. Simple provider interface with built-in support for InMemory, Drizzle ORM, and Upstash Redis. Context that persists between messages.",
  keywords: [
    "AI memory",
    "persistent context",
    "conversation history",
    "working memory",
    "AI agents memory",
    "chat history",
    "agent persistence",
    "AI SDK memory",
    "context management",
    "memory providers",
  ],
  openGraph: {
    title: "AI SDK Memory - Persistent Context for AI Agents",
    description:
      "Working memory and conversation history for AI agents. Simple provider interface with built-in support for multiple backends.",
    url: "https://ai-sdk-tools.dev/memory",
  },
  twitter: {
    title: "AI SDK Memory - Persistent Context for AI Agents",
    description:
      "Working memory and conversation history for AI agents. Simple provider interface with built-in support for multiple backends.",
  },
  alternates: {
    canonical: "/memory",
  },
};

export default function MemoryPage() {
  return <MemoryContent />;
}
