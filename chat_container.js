window._TCO.chatContainer = settings => {
  const container = document.createElement('div'),
        mouseEventsContainer = document.querySelector('.video-player__overlay')
  container.className = 'anu-chat-overlay-container loading'
  container.innerHTML = `
    <div class="resize-left"></div>
    <div class="resize-right"></div>
    <div class="resize-top"></div>
    <div class="resize-bottom"></div>
  `
  container.append(window._TCO.header(), window._TCO.loader('Loading chat'))
  window._TCO.applyStyle(container, {
    ...window._TCO.positionToStyle(settings.position)
  })
  const chatAnchor = container.querySelector('.drag-anchor')
  window._TCO.makeResizable(container, mouseEventsContainer, [chatAnchor])
  window._TCO.makeDraggable(container, mouseEventsContainer, chatAnchor)
  return container
}