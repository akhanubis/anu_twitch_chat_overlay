require('./tco')
const { cleanUp, createChatOverlay, toggleChatOverlay } = require('./chat_overlay')
const createToggle = require('./toggle')
const { whenElementLoaded, whenUrlChanged, whenKeybindPressed } = require('./observer')
const { getSettings, getGlobalSettings } = require('./settings')
const { inVOD, getCurrentStream } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

let enabled

const init = async currentStream => {
  if (inVOD())
    return
  window._TCO.currentStream = currentStream
  if (!currentStream || window._TCO.initializing)
    return
  window._TCO.initializing = true

  await getSettings()
  setupAutoClaimManager()

  const toggle = createToggle()
  toggle.onclick = () => {
    enabled = !enabled
    toggleChatOverlay(true, enabled)
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group').prepend(toggle)

  whenKeybindPressed(() => toggle.click())

  console.log(`Anu Twitch Chat Overlay initialized for ${currentStream}`)
  window._TCO.initializing = false

  if (enabled) {/* was enabled before the raid/scroll down */
    createChatOverlay(true)
  } else if (window._TCO.currentGlobalSettings.autoStart === 'true') {
    setTimeout(() => toggle.click(), 500);
  }
}

whenElementLoaded(document.body, 'player-controls__right-control-group', async _ => {
  await getGlobalSettings()
  cleanUp(true)
  await init(getCurrentStream())
})

whenUrlChanged(async _ => {
  await getGlobalSettings()
  const oldStream = window._TCO.currentStream,
    newStream = getCurrentStream()
  if (newStream === oldStream)
    return
  cleanUp(true)
  await init(newStream)
}, false)