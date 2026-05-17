import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) {
            return "react";
          }
          if (id.includes("/node_modules/three/") || id.includes("/node_modules/@react-three/fiber/")) {
            return "three";
          }
          if (id.includes("/node_modules/socket.io-client/")) {
            return "network";
          }
          return undefined;
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  }
});
