window._TCO.addClass = (element, klass) => {
  window._TCO.removeClass(element, klass)
  element.className += ` ${ klass }`
}

window._TCO.removeClass = (element, klass) => element.className = element.className.replace(klass, '').replace(/\s+/g, ' ').trim()

window._TCO.hasClass = (element, klass) => ` ${ element.className } `.includes(` ${ klass } `)