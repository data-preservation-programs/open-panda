// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  stable: '',
  production: ''
}

const frontendPort = (function () {
  if (env === 'development') { return 13010 }
  return env === 'stable' ? 13020 : 13030
}())

const backendPort = (function () {
  if (env === 'development') { return 13040 }
  return env === 'stable' ? 13050 : 13060
}())

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    frontendUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
    backendUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : `${baseUrls[env]}/api`,
    githubOAuthLink: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email`,
    serverFlag: env,
    seo: {
      siteName: 'OpenPanda'
    },
    socketOptions: {
      withCredentials: true
    }
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: frontendPort,
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost'
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    title: 'OpenPanda',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'OpenPanda' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon-96x96.png' }
    ]
  },
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#FFFFFF',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/scss/main.scss'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/variables.scss'
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/moment-module#readme
    '@nuxtjs/moment',
    // https://google-fonts.nuxtjs.org/setup
    '@nuxtjs/google-fonts'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    '@nuxtjs/style-resources', // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/axios', // Doc: https://axios.nuxtjs.org/usage
    'nuxt-socket-io', // Doc: https://nuxt-socket-io.netlify.app/
    '~/modules/https',
    '~/modules/toaster',
    // '~/modules/slider',
    // '~/modules/alert',
    // '~/modules/auth',
    // '~/modules/search',
    '~/modules/form',
    '~/modules/button'
  ],
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/plugins/helpers',
    '~/plugins/directives',
    '~/plugins/seo',
    '~/plugins/scroll-to'
    // '~/plugins/in-viewport',
    // '~/plugins/uuid'
  ],
  // ///////////////////////////////////////////////////////// [Module] MomentJS
  // ---------------------- Doc: https://github.com/nuxt-community/moment-module
  moment: {
    timezone: true,
    defaultTimezone: 'UTC'
  },
  // ////////////////////////////////////////////////////// [Module] GoogleFonts
  googleFonts: {
    families: {
      Heebo: [400, 500, 700],
      Manrope: [600, 700],
      'Space Mono': [400]
    },
    preconnect: true
  },
  // ///////////////////////////////////////////////////////////// [Module] Auth
  // ---------------------------------------------------------------------------
  // auth: {
  //   redirectAfterLogin: {
  //     unregistered: {
  //       path: '/account/:key',
  //       key: 'githubUsername'
  //     },
  //     registered: {
  //       path: '/account/:key/datasets/claimed',
  //       key: 'githubUsername'
  //     }
  //   },
  //   redirectAfterLogout: '/'
  // },
  // ////////////////////////////////////////////////////////// [Module] Account
  // ---------------------------------------------------------------------------
  // account: {
  //   redirectAfterRegistering: {
  //     path: '/account/:key/datasets/all',
  //     key: 'githubUsername'
  //   }
  // },
  // //////////////////////////////////////////////////////////// [Module] Axios
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {},
  // /////////////////////////////////////////////////// [Module] Nuxt Socket.io
  // ---------------------------------- Doc: https://nuxt-socket-io.netlify.app/
  io: {
    sockets: [{
      url: env === 'development' ? `${baseUrls[env]}:${backendPort}` : baseUrls[env]
    }]
  },
  // ////////////////////////////////////////////////////////// [Plugin] Toaster
  // ---------------------------------------------------------------------------
  toaster: {
    display: 10,
    timeout: 5000
  },
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  // router: {
  //   middleware: ['modify']
  // },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    // ---------------------------------------------------------- Hot Middleware
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    // -------------------------------------------------------------- Extensions
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })
    }
  }
}
