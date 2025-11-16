import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["ai", "zod", "@ai-sdk/mistral", "@ai-sdk/google", "unpdf"],
  treeshake: true,
  minify: false,
});

