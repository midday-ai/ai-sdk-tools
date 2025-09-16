import type { Metadata } from "next";
import InstallationContent from "@/components/docs/installation-content";

export const metadata: Metadata = {
  title: "Installation Guide - AI SDK Tools",
  description:
    "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building powerful AI interfaces.",
  keywords: [
    "AI SDK installation",
    "AI tools installation",
    "AI SDK setup",
    "AI tools setup",
    "AI SDK install guide",
    "AI tools install guide",
    "AI SDK packages",
    "AI tools packages",
    "AI SDK npm install",
    "AI tools npm install",
  ],
  openGraph: {
    title: "Installation Guide - AI SDK Tools",
    description:
      "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building.",
    url: "https://ai-sdk-tools.dev/docs/installation",
  },
  twitter: {
    title: "Installation Guide - AI SDK Tools",
    description:
      "Install individual packages or get the complete toolkit for building AI applications. Choose what you need and start building.",
  },
  alternates: {
    canonical: "/docs/installation",
  },
};

export default function InstallationPage() {
  return <InstallationContent />;
}
