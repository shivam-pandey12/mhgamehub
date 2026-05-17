import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("three/examples/jsm/postprocessing/")) {
            return "postfx";
          }
          if (id.includes("three/examples/jsm/controls/OrbitControls.js")) {
            return "controls";
          }
          if (id.includes("/node_modules/three/")) {
            return "three";
          }
          return undefined;
        },
      },
    },
  },
});
