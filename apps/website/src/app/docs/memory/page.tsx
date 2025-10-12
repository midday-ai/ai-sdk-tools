import type { Metadata } from "next";
import MemoryDocsContent from "@/components/docs/memory-docs-content";

export const metadata: Metadata = {
  title: "Memory Documentation - AI SDK Tools",
  description:
    "Complete documentation for @ai-sdk-tools/memory. Learn how to add persistent working memory and conversation history to your AI agents with InMemory, Drizzle, or Upstash providers.",
  keywords: [
    "memory documentation",
    "AI memory guide",
    "persistent context",
    "conversation history",
    "working memory API",
    "memory providers",
    "Drizzle memory",
    "Upstash memory",
    "AI agents memory",
  ],
  openGraph: {
    title: "Memory Documentation - AI SDK Tools",
    description:
      "Complete documentation for @ai-sdk-tools/memory. Persistent working memory and conversation history for AI agents.",
    url: "https://ai-sdk-tools.dev/docs/memory",
  },
  twitter: {
    title: "Memory Documentation - AI SDK Tools",
    description:
      "Complete documentation for @ai-sdk-tools/memory. Persistent working memory and conversation history for AI agents.",
  },
  alternates: {
    canonical: "/docs/memory",
  },
};

export default function MemoryDocsPage() {
  return <MemoryDocsContent />;
}
