import type { Metadata } from "next";
import QuickstartContent from "@/components/docs/quickstart-content";

export const metadata: Metadata = {
  title: "Quickstart Guide - AI SDK Tools",
  description:
    "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation, setup, and your first AI application.",
  keywords: [
    "AI SDK quickstart",
    "AI tools setup",
    "React AI tutorial",
    "AI SDK installation",
    "AI application quickstart",
    "AI SDK getting started",
    "AI tools tutorial",
    "TypeScript AI setup",
  ],
  openGraph: {
    title: "Quickstart Guide - AI SDK Tools",
    description:
      "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation and setup.",
    url: "https://ai-sdk-tools.dev/docs/quickstart",
  },
  twitter: {
    title: "Quickstart Guide - AI SDK Tools",
    description:
      "Get up and running with AI SDK Tools in minutes. Complete quickstart guide with installation and setup.",
  },
  alternates: {
    canonical: "/docs/quickstart",
  },
};

export default function QuickstartPage() {
  return <QuickstartContent />;
}
