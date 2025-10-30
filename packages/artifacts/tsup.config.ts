import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  minify: false,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@ai-sdk/react",
    "@ai-sdk-tools/store",
  ],
  onSuccess: async () => {
    // Inject 'use client' directive ONLY into client builds
    const files = ["dist/client.js", "dist/client.mjs"];

    for (const file of files) {
      try {
        const content = readFileSync(resolve(__dirname, file), "utf-8");
        if (!content.startsWith('"use client"')) {
          const withUseClient = `"use client";\n\n${content}`;
          writeFileSync(resolve(__dirname, file), withUseClient);
          console.log(`✅ Added 'use client' to ${file}`);
        }
      } catch (error) {
        console.error(`❌ Failed to add 'use client' to ${file}:`, error);
      }
    }
  },
});
