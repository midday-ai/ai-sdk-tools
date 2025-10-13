import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@ai-sdk-tools/store";
import { OpenPanelComponent } from "@openpanel/nextjs";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const departureFont = localFont({
  src: "./DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AI SDK Tools - Powerful Tools for Building AI Applications",
    template: "%s | AI SDK Tools",
  },
  description:
    "Essential utilities that extend and improve the Vercel AI SDK experience. Multi-agent orchestration, state management, debugging tools, and structured artifact streaming for building advanced AI applications.",
  keywords: [
    "AI SDK",
    "Vercel AI SDK",
    "React AI",
    "AI development tools",
    "AI agents",
    "multi-agent systems",
    "AI state management",
    "AI debugging",
    "AI artifacts",
    "TypeScript AI",
    "AI applications",
    "AI development",
    "AI tools",
    "AI SDK agents",
    "AI SDK store",
    "AI SDK devtools",
    "AI streaming",
    "AI components",
    "agent orchestration",
  ],
  authors: [{ name: "AI SDK Tools Team" }],
  creator: "AI SDK Tools",
  publisher: "AI SDK Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-sdk-tools.dev"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${departureFont.variable}`}
    >
      <body className={`${geistMono.className} antialiased`}>
        <Provider initialMessages={[]}>
          <Header />
          {children}
          <Footer />
          <OpenPanelComponent
            clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
            trackScreenViews
          />
        </Provider>
      </body>
    </html>
  );
}
