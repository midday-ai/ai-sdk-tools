import type { Metadata } from "next";
import AgentsContent from "@/components/agents-content";

export const metadata: Metadata = {
  title: "AI SDK Agents - Multi-Agent Orchestration for AI Applications",
  description:
    "Build intelligent workflows with specialized agents, automatic handoffs, and seamless coordination. Works with any AI provider for complex multi-step tasks.",
  keywords: [
    "AI agents",
    "multi-agent systems",
    "agent orchestration",
    "AI workflows",
    "agent handoffs",
    "AI routing",
    "specialized agents",
    "AI SDK agents",
    "intelligent agents",
    "AI coordination",
  ],
  openGraph: {
    title: "AI SDK Agents - Multi-Agent Orchestration for AI Applications",
    description:
      "Build intelligent workflows with specialized agents, automatic handoffs, and seamless coordination. Works with any AI provider.",
    url: "https://ai-sdk-tools.dev/agents",
  },
  twitter: {
    title: "AI SDK Agents - Multi-Agent Orchestration for AI Applications",
    description:
      "Build intelligent workflows with specialized agents, automatic handoffs, and seamless coordination. Works with any AI provider.",
  },
  alternates: {
    canonical: "/agents",
  },
};

export default function AgentsPage() {
  return <AgentsContent />;
}
