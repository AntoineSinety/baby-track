import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/baby-track/' : '/',
  server: {
    host: true, // Expose sur le réseau local
    port: 5173
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Baby Track',
        short_name: 'BabyTrack',
        description: 'Application de suivi d\'allaitement et de couches pour bébé',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        scope: process.env.NODE_ENV === 'production' ? '/baby-track/' : '/',
        start_url: process.env.NODE_ENV === 'production' ? '/baby-track/' : '/',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">👶</text></svg>',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">👶</text></svg>',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
