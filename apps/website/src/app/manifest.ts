import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI SDK Tools",
    short_name: "AI SDK Tools",
    description:
      "Essential utilities that extend and improve the Vercel AI SDK experience. State management, debugging tools, and structured artifact streaming for building advanced AI interfaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0c",
    theme_color: "#1a1a1a",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    categories: ["developer", "productivity", "utilities"],
    lang: "en",
    orientation: "portrait-primary",
  };
}
