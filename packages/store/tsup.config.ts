import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false, // Disable tree shaking to preserve directives
  minify: false,
  external: ["react", "zustand", "@ai-sdk/react", "react/jsx-runtime"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
