window.TwitchChatOverlay = window.TwitchChatOverlay || {}

window.TwitchChatOverlay.addClass = (element, klass) => {
  window.TwitchChatOverlay.removeClass(element, klass)
  element.className += ` ${ klass }`
}

window.TwitchChatOverlay.removeClass = (element, klass) => element.className = element.className.replace(klass, '').replace(/\s+/g, ' ').trim()