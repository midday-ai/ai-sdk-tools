import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ai-sdk-tools/store",
    "@ai-sdk-tools/devtools",
    "@ai-sdk-tools/artifacts",
  ],
};

export default nextConfig;
