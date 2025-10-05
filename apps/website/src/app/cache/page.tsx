import type { Metadata } from "next";
import { CacheContent } from "@/components/cache-content";

export const metadata: Metadata = {
  title: "AI SDK Cache - Universal Caching for AI Tools",
  description:
    "Cache expensive AI tool executions with zero configuration. Works with regular tools, streaming tools, and artifacts. Reduce costs by 80% and improve response times by 10x.",
  keywords: [
    "AI SDK cache",
    "AI tool caching",
    "AI performance",
    "AI cost optimization",
    "streaming tool cache",
    "artifact caching",
    "Redis cache",
    "LRU cache",
    "AI SDK tools",
  ],
  openGraph: {
    title: "AI SDK Cache - Universal Caching for AI Tools",
    description:
      "Cache expensive AI tool executions with zero configuration. Works with regular tools, streaming tools, and artifacts. Reduce costs by 80% and improve response times by 10x.",
    url: "https://ai-sdk-tools.dev/cache",
  },
  twitter: {
    title: "AI SDK Cache - Universal Caching for AI Tools",
    description:
      "Cache expensive AI tool executions with zero configuration. Works with regular tools, streaming tools, and artifacts. Reduce costs by 80% and improve response times by 10x.",
  },
  alternates: {
    canonical: "/cache",
  },
};

export default function CachePage() {
  return <CacheContent />;
}
