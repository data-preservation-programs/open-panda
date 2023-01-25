/*
 *
 * 🔌 [plugin | search] ls
 *
 */

// ////////////////////////////////////////////////////////////// [Class] Filter
// -----------------------------------------------------------------------------
class Ls {
  // =============================================================== constructor
  constructor (options) {
    this.config = options
    this.prefix = options.prefix
  }

  // ======================================================================= get
  get (key) {
    return localStorage.getItem(`${this.prefix}${key}`)
  }

  // ======================================================================= set
  set (key, value) {
    localStorage.setItem(`${this.prefix}${key}`, value)
  }

  // ==================================================================== remove
  remove (key) {
    localStorage.removeItem(`${this.prefix}${key}`)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app }, inject) {
  inject('ls', new Ls(<%= options %>))
}
