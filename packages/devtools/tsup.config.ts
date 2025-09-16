import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  injectStyle: false, // Don't generate separate CSS files
  external: ["react", "react-dom", "react/jsx-runtime", "@ai-sdk/react"],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".css": "text",
    };
  },
  banner: {
    js: `
// Auto-inject CSS styles when module loads
(function() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ai-devtools-styles')) return;
  
  const CSS_CONTENT = \`${readFileSync(resolve(__dirname, "src/styles.css"), "utf-8").replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;
  
  const style = document.createElement('style');
  style.id = 'ai-devtools-styles';
  style.textContent = CSS_CONTENT;
  document.head.appendChild(style);
})();
`,
  },
  onSuccess: async () => {
    // Inject 'use client' directive into built files
    const files = ["dist/index.js", "dist/index.mjs"];

    for (const file of files) {
      try {
        const content = readFileSync(resolve(__dirname, file), "utf-8");
        const withUseClient = `"use client";\n\n${content}`;
        writeFileSync(resolve(__dirname, file), withUseClient);
        console.log(`✅ Added 'use client' to ${file}`);
      } catch (error) {
        console.error(`❌ Failed to add 'use client' to ${file}:`, error);
      }
    }
  },
});
