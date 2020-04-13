window._TCO.chatContainer = settings => {
  const container = document.createElement('div'),
        mouseEventsContainer = document.querySelector('.video-player__overlay')
  container.className = 'anu-chat-overlay-container loading'
  container.innerHTML = `
    <div class="resize-handler resize-left"></div>
    <div class="resize-handler resize-right"></div>
    <div class="resize-handler resize-top"></div>
    <div class="resize-handler resize-bottom"></div>
    <div class="resize-handler resize-left resize-bottom"></div>
    <div class="resize-handler resize-left resize-top"></div>
    <div class="resize-handler resize-right resize-bottom"></div>
    <div class="resize-handler resize-right resize-top"></div>
  `
  container.append(window._TCO.header(), window._TCO.loader('Loading chat'))
  window._TCO.applyStyle(container, {
    ...window._TCO.positionToStyle(settings.position)
  })
  window._TCO.makeResizable(container, mouseEventsContainer)
  window._TCO.makeDraggable(container, mouseEventsContainer, container.querySelector('.header'), container.querySelectorAll('.settings, .settings *'))
  return container
}