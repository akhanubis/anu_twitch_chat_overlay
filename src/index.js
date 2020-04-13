require('./tco')
const { addClass, removeClass } = require('./class_utils')
const createChatContainer = require('./chat_container')
const createIframe = require('./iframe')
const createToggle = require('./toggle')
const { attachFrameStyle } = require('./frame_style')
const { whenElementLoaded } = require('./observer')
const { getSettings } = require('./settings')

const init = async _ => {
  window._TCO.currentStream = (window.location.href.match(/\.tv\/([a-zA-Z0-9_]+)/) || [])[1].toLowerCase()
  const settings = await getSettings()
  let enabled,
      chatContainer

  const initialSetup = _ => {
    const rightColumnCollapsed = document.querySelector('.right-column--collapsed'),
          chatCollapser = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]'),
          appendTo = document.createElement('div')
          appendToParent = document.querySelector('.player-controls').parentNode.parentNode.parentNode,
          chatContainer = createChatContainer(settings),
          iframe = createIframe(_ => {
            attachFrameStyle(iframe)
            iframe.style = ''
            if (rightColumnCollapsed)
              chatCollapser.click()
            removeClass(chatContainer, 'loading')
            whenElementLoaded(iframe.contentDocument.body, 'scrollable-trigger__wrapper', _ => {
              const scrollbarHack = document.createElement('div')
              scrollbarHack.className = 'scrollbar-hacky-hack'
              iframe.contentDocument.body.querySelector('.scrollable-trigger__wrapper').after(scrollbarHack)
            })
          })
          
    if (rightColumnCollapsed)
      chatCollapser.click()
    
    chatContainer.addEventListener('mouseenter', _ => {
      const chatList = iframe.contentDocument.body.querySelector('.chat-list__list-container')
      chatList.scrollTop = chatList.scrollHeight
    })
    chatContainer.addEventListener('mouseover', _ => addClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.addEventListener('mouseout', _ => removeClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.append(iframe)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)
  }

  const enable = _ => addClass(document.body, 'anu-chat-overlay-active')

  const disable = _ => removeClass(document.body, 'anu-chat-overlay-active')

  const toggle = createToggle()
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

  console.log(`Twitch Chat Overlay initialized for ${ window._TCO.currentStream }`)
}

whenElementLoaded(document.body, 'player-controls__right-control-group', init)