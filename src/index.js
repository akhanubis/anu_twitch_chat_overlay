require('./tco')
const { cleanUp, createChatOverlay, toggleChatOverlay } = require('./chat_overlay')
const createToggle = require('./toggle')
const { whenElementLoaded, whenUrlChanged, whenKeybindPressed } = require('./observer')
const { getSettings, getGlobalSettings } = require('./settings')
const { getCurrentStream, forcedVOD, getCurrentVOD } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

let enabled

const init = async (currentStream, currentVOD) => {
  await getGlobalSettings()
  await getSettings()
  cleanUp()

  const useIFrame = Boolean(currentVOD) || forcedVOD()

  setupAutoClaimManager()

  const toggle = createToggle()
  toggle.onclick = () => {
    enabled = !enabled
    toggleChatOverlay(useIFrame, enabled)
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group').prepend(toggle)

  whenKeybindPressed(() => toggle.click())

  console.info(`Anu Twitch Chat Overlay initialized for ${currentStream}${currentVOD && `\'s VOD ${currentVOD}`}`)

  if (enabled) {/* was enabled before the video switch */
    createChatOverlay(useIFrame)
  } else if (window._TCO.currentGlobalSettings.autoStart === 'true') {
    setTimeout(() => toggle.click(), 500);
  }
}

whenElementLoaded(document.body, 'player-controls__right-control-group', async _ => {
  const currentStream = await getCurrentStream()
  const currentVOD = getCurrentVOD()
  window._TCO.currentStream = currentStream
  window._TCO.currentVOD = currentVOD
  await init(currentStream, currentVOD)
})

whenUrlChanged(async _ => {
  const currentStream = await getCurrentStream()
  const currentVOD = getCurrentVOD()

  if (currentStream && currentStream !== window._TCO.currentStream || currentVOD !== window._TCO.currentVOD) {
    window._TCO.currentStream = currentStream
    window._TCO.currentVOD = currentVOD
    await init(currentStream, currentVOD)
  }
}, false)