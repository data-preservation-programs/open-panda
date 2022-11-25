// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////// Check if Element is fully in the viewport
const IsInViewport = (element, scrollTop, viewportTop, viewportBottom, offset) => {
  const elementRect = element.getBoundingClientRect()
  const elementTop = elementRect.top + scrollTop + offset
  const elementHeight = element.offsetHeight || element.clientHeight
  const elementBottom = elementTop + elementHeight
  if (elementBottom >= viewportTop && elementTop < viewportBottom) { return true }
  return false
}

// ////////////////////////////////////////////////////////// Update positioning
const InViewportUpdate = (instance, elements, inViewportClass, offset, respond, next) => {
  const viewportTop = window.pageYOffset || document.documentElement.scrollTop
  const viewportBottom = viewportTop + (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const len = elements.length
  const visible = []
  for (let i = 0; i < len; i++) {
    const element = elements[i]
    if (instance.$isInViewport(element, scrollTop, viewportTop, viewportBottom, offset) === true) {
      if (!instance.$hasClass(element, inViewportClass)) {
        element.classList.add(inViewportClass)
      }
      visible.push(element.classList)
    } else {
      if (instance.$hasClass(element, inViewportClass)) {
        element.classList.remove(inViewportClass)
      }
    }
  }
  if (respond === 'multiple') {
    return next(visible)
  } else {
    return next(visible.length > 0)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default (ctx, inject) => {
  inject('isInViewport', IsInViewport)
  inject('inViewportUpdate', InViewportUpdate)
}
