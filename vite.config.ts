import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Erradely — Get It Done Near You',
        short_name: 'Erranda',
        description: "Nigeria's on-demand errand & service platform. Owerri, Imo State.",
        theme_color: '#22c55e',
        background_color: '#060d09',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          { urlPattern: /\/api\/.*/, handler: 'NetworkFirst', options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 } },
        ],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 3000, proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } },
})
