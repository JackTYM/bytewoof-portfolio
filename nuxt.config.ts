export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  modules: ['nitro-cloudflare-dev', 'nuxt-site-config', '@nuxtjs/sitemap', 'nuxt-schema-org'],

  site: {
    url: 'https://bytewoof.dog',
    name: 'byte',
    description: 'byte is a wolfdog software engineer who builds things and stays up too late.',
  },

  sitemap: {
    exclude: ['/api/**'],
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'byte',
      url: 'https://bytewoof.dog',
      sameAs: [
        'https://github.com/JackTYM',
        'https://x.com/Byte_Woof',
        'https://instagram.com/Byte_Woof',
        'https://t.me/Byte_Woof',
      ],
    },
  },
})
