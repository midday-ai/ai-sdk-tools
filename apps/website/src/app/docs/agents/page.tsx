import type { Metadata } from "next";
import AgentsContent from "@/components/docs/agents-docs-content";

export const metadata: Metadata = {
  title: "Agents Documentation - AI SDK Tools",
  description:
    "Multi-agent orchestration for AI SDK v5. Build intelligent workflows with specialized agents, automatic handoffs, and seamless coordination. Works with any AI provider.",
  keywords: [
    "AI agents",
    "multi-agent systems",
    "agent orchestration",
    "AI workflows",
    "agent handoffs",
    "AI routing",
    "specialized agents",
    "AI SDK agents",
    "agent coordination",
    "intelligent agents",
  ],
  openGraph: {
    title: "Agents Documentation - AI SDK Tools",
    description:
      "Multi-agent orchestration for AI SDK v5. Build intelligent workflows with specialized agents and automatic handoffs.",
    url: "https://ai-sdk-tools.dev/docs/agents",
  },
  twitter: {
    title: "Agents Documentation - AI SDK Tools",
    description:
      "Multi-agent orchestration for AI SDK v5. Build intelligent workflows with specialized agents and automatic handoffs.",
  },
  alternates: {
    canonical: "/docs/agents",
  },
};

export default function AgentsPage() {
  return <AgentsContent />;
}
