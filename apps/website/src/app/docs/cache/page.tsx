import type { Metadata } from "next";
import CacheContent from "@/components/docs/cache-content";

export const metadata: Metadata = {
  title: "Cache Documentation - AI SDK Tools",
  description:
    "Complete documentation for @ai-sdk-tools/cache. Learn how to cache AI tool executions with zero configuration, including streaming tools and artifacts.",
  keywords: [
    "AI SDK cache docs",
    "AI tool caching guide",
    "streaming tool cache",
    "artifact caching",
    "Redis cache setup",
    "LRU cache configuration",
  ],
  openGraph: {
    title: "Cache Documentation - AI SDK Tools",
    description:
      "Complete documentation for @ai-sdk-tools/cache. Learn how to cache AI tool executions with zero configuration.",
    url: "https://ai-sdk-tools.dev/docs/cache",
  },
  twitter: {
    title: "Cache Documentation - AI SDK Tools",
    description:
      "Complete documentation for @ai-sdk-tools/cache. Learn how to cache AI tool executions with zero configuration.",
  },
  alternates: {
    canonical: "/docs/cache",
  },
};

export default function CacheDocsPage() {
  return <CacheContent />;
}