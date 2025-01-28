import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'logo.svg',
        'apple-touch-icon-180x180.png',
        'maskable-icon-512x512.png',
        'pwa-64x64.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'illustration.svg',
        'illustration2.svg',
        'fonts/IBMPlexSans.woff2',
        'fonts/BebasNeue.woff2'
      ],
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|html|ico|png|svg|jpg|jpeg|gif|woff2)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'rizz-assets',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      manifest: {
        name: 'The Rizz Book',
        short_name: 'TheRizzBook',
        theme_color: '#ff4747',
        background_color: '#fff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
