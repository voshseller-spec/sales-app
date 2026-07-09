import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// VITE_DEMO=1 produces the single-file in-browser demo (scripts/build-demo.mjs):
// dynamic imports are inlined so the bundle is one self-contained script.
const demo = process.env.VITE_DEMO === "1";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
  build: demo
    ? { outDir: "dist-demo", rollupOptions: { output: { inlineDynamicImports: true } } }
    : undefined,
});
