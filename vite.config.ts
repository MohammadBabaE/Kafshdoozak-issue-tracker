import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://soosk.darkube.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("origin", "http://localhost:5173");
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            proxyRes.headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
            proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
          });
        },
      },
    },
  },
});
