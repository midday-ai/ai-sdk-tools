import type { Metadata } from "next";
import StoreContent from "@/components/docs/store-content";

export const metadata: Metadata = {
  title: "Store Documentation - AI SDK Tools",
  description:
    "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access, optimized performance, and full TypeScript support.",
  keywords: [
    "AI SDK store",
    "AI state management",
    "Zustand AI",
    "React AI state",
    "AI chat state",
    "TypeScript AI state",
    "AI application state",
    "AI SDK tools store",
    "global AI state",
    "AI state management library",
  ],
  openGraph: {
    title: "Store Documentation - AI SDK Tools",
    description:
      "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access and optimized performance.",
    url: "https://ai-sdk-tools.dev/docs/store",
  },
  twitter: {
    title: "Store Documentation - AI SDK Tools",
    description:
      "Global state management for AI applications. Drop-in replacement for @ai-sdk/react with global access and optimized performance.",
  },
  alternates: {
    canonical: "/docs/store",
  },
};

export default function StorePage() {
  return <StoreContent />;
}
