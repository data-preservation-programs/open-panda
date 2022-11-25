/*
 *
 * 🔌 [Plugin | Auth] Auth
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/auth/store'

// This resolves to .nuxt/middleware.js
import NuxtMiddleware from '../middleware'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (app, next) => {
  return new Promise((next) => {
    app.store.registerModule('auth', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = () => {
  return new Promise((next) => {
    import('@/modules/auth/middleware/github')
      .then((middleware) => {
        NuxtMiddleware.github = middleware.default
        return next()
      })
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app }, inject) {
  await registerStore(app)
  await registerMiddleware()
}
