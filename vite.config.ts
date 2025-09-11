import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Custom plugin to inject CSS as a string at build time
function cssInjectionPlugin(): Plugin {
  return {
    name: "css-injection",
    generateBundle(options, bundle) {
      // Read the CSS file
      const cssPath = resolve(__dirname, "src/styles.css");
      const cssContent = readFileSync(cssPath, "utf-8");

      // Find the main entry file
      const entryFile = Object.keys(bundle).find(
        (fileName) => fileName.endsWith(".js") && !fileName.includes("d.ts"),
      );

      if (entryFile && bundle[entryFile].type === "chunk") {
        const chunk = bundle[entryFile] as any;

        // Inject CSS as a string constant at the top of the file
        const cssInjection = `
// Auto-injected CSS styles
const DEVTOOLS_CSS = \`${cssContent.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;

// Function to inject CSS styles
function injectStyles() {
  if (document.getElementById("ai-devtools-styles")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "ai-devtools-styles";
  style.textContent = DEVTOOLS_CSS;
  document.head.appendChild(style);
}

// Auto-inject styles when module loads
if (typeof document !== 'undefined') {
  injectStyles();
}
`;

        // Prepend the CSS injection to the chunk
        chunk.code = cssInjection + chunk.code;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    cssInjectionPlugin(),
  ],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AIDevtools",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@ai-sdk/react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@ai-sdk/react": "AISDKReact",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "style.css";
          }
          return assetInfo.name || "assets/[name].[ext]";
        },
      },
    },
    cssCodeSplit: false, // Ensure CSS is not split and included in the main bundle
  },
});
