import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/experimental.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  external: ["react", "zustand", "@ai-sdk/react", "react/jsx-runtime"],
});
