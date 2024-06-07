require('./tco')
const { addClass, removeClass, hasClass } = require('./class_utils')
const createChatContainer = require('./chat_container')
const createIframe = require('./iframe')
const createToggle = require('./toggle')
const { attachBaseStyle, styleToSettings, STYLE_ATTRS } = require('./frame_style')
const { whenElementLoaded, whenClassToggled, whenUrlChanged, whenKeybindPressed } = require('./observer')
const { getSettings, setSettings, getGlobalSettings } = require('./settings')
const makeDraggable = require('./draggable')
const makeResizable = require('./resizable')
const { inVOD, getCurrentStream, isTogglingRightColumn, isRightColumnClosed, toggleRightColumn } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

const enable = _ => addClass(document.body, 'anu-chat-overlay-active')

const disable = _ => removeClass(document.body, 'anu-chat-overlay-active')

let enabled,
    appendTo,
    chatContainer,
    iframe

const init = async currentStream => {
  if (inVOD())
    return
  window._TCO.currentStream = currentStream
  if (!currentStream || window._TCO.initializing)
    return
  window._TCO.initializing = true

  await getSettings()
  setupAutoClaimManager()
  
  const initialSetup = _ => {
    const appendToParent = document.querySelector('.video-player__overlay')
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
      removeClass(chatContainer, 'loading')
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
    
    chatContainer.addEventListener('mouseenter', _ => {
      const chatList = iframe.contentDocument.body.querySelector('.chat-list--default')
      if (chatList)
        chatList.scrollTop = chatList.scrollHeight
    })
    chatContainer.addEventListener('mouseover', _ => addClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.addEventListener('mouseout', _ => removeClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.append(iframe)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)
  }

  const toggle = createToggle()
  toggle.onclick = _ => {
    if (!chatContainer)
      initialSetup()
    enabled = !enabled
    if (enabled) {
      enable()
      if (!isTogglingRightColumn() && window._TCO.currentGlobalSettings.autoCloseRightColumn === 'true' && !isRightColumnClosed()) {
        toggleRightColumn()
      }
    } else {
      disable()
    }
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group').prepend(toggle)

  whenKeybindPressed(() => toggle.click())

  console.log(`Anu Twitch Chat Overlay initialized for ${ currentStream }`)
  window._TCO.initializing = false

  if (enabled) {/* was enabled before the raid/scroll down */
    initialSetup()
  } else if (window._TCO.currentGlobalSettings.autoStart === 'true') {
    setTimeout(() => toggle.click(), 500);
  }
}

const cleanUp = _ => {
  for (const p of document.querySelectorAll('.video-player__overlay .tco-modal'))
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
  await init(getCurrentStream())
})

whenUrlChanged(async _ => {
  await getGlobalSettings()
  const oldStream = window._TCO.currentStream,
        newStream = getCurrentStream()
  if (newStream === oldStream)
    return
  cleanUp()
  await init(newStream)
}, false)