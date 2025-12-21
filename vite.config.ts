import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      entry: "src/main.tsx",
      template: "index.html",
      inject: {
        data: {
          title: "index",
          injectScript: `<script src="./inject.js"></script>`,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    }
  },
  define: {
    "process.env": JSON.stringify(process.env),
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.HOST_PORT || "3000"),
    proxy: {
      "/api": {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
});
