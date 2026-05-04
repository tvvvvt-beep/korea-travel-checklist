// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  app: {
    head: {
      title: 'ソウル旅行前チェックリスト',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '2026年5月ソウル旅行のための包括的チェックリスト' },
        { name: 'theme-color', content: '#3b82f6' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (only available server-side)
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,

    // Public keys (exposed to client)
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
    },
  },


  typescript: {
    strict: true,
    typeCheck: false, // Disable for faster builds
  },

  vite: {
    optimizeDeps: {
      include: ['firebase'],
    },
    ssr: {
      noExternal: ['firebase'],
    },
  },
})
