import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@features": path.resolve(__dirname, "src/features"),
      "@config": path.resolve(__dirname, "src/config"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@dscn": path.resolve(__dirname, "src/design-system/cn"),
    },
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
