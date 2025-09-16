import type { Metadata } from "next";
import DevtoolsContent from "@/components/docs/devtools-content";

export const metadata: Metadata = {
  title: "DevTools Documentation - AI SDK Tools",
  description:
    "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls, performance metrics, and streaming events with advanced filtering and search.",
  keywords: [
    "AI SDK devtools",
    "AI debugging tools",
    "AI monitoring",
    "AI tool calls debugging",
    "AI performance metrics",
    "AI streaming events",
    "AI development tools",
    "AI SDK debugging",
    "AI application monitoring",
    "AI tools debugging",
  ],
  openGraph: {
    title: "DevTools Documentation - AI SDK Tools",
    description:
      "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls and performance metrics.",
    url: "https://ai-sdk-tools.dev/docs/devtools",
  },
  twitter: {
    title: "DevTools Documentation - AI SDK Tools",
    description:
      "Powerful debugging and monitoring tool for AI applications. Real-time insights into tool calls and performance metrics.",
  },
  alternates: {
    canonical: "/docs/devtools",
  },
};

export default function DevtoolsPage() {
  return <DevtoolsContent />;
}
