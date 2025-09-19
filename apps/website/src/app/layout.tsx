import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { Provider } from "@ai-sdk-tools/store";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI SDK Tools - Powerful Tools for Building AI Applications",
    template: "%s | AI SDK Tools",
  },
  description:
    "Essential utilities that extend and improve the Vercel AI SDK experience. State management, debugging tools, and structured artifact streaming for building advanced AI interfaces.",
  keywords: [
    "AI SDK",
    "Vercel AI SDK",
    "React AI",
    "AI development tools",
    "AI state management",
    "AI debugging",
    "AI artifacts",
    "TypeScript AI",
    "AI applications",
    "AI development",
    "AI tools",
    "AI SDK store",
    "AI SDK devtools",
    "AI streaming",
    "AI components",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
