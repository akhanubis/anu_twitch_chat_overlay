require('./tco')
const { addClass, removeClass, hasClass } = require('./class_utils')
const createChatContainer = require('./chat_container')
const createIframe = require('./iframe')
const createToggle = require('./toggle')
const { attachBaseStyle, styleToSettings, STYLE_ATTRS } = require('./frame_style')
const { whenElementLoaded, whenClassToggled, whenUrlChanged } = require('./observer')
const { getSettings, setSettings } = require('./settings')
const makeDraggable = require('./draggable')
const makeResizable = require('./resizable')
const { inVOD, getCurrentStream } = require('./current_page')

const enable = _ => addClass(document.body, 'anu-chat-overlay-active')

const disable = _ => removeClass(document.body, 'anu-chat-overlay-active')

let enabled,
    appendTo,
    chatContainer,
    iframe,
    toggle

const init = async currentStream => {
  if (inVOD())
    return
  window._TCO.currentStream = currentStream
  if (!currentStream)
    return
  await getSettings()
  
  const initialSetup = _ => {
    const rightColumnCollapsed = document.querySelector('.right-column--collapsed'),
          chatCollapser = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]'),
          appendToParent = document.querySelector('.player-controls').parentNode.parentNode.parentNode
    chatContainer = createChatContainer()
    appendTo = document.createElement('div')
    iframe = createIframe(_ => {
      const mouseEventsContainer = document.querySelector('.video-player__overlay')
      makeResizable(chatContainer, mouseEventsContainer, iframe)
      makeDraggable(chatContainer, mouseEventsContainer, chatContainer.querySelector('.header'), {
        onDragEnd: _ => setSettings('position', styleToSettings(chatContainer.style, STYLE_ATTRS.POSITION)),
        excludedElements: chatContainer.querySelectorAll('.settings, .settings *')
      })

      attachBaseStyle(iframe.contentDocument.body)
      iframe.style = ''
      if (rightColumnCollapsed)
        chatCollapser.click()
      removeClass(chatContainer, 'loading')
      whenElementLoaded(iframe.contentDocument.body, 'scrollable-trigger__wrapper', _ => {
        const scrollbarHack = document.createElement('div')
        scrollbarHack.className = 'scrollbar-hacky-hack'
        iframe.contentDocument.body.querySelector('.scrollable-trigger__wrapper').after(scrollbarHack)
      })
      const html = document.querySelector('html'),
            iframeHtml = iframe.contentDocument.querySelector('html'),
            darkThemeClass = 'tw-root--theme-dark'
      whenClassToggled(html, darkThemeClass, _ => {
        if (hasClass(html, darkThemeClass))
          addClass(iframeHtml, darkThemeClass)
        else
          removeClass(iframeHtml, darkThemeClass)
      })
    })
          
    if (rightColumnCollapsed)
      chatCollapser.click()
    
    chatContainer.addEventListener('mouseenter', _ => {
      const chatList = iframe.contentDocument.body.querySelector('.chat-list__list-container')
      if (chatList)
        chatList.scrollTop = chatList.scrollHeight
    })
    chatContainer.addEventListener('mouseover', _ => addClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.addEventListener('mouseout', _ => removeClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.append(iframe)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)
  }

  toggle = createToggle()
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

  console.log(`Anu Twitch Chat Overlay initialized for ${ currentStream }`)

  if (enabled) /* was enabled before the raid/scroll down */
    initialSetup()
}

const cleanUp = _ => {
  for (const p of document.querySelectorAll('.video-player__overlay .tco-modal'))
    p.remove()
  toggle?.remove()
  if (appendTo) {
    appendTo.remove()
    console.log('Anu Twitch Chat Overlay cleaned up')
  }
}

whenElementLoaded(document.body, 'player-controls__right-control-group', _ => {
  cleanUp()
  init(getCurrentStream())
})

whenUrlChanged(async _ => {
  const oldStream = window._TCO.currentStream,
        newStream = getCurrentStream()
  if (newStream === oldStream)
    return
  cleanUp()
  init(newStream)
}, false)