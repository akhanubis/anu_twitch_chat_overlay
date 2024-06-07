require('./tco')
const { cleanUp, createChatOverlay, toggleChatOverlay } = require('./chat_overlay')
const createToggle = require('./toggle')
const { whenElementLoaded, whenUrlChanged, whenKeybindPressed } = require('./observer')
const { getSettings, getGlobalSettings } = require('./settings')
const { getStreamFromVOD, getCurrentVOD } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

let enabled

const init = async currentVOD => {
  window._TCO.currentVOD = currentVOD
  if (!currentVOD || window._TCO.initializing)
    return
  window._TCO.initializing = true

  window._TCO.currentStream = await getStreamFromVOD()

  await getSettings()
  setupAutoClaimManager()

  const toggle = createToggle()
  toggle.onclick = () => {
    enabled = !enabled
    toggleChatOverlay(false, enabled)
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group').prepend(toggle)

  whenKeybindPressed(() => toggle.click())

  console.log(`Anu Twitch Chat Overlay initialized for VOD ${currentVOD}`)
  window._TCO.initializing = false

  if (enabled) { /* was enabled before the video switch */
    createChatOverlay(false)
  } else if (window._TCO.currentGlobalSettings.autoStart === 'true') {
    setTimeout(() => toggle.click(), 500);
  }
}

whenElementLoaded(document.body, 'player-controls__right-control-group', async _ => {
  await getGlobalSettings()
  cleanUp(false)
  await init(getCurrentVOD())
})

whenUrlChanged(async _ => {
  await getGlobalSettings()
  const oldVideo = window._TCO.currentVOD,
    newVideo = getCurrentVOD()
  if (newVideo === oldVideo)
    return
  cleanUp(false)
  await init(newVideo)
}, false)