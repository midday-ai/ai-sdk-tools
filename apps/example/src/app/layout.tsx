import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
 import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/sonner";
import { Provider } from "@ai-sdk-tools/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider> 
            {children}
          </Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
