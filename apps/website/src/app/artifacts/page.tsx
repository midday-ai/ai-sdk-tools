import type { Metadata } from "next";
import { ArtifactsContent } from "@/components/artifacts-content";

export const metadata: Metadata = {
  title: "AI SDK Artifacts - Structured Streaming for AI Applications",
  description:
    "Create structured, type-safe artifacts that stream real-time updates from AI tools to React components with progress tracking and error handling. Perfect for complex AI workflows.",
  keywords: [
    "AI SDK artifacts",
    "AI streaming",
    "AI structured data",
    "AI real-time updates",
    "AI progress tracking",
    "AI error handling",
    "AI components streaming",
    "AI SDK tools",
  ],
  openGraph: {
    title: "AI SDK Artifacts - Structured Streaming for AI Applications",
    description:
      "Create structured, type-safe artifacts that stream real-time updates from AI tools to React components with progress tracking and error handling.",
    url: "https://ai-sdk-tools.dev/artifacts",
  },
  twitter: {
    title: "AI SDK Artifacts - Structured Streaming for AI Applications",
    description:
      "Create structured, type-safe artifacts that stream real-time updates from AI tools to React components with progress tracking and error handling.",
  },
  alternates: {
    canonical: "/artifacts",
  },
};

export default function ArtifactsPage() {
  return <ArtifactsContent />;
}
