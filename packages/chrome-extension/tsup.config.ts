import { defineConfig } from "tsup";

export default defineConfig([
  // DevTools Panel
  {
    entry: ["src/devtools-panel.tsx"],
    format: ["iife"],
    dts: false,
    clean: true,
    outDir: "dist",
    external: ["react", "react-dom"],
    globalName: "AIDevtoolsPanel",
    outExtension: () => ({ js: ".js" }),
  },
  // Content Script
  {
    entry: ["src/content.ts"],
    format: ["iife"],
    dts: false,
    outDir: "dist",
    globalName: "AIDevtoolsContent",
    outExtension: () => ({ js: ".js" }),
  },
  // Background Script
  {
    entry: ["src/background.ts"],
    format: ["iife"],
    dts: false,
    outDir: "dist",
    globalName: "AIDevtoolsBackground",
    outExtension: () => ({ js: ".js" }),
  },
  // Injected Script
  {
    entry: ["src/injected.ts"],
    format: ["iife"],
    dts: false,
    outDir: "dist",
    globalName: "AIDevtoolsInjected",
    outExtension: () => ({ js: ".js" }),
    esbuildOptions(options) {
      options.define = {
        ...options.define,
        "process.env.NODE_ENV": '"production"',
      };
    },
  },
]);
