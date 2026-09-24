import { defineConfig } from "vite";
import { resolve } from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";

/**
 * Vite — build otimizada para GitHub Pages (static hosting).
 * root = html → dist/index.html na raiz do artefacto publicado.
 */
export default defineConfig({
  root: "html",
  base: "./",
  publicDir: false,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    target: "es2018",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "html/index.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    open: "/index.html",
    port: 5173,
  },
  preview: {
    port: 4173,
    open: "/index.html",
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "pages", dest: "." },
        { src: "../images/**/*", dest: "images" },
        { src: "../favicon.ico", dest: "." },
        { src: "../docs/capturas", dest: "docs" },
      ],
    }),
  ],
  resolve: {
    alias: {
      // permite imports a partir de ../js quando root é html/
    },
  },
});
