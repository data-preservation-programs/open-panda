// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Cookie from 'cookie'

import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////////// setCookies
const setCookies = (res, cookies) => {
  process.server ? res.setHeader('set-cookie', cookies) : cookies.forEach((c) => { document.cookie = c })
  return res
}

// //////////////////////////////////////////////////////////////// clearCookies
const clearCookies = (res) => {
  const expire = { path: '/', maxAge: 0, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') }
  const cookies = [
    Cookie.serialize('connect.sid', 'expired', expire),
    Cookie.serialize('toast', 'expired', expire),
    Cookie.serialize('identifier', 'expired', expire)
  ]
  process.server ? res.setHeader('set-cookie', cookies) : cookies.forEach((c) => { document.cookie = c })
  return res
}

// //////////////////////////////////////////////////////////////// authenticate
const authenticate = async (req, res, app, store, route, from, meta, redirect, guarded, refresh) => {
  try {
    const response = await store.dispatch('auth/authenticate', req ? req.headers.cookie : false)
    const identifier = response.data.payload
    if (identifier && refresh) {
      await setCookies(res, [
        Cookie.serialize('identifier', JSON.stringify(identifier), { path: '/' })
      ])
    }
    return response
  } catch (e) {
    const data = e.response.data
    const code = data.code
    const message = data.message
    const toast = {
      type: 'toast',
      code: code || 500,
      category: code && message ? 'success' : 'error',
      message: message || 'Something went wrong, please try again'
    }
    await clearCookies(res)
    if (!guarded) {
      return e
    } else if (process.server && route.path !== '/') {
      await setCookies(res, [
        Cookie.serialize('toast', JSON.stringify(toast), { path: '/' })
      ])
      return redirect('/')
    } else if (process.client) {
      const fromMeta = from.meta.find(obj => obj.hasOwnProperty('authenticate'))
      app.$toaster.add(toast)
      if (fromMeta && fromMeta.authenticate) {
        return redirect('/')
      } else if (route.path !== from.path) {
        return redirect(from.path)
      }
    }
  }
}

// ////////////////////////////////////////////////////////////////// tradeToken
const tradeToken = async (token, store) => {
  try {
    const response = await store.dispatch('auth/tradeToken', token)
    const data = response.data
    return {
      session: response.headers['set-cookie'][0],
      toast: {
        type: 'toast',
        code: data.code || 500,
        category: 'success',
        message: data.message || 'Something went wrong, please try again'
      },
      identifier: data.payload
    }
  } catch (e) {
    console.log('============================= [Middleware: auth - tradeToken]')
    const data = e.response.data
    return {
      toast: {
        type: 'toast',
        code: data.code || 500,
        category: 'error',
        message: data.message || 'Something went wrong, please try again'
      }
    }
  }
}

// ////////////////////////////////////////////////////////// handleUnauthorized
const HandleUnauthorized = async (ctx) => {
  // ------------------------------------------------------------- Set variables
  const { app, store, route, redirect, $config } = ctx
  const { req, res } = process.server ? ctx : false
  const from = process.client ? ctx.from : false
  let cookies = []
  let refresh = false
  // ------------------------------- Authenticate if accessing a protected route
  const meta = route.meta.find(obj => obj.hasOwnProperty('authenticate'))
  const guarded = (meta && meta.authenticate) || false
  // ---------------------------- Force re-authentication if cookies are missing
  cookies = process.server ? Cookie.parse(req.headers.cookie || '') : Cookie.parse(document.cookie || '')
  if (process.server && guarded && !cookies.hasOwnProperty('connect.sid')) {
    return redirect($config.githubOAuthLink)
  } else if (process.server) {
    if ((!cookies.hasOwnProperty('identifier') && cookies.hasOwnProperty('connect.sid')) ||
        (cookies.hasOwnProperty('identifier') && !cookies.hasOwnProperty('connect.sid'))) {
      refresh = true
    }
  }
  // ------------------------------------------- Trade Temp for Persistent Token
  const token = route.query.code
  if (token && process.server) {
    const response = await tradeToken(token, store)
    const session = response.session
    const toast = response.toast
    const identifier = response.identifier
    let path = '/'
    if (session && identifier) {
      const pathObj = identifier.registered ? Config.auth.redirectAfterLogin.registered : Config.auth.redirectAfterLogin.unregistered
      path = pathObj.path.split(':key').join(identifier[pathObj.key])
      await setCookies(res, [
        session,
        Cookie.serialize('toast', JSON.stringify(toast), { path: '/' }),
        Cookie.serialize('identifier', JSON.stringify(identifier), { path: '/' })
      ])
    } else {
      const expire = { path: '/', maxAge: 0, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') }
      const cookies = [
        Cookie.serialize('connect.sid', 'expired', expire),
        Cookie.serialize('identifier', 'expired', expire)
      ]
      if (toast) {
        cookies.push(Cookie.serialize('toast', JSON.stringify(toast), { path: '/' }))
      }
      await setCookies(res, cookies)
    }
    return redirect(path)
  }
  // -------------------------------------------------------------- Authenticate
  if (guarded || refresh) {
    await authenticate(req, res, app, store, route, from, meta, redirect, guarded, refresh)
  }
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export default async (ctx) => {
  await HandleUnauthorized(ctx)
}
