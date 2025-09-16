import type { Metadata } from "next";
import { StoreContent } from "@/components/store-content";

export const metadata: Metadata = {
  title: "AI SDK Store - State Management for AI Applications",
  description:
    "Powerful Zustand-based state management for AI applications. Eliminate prop drilling and manage chat state globally with full TypeScript support. Perfect for React and Next.js AI apps.",
  keywords: [
    "AI SDK store",
    "AI state management",
    "Zustand AI",
    "React AI state",
    "AI chat state",
    "TypeScript AI state",
    "AI application state",
    "AI SDK tools",
  ],
  openGraph: {
    title: "AI SDK Store - State Management for AI Applications",
    description:
      "Powerful Zustand-based state management for AI applications. Eliminate prop drilling and manage chat state globally with full TypeScript support.",
    url: "https://ai-sdk-tools.dev/store",
  },
  twitter: {
    title: "AI SDK Store - State Management for AI Applications",
    description:
      "Powerful Zustand-based state management for AI applications. Eliminate prop drilling and manage chat state globally with full TypeScript support.",
  },
  alternates: {
    canonical: "/store",
  },
};

export default function StorePage() {
  return <StoreContent />;
}
