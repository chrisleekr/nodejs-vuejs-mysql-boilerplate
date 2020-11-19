module.exports = {
  telemetry: false,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate:
      '%s | Node.js (REST API) + Vue.js (Frontend/Backend) + MySQL Boilerplate',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          process.env.npm_package_description || 'Frontend made by Nuxt.js'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/custom.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '@/plugins/vuelidate', ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/toast',
    [
      'nuxt-imagemin',
      {
        optipng: { optimizationLevel: 5 },
        gifsicle: { optimizationLevel: 2 }
      }
    ],
    '@nuxtjs/google-analytics',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['faTrash']
          }
        ]
      }
    ],
    ['cookie-universal-nuxt', {}]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(_config, _ctx) {}
  },
  generate: {
    routes: ['/another-page', '/sample-page/1', '/sample-page/2']
  },
  router: {
    base: process.env.BASE_URL || '/',
    middleware: ['check-auth'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'another-page',
        path: '/another-page',
        component: resolve(__dirname, 'pages/page.vue'),
        meta: {
          pageName: 'another page'
        }
      })
      routes.push({
        name: 'sample-page',
        path: '/sample-page/:pageId',
        component: resolve(__dirname, 'pages/page.vue'),
        meta: {
          pageName: 'sample page'
        }
      })
    }
  },
  toast: {
    position: 'top-center',
    register: [
      // Register custom toasts
    ]
  },
  googleAnalytics: {
    id: 'GOOGLE_ANALYTICS_ID'
  }
}
