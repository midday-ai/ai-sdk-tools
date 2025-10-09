import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";

const departureFont = localFont({
  src: "./DepartureMono-Regular.woff2",
});

export const metadata: Metadata = {
  title: "AI Burn Rate Analyzer",
  description:
    "Interactive burn rate analysis with AI-powered insights and visualizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${departureFont.className} antialiased min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
