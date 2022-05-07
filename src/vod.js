require('./tco')
const { addClass, removeClass } = require('./class_utils')
const createChatContainer = require('./chat_container')
const createToggle = require('./toggle')
const { attachBaseStyle, STYLE_ATTRS, applyBackground, applyFont, applyToggles, settingsToStyle, styleToSettings } = require('./frame_style')
const { whenElementLoaded, whenUrlChanged } = require('./observer')
const { getSettings, setSettings, getGlobalSettings } = require('./settings')
const makeDraggable = require('./draggable')
const makeResizable = require('./resizable')
const { getStreamFromVOD, getCurrentVOD, forcedVOD } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

const enable = _ => addClass(document.body, 'anu-chat-overlay-active')

const disable = _ => removeClass(document.body, 'anu-chat-overlay-active')

const attachTo = (element, newParent) => {
  element.parentNode.removeChild(element)
  newParent.append(element)
}

let enabled,
    appendTo,
    chatContainer,
    chatElement,
    initialParent

const init = async currentVOD => {
  window._TCO.currentVOD = currentVOD
  if (!currentVOD || window._TCO.initializing)
    return
  window._TCO.initializing = true

  window._TCO.currentStream = await getStreamFromVOD()

  await getSettings()
  setupAutoClaimManager()
  
  const initialSetup = _ => {
    const appendToParent = document.querySelector('.video-player__overlay')
    chatElement = document.querySelector('.chat-room__content, .video-chat__message-list-wrapper').parentNode
    initialParent = chatElement.parentNode
    addClass(chatElement, 'atco-dettached')
    addClass(chatElement, 'chat-room')
    chatElement.addEventListener('mouseenter', _ => {
      const chatList = chatElement.querySelector('.chat-list--default')
      if (chatList)
        chatList.scrollTop = chatList.scrollHeight
    })
    chatElement.addEventListener('mouseover', _ => addClass(chatElement, 'hovered'))
    chatElement.addEventListener('mouseout', _ => removeClass(chatElement, 'hovered'))

    attachBaseStyle(chatElement)
    appendTo = document.createElement('div')

    chatContainer = createChatContainer()
    removeClass(chatContainer, 'loading')

    attachTo(chatElement, chatContainer)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)

    if (forcedVOD()) {
      const scrollbarHack = document.createElement('div')
      scrollbarHack.className = 'scrollbar-hacky-hack'
      chatElement.querySelector('.chat-scrollable-area__message-container, .video-chat__message-list-wrapper ul').after(scrollbarHack)
    }

    applyBackground(settingsToStyle(window._TCO.currentSettings.background, STYLE_ATTRS.BACKGROUND))
    applyFont(settingsToStyle(window._TCO.currentSettings.font, STYLE_ATTRS.FONT))
    applyToggles(settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES))

    const mouseEventsContainer = document.querySelector('.video-player__overlay')
    makeResizable(chatContainer, mouseEventsContainer)
    makeDraggable(chatContainer, mouseEventsContainer, chatContainer.querySelector('.header'), {
      onDragEnd: _ => setSettings('position', styleToSettings(chatContainer.style, STYLE_ATTRS.POSITION)),
      excludedElements: chatContainer.querySelectorAll('.settings, .settings *')
    })
  }

  const toggle = createToggle()
  toggle.onclick = _ => {
    if (!chatContainer)
      initialSetup()
    enabled = !enabled
    if (enabled)
      enable()
    else
      disable()
    attachTo(chatElement, enabled ? chatContainer : initialParent)
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group .settings-menu-button-component').parentNode.after(toggle)

  console.log(`Anu Twitch Chat Overlay initialized for VOD ${ currentVOD }`)
  window._TCO.initializing = false

  if (enabled) /* was enabled before the video switch */
    initialSetup()
}

const cleanUp = _ => {
  if (chatContainer)
    attachTo(chatElement, initialParent)
  for (const p of document.querySelectorAll('.video-player__overlay .tco-modal, .atco-injected-style'))
    p.remove()
  for (const p of document.querySelectorAll('#anu-chat-overlay-toggle'))
    p.remove()
  if (appendTo) {
    appendTo.remove()
    console.log('Anu Twitch Chat Overlay cleaned up')
  }
}

whenElementLoaded(document.body, 'player-controls__right-control-group', async _ => {
  await getGlobalSettings()
  cleanUp()
  await init(getCurrentVOD())
})

whenUrlChanged(async _ => {
  await getGlobalSettings()
  const oldVideo = window._TCO.currentVOD,
        newVideo = getCurrentVOD()
  if (newVideo === oldVideo)
    return
  cleanUp()
  await init(newVideo)
}, false)