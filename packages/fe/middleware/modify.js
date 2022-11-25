export default async function ({ req, app, store, route, redirect, error }) {
  const authenticateAdmin = route.meta.find(obj => obj.hasOwnProperty('authenticateAdmin'))
  if (authenticateAdmin) {
    const err = { statusCode: 404, message: 'Not Found' }
    const identifier = app.$authIdentifier
    if (!identifier) { return error(err) }
    try {
      await store.dispatch('modify/authenticateModify', req ? req.headers.cookie : false)
    } catch (e) {
      console.log('====================================== [Middleware: modify]')
      return error(err)
    }
  }
}
