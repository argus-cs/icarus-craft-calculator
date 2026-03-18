import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@vite-pwa/nuxt'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: '/icarus-craft-calculator/',
    head: {
      title: 'Icarus Craft Calculator',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0f172a' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Icarus Craft Calculator',
      short_name: 'Icarus Calc',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,json,png,svg,ico}'],
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})
