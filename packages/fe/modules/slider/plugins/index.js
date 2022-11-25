/*
 *
 * 🔌 [plugin | slider] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/slider/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('slider', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// slider
const slider = (store) => (sliderId) => {
  const slider = store.getters['slider/sliders'].find(obj => obj.id.includes(sliderId))
  return {
    fetch () {
      return slider
    },
    getPanelCount () {
      return slider ? slider.panelCount : 0
    },
    getCurrentPanel () {
      return slider ? slider.currentPanel : 0
    },
    refreshHeight () {
      slider.refreshHeight()
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store }, inject) {
  await registerStore(store)
  inject('slider', slider(store))
}
