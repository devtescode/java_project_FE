import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "::",
    port: 8090,
  },

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      devOptions: {
        enabled: true,
      },

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "robots.txt",
      ],

      manifest: {
        id: "/",
        name: "Whisper Flow",
        short_name: "WhisperFlow",
        description: "Your intelligent AI assistant for fast, accurate, and insightful conversations.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#0f172a",
        background_color: "#0f172a",

        icons: [
          {
            src: "/whisper-flow-logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/whisper-flow-logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/whisper-flow-logo-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff2,json}"
        ],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});