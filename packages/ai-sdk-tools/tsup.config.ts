import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "@ai-sdk-tools/agents",
    "@ai-sdk-tools/artifacts",
    "@ai-sdk-tools/cache",
    "@ai-sdk-tools/devtools",
    "@ai-sdk-tools/memory",
    "@ai-sdk-tools/store",
    "ai",
    "@ai-sdk/react",
    "react",
    "react-dom",
    "zod",
    "zustand",
  ],
});
