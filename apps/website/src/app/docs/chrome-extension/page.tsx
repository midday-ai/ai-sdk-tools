import type { Metadata } from "next";
import ChromeExtensionContent from "@/components/docs/chrome-extension-content";

export const metadata: Metadata = {
  title: "Chrome Extension Documentation - AI SDK Tools",
  description:
    "Chrome extension for debugging AI SDK applications directly in Chrome DevTools. Native integration with real-time monitoring, stream interception, and state management exploration.",
  keywords: [
    "AI SDK chrome extension",
    "AI debugging extension",
    "Chrome DevTools AI",
    "AI SDK browser tools",
    "AI debugging browser",
    "AI monitoring extension",
    "AI tools chrome extension",
    "AI SDK browser debugging",
    "AI application debugging",
    "AI tools browser tools",
  ],
  openGraph: {
    title: "Chrome Extension Documentation - AI SDK Tools",
    description:
      "Chrome extension for debugging AI SDK applications directly in Chrome DevTools with native integration and real-time monitoring.",
    url: "https://ai-sdk-tools.dev/docs/chrome-extension",
  },
  twitter: {
    title: "Chrome Extension Documentation - AI SDK Tools",
    description:
      "Chrome extension for debugging AI SDK applications directly in Chrome DevTools with native integration and real-time monitoring.",
  },
  alternates: {
    canonical: "/docs/chrome-extension",
  },
};

export default function ChromeExtensionPage() {
  return <ChromeExtensionContent />;
}
