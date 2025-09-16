import type { Metadata } from "next";
import DocsContent from "@/components/docs/docs-content";

export const metadata: Metadata = {
  title: "Documentation - AI SDK Tools",
  description:
    "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools for state management, debugging, and streaming interfaces.",
  keywords: [
    "AI SDK documentation",
    "AI tools documentation",
    "React AI state management",
    "AI debugging tools",
    "AI streaming interfaces",
    "AI SDK tools guide",
    "AI application development",
    "TypeScript AI tools",
  ],
  openGraph: {
    title: "Documentation - AI SDK Tools",
    description:
      "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools.",
    url: "https://ai-sdk-tools.dev/docs",
  },
  twitter: {
    title: "Documentation - AI SDK Tools",
    description:
      "Complete documentation for AI SDK Tools. Learn how to build powerful AI applications with our enhanced tools.",
  },
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  return <DocsContent />;
}
