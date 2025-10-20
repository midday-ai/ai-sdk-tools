import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/providers/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["zod", "@upstash/redis", "drizzle-orm"],
});
