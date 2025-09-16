import type { Metadata } from "next";
import MigrationContent from "@/components/docs/migration-content";

export const metadata: Metadata = {
  title: "Migration Guide - AI SDK Tools",
  description:
    "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance, global state access, and powerful debugging capabilities.",
  keywords: [
    "AI SDK migration",
    "AI tools migration",
    "AI SDK upgrade",
    "AI SDK migration guide",
    "AI tools upgrade",
    "AI SDK migration tutorial",
    "AI application migration",
    "AI SDK tools migration",
    "AI SDK migration steps",
    "AI tools migration guide",
  ],
  openGraph: {
    title: "Migration Guide - AI SDK Tools",
    description:
      "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance and global state access.",
    url: "https://ai-sdk-tools.dev/docs/migration",
  },
  twitter: {
    title: "Migration Guide - AI SDK Tools",
    description:
      "Migrate from standard AI SDK to our enhanced tools with minimal changes. Get better performance and global state access.",
  },
  alternates: {
    canonical: "/docs/migration",
  },
};

export default function MigrationPage() {
  return <MigrationContent />;
}
