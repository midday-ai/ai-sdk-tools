import type { Metadata } from "next";
import ArtifactsContent from "@/components/docs/artifacts-content";

export const metadata: Metadata = {
  title: "Artifacts Documentation - AI SDK Tools",
  description:
    "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts that stream real-time updates from AI tools to React components with progress tracking and error handling.",
  keywords: [
    "AI SDK artifacts",
    "AI streaming interfaces",
    "AI tool streaming",
    "AI progress tracking",
    "AI error handling",
    "AI structured data",
    "AI type-safe streaming",
    "AI real-time updates",
    "AI streaming components",
    "AI tools streaming",
  ],
  openGraph: {
    title: "Artifacts Documentation - AI SDK Tools",
    description:
      "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts with real-time updates and progress tracking.",
    url: "https://ai-sdk-tools.dev/docs/artifacts",
  },
  twitter: {
    title: "Artifacts Documentation - AI SDK Tools",
    description:
      "Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts with real-time updates and progress tracking.",
  },
  alternates: {
    canonical: "/docs/artifacts",
  },
};

export default function ArtifactsPage() {
  return <ArtifactsContent />;
}
