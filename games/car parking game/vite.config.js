import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("three/examples/jsm/loaders/GLTFLoader.js") ||
            id.includes("three/examples/jsm/postprocessing/") ||
            id.includes("three/examples/jsm/environments/RoomEnvironment.js")
          ) {
            return "three-tools";
          }
          if (id.includes("/node_modules/three/")) {
            return "three-core";
          }
          if (
            id.includes("/node_modules/cannon-es/") ||
            id.includes("/node_modules/gsap/") ||
            id.includes("/node_modules/howler/")
          ) {
            return "gameplay";
          }
          return undefined;
        },
      },
    },
  },
});
