import vue from '@vitejs/plugin-vue'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: 'latest',

  devtools: { enabled: true },

  app: {
    head: {
      title: 'F1 League',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },],
      meta: [
        { name: 'description', content: 'Predict the F1 Top 10 for every Grand Prix. Compete with friends across the season.' },
        { property: 'og:title', content: 'F1 League' },
        { property: 'og:description', content: 'Predict the F1 Top 10 for every Grand Prix. Compete with friends across the season.' },
        { property: 'og:image', content: 'https://f1.hrcd.fr/og.png' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://f1.hrcd.fr' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://f1.hrcd.fr/og.png' },
      ],
    },
  },

  runtimeConfig: {
    private: {
      resendApiKey: '',
      senderEmail: '',
    },
  },

  nitro: {
    imports: {
      dirs: ['./server/services'],
    },
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '0 0 * * *': ['auto-seed'],
      '*/30 * * * *': ['import-results'],
      '0 8 * * *': ['send-reminders'],
      '0 18 * * *': ['pitwall-predict'],
    },
    rollupConfig: {
      plugins: [vue()],
    },
  },

  css: ['~/assets/css/index.css'],

  image: {
    provider: 'ipx',
  },

  hub: {
    db: 'postgresql',
    kv: true,
    cache: true,
  },

  evlog: {
    env: { service: 'f1-championship' },
    include: ['/api/**'],
    exclude: ['/api/_evlog/**'],
    sampling: {
      rates: { info: 50 },
      keep: [{ status: 400 }, { status: 500 }, { duration: 1000 }],
    },
  },

  auth: {
    redirects: {
      login: '/login',
      guest: '/',
    },
    hubSecondaryStorage: true,
  },

  routeRules: {
    '/races': { isr: { expiration: 30 } },
    '/settings': { auth: 'user' },
    '/leagues/**': { auth: 'user' },
    '/admin/**': { auth: { user: { role: 'admin' } }, isr: false },
    '/login': { auth: 'guest' },
    '/register': { auth: 'guest' },
    '/reset-password': { auth: 'guest' },
    '/api/f1/**': { isr: { expiration: 300 } },
    '/api/auth/**': { isr: false, cache: false },
  },

  icon: {
    customCollections: [
      {
        prefix: 'f1',
        dir: './app/assets/icons',
      }
    ],
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
    },
  },

  site: {
    url: 'https://f1.hrcd.fr',
  },

  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  modules: [
    '@nuxthub/core',
    '@onmax/nuxt-better-auth',
    'evlog/nuxt',
    '@nuxt/ui',
    '@nuxt/scripts',
    '@nuxt/image',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/mdc',
    'nuxt-og-image',
  ],
})
