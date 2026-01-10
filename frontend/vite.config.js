import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PathFinder',
        short_name: 'PathFinder',
        icons: [{ src: '/logo.png', sizes: '192x192', type: 'image/png' }],
        theme_color: '#2563eb',
        background_color: '#f8fafc',
      },
    }),
  ],
  server: { port: 5173 },
  define: { global: 'globalThis' },
});
