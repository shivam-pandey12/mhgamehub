import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/game/hud') || id.includes('/src/game/progression') || id.includes('/src/game/uiAudio')) {
            return 'ui-shell';
          }
          return undefined;
        },
      },
    },
  },
});
