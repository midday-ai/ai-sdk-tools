import type { Metadata } from "next";
import { DevtoolsContent } from "@/components/devtools-content";

export const metadata: Metadata = {
  title: "AI SDK Devtools - Debug and Monitor AI Applications",
  description:
    "Debug and monitor your AI applications with real-time insights into tool calls, state changes, and performance metrics. Essential development tools for AI SDK applications.",
  keywords: [
    "AI SDK devtools",
    "AI debugging tools",
    "AI development tools",
    "AI monitoring",
    "AI performance metrics",
    "AI tool calls debugging",
    "AI state debugging",
    "AI SDK tools",
  ],
  openGraph: {
    title: "AI SDK Devtools - Debug and Monitor AI Applications",
    description:
      "Debug and monitor your AI applications with real-time insights into tool calls, state changes, and performance metrics.",
    url: "https://ai-sdk-tools.dev/devtools",
  },
  twitter: {
    title: "AI SDK Devtools - Debug and Monitor AI Applications",
    description:
      "Debug and monitor your AI applications with real-time insights into tool calls, state changes, and performance metrics.",
  },
  alternates: {
    canonical: "/devtools",
  },
};

export default function DevtoolsPage() {
  return <DevtoolsContent />;
}
