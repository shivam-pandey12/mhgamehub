import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
  },
});
