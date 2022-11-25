/*
 *
 * 🔌 [Plugin | Auth] Helpers
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Axios from 'axios'
import Cookie from 'cookie'
import { Agent } from 'https'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////// CreateAxiosAuthTransport
const CreateAxiosAuthTransport = (req, baseURL) => {
  return Axios.create({
    withCredentials: true,
    baseURL,
    httpsAgent: new Agent({
      rejectUnauthorized: false
    }),
    ...process.server && {
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  })
}

// ////////////////////////////////////////////////// CreateEventSourceTransport
const CreateEventSourceTransport = baseUrl => (path) => {
  return new EventSource(baseUrl + path, { withCredentials: true })
}

// ////////////////////////////////////////////////////////////// AuthIdentifier
const AuthIdentifier = (req) => {
  const cookies = process.server ? Cookie.parse(req.headers.cookie || '') : Cookie.parse(document.cookie || '')
  return cookies.hasOwnProperty('identifier') ? JSON.parse(cookies.identifier) : false
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ $config, req }, inject) => {
  inject('axiosAuth', CreateAxiosAuthTransport(req, $config.backendUrl))
  inject('eventSourceAuth', CreateEventSourceTransport($config.backendUrl))
  inject('authIdentifier', AuthIdentifier(req))
}
