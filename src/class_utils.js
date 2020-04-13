const addClass = (element, klass) => {
  removeClass(element, klass)
  element.className += ` ${ klass }`
}

const removeClass = (element, klass) => element.className = element.className.replace(klass, '').replace(/\s+/g, ' ').trim()

const hasClass = (element, klass) => ` ${ element.className } `.includes(` ${ klass } `)

module.exports = {
  addClass,
  removeClass,
  hasClass
}