const init = async _ => {
  const currentStream = window._TCO.currentStream = (window.location.href.match(/\.tv\/([a-zA-Z0-9_]+)/) || [])[1].toLowerCase()
  const settings = await window._TCO.getSettings()
  let enabled,
      chatContainer

  const initialSetup = _ => {
    const rightColumnCollapsed = document.querySelector('.right-column--collapsed'),
          chatCollapser = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]'),
          prependTo = document.querySelector('.click-handler')
    if (rightColumnCollapsed)
      chatCollapser.click()
    chatContainer = document.createElement('div')
    chatContainer.className = 'anu-chat-overlay-container loading'
    
    window._TCO.applyStyle(chatContainer, {
      ...window._TCO.positionToStyle(settings.position)
    })
    const iframe = document.createElement('iframe')
    iframe.style = 'display: none'
    iframe.addEventListener('load', _ => {
      window._TCO.attachFrameStyle(iframe)
      iframe.style = ''
      if (rightColumnCollapsed)
        chatCollapser.click()
      window._TCO.removeClass(chatContainer, 'loading')
      window._TCO.whenElementLoaded(iframe.contentDocument.body, 'scrollable-trigger__wrapper', _ => {
        const scrollbarHack = document.createElement('div')
        scrollbarHack.className = 'scrollbar-hacky-hack'
        iframe.contentDocument.body.querySelector('.scrollable-trigger__wrapper').after(scrollbarHack)
      })
    })
    iframe.setAttribute('width', '100%') 
    iframe.setAttribute('height', '100%')
    iframe.src = `https://twitch.tv/popout/${ currentStream }/chat`

    chatContainer.addEventListener('mouseenter', _ => {
      const chatList = iframe.contentDocument.body.querySelector('.chat-list__list-container')
      chatList.scrollTop = chatList.scrollHeight
    })
    chatContainer.addEventListener('mouseover', _ => window._TCO.addClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.addEventListener('mouseout', _ => window._TCO.removeClass(iframe.contentDocument.body, 'hovered'))

    chatContainer.prepend(window._TCO.header(), window._TCO.loader('Loading chat'), iframe)
    prependTo.prepend(chatContainer)
    const chatAnchor = chatContainer.querySelector('.drag-anchor')
    window._TCO.makeResizable(chatContainer, prependTo, [chatAnchor])
    window._TCO.makeDraggable(chatContainer, prependTo, chatAnchor)
  }

  const enable = _ => {
    window._TCO.addClass(document.body, 'anu-chat-overlay-active')
  }

  const disable = _ => {
    window._TCO.removeClass(document.body, 'anu-chat-overlay-active')
  }

  const toggle = window._TCO.toggle()
  toggle.onclick = _ => {
    if (!chatContainer)
      initialSetup()
    enabled = !enabled
    if (enabled)
      enable()
    else
      disable()
  }
  document.querySelector('.player-controls__right-control-group .settings-menu-button-component').parentNode.after(toggle)

  console.log(`Twitch Chat Overlay initialized for ${ currentStream }`)
}

window._TCO.whenElementLoaded(document.body, 'player-controls__right-control-group', init)