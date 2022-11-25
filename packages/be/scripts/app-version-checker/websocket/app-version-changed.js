console.log('⚡️ [websocket] cron|app|app-version-changed')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.socket.listeners.push({
  name: 'cron|app-version-changed|initialize',
  handler (changed) {
    if (changed) {
      MC.socket.io.to('global').emit('cron|app-version-changed|payload', 'An app update is available. Please refresh the page.')
    }
  }
})
