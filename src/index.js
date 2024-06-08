require('./tco')
const { cleanUp, createChatOverlay, toggleChatOverlay } = require('./chat_overlay')
const createToggle = require('./toggle')
const { whenElementLoaded, whenUrlChanged, whenKeybindPressed } = require('./observer')
const { debounce, doOnIntervalWithTimeoutAndOverwrite } = require('./func_utils')
const { getSettings, getGlobalSettings } = require('./settings')
const { getCurrentStream, forcedVOD, getCurrentVOD } = require('./current_page')
const setupAutoClaimManager = require('./claim_points')

let enabled, cleanupKeybind

const playerButtonClass = 'player-controls__right-control-group'

const init = async (currentStream, currentVOD) => {
  window._TCO.currentStream = currentStream
  window._TCO.currentVOD = currentVOD
  await getGlobalSettings()
  await getSettings()
  cleanUp()
  if (cleanupKeybind) cleanupKeybind()

  const useIFrame = !Boolean(currentVOD) && !forcedVOD()

  setupAutoClaimManager()

  const toggle = createToggle()
  toggle.onclick = () => {
    enabled = !enabled
    toggleChatOverlay(useIFrame, enabled)
  }
  document.querySelector('.video-player__overlay .player-controls__right-control-group').prepend(toggle)

  cleanupKeybind = whenKeybindPressed(() => toggle.click())

  console.info(`Anu Twitch Chat Overlay initialized for ${currentStream}${currentVOD && `\'s VOD ${currentVOD}`}`)

  if (enabled) {/* was enabled before the video switch */
    createChatOverlay(useIFrame)
  } else if (window._TCO.currentGlobalSettings.autoStart === 'true') {
    setTimeout(() => toggle.click(), 500);
  }
}

const isPlayerButtonLoaded = () => Boolean(document.querySelector(`.${playerButtonClass}`))
// Factors to take into account when setting these values:
// - if debounceDuration <= checkInterval then there is a risk for debouncedInit to be called after the debouncedDuration was elapsed.
// - raising debouncedDuration increases the time it takes ATCO to init
// - reducing checkInterval increases the amount of DOM checks, should be fine though 
const debouncedInit = debounce(init, 300)
const checkIfPlayerButtonLoaded = doOnIntervalWithTimeoutAndOverwrite(isPlayerButtonLoaded, 300, 4000)

whenElementLoaded(document.body, playerButtonClass, async _ => {
  const currentStream = await getCurrentStream()
  const currentVOD = getCurrentVOD()

  if (currentStream) {
    debouncedInit(currentStream, currentVOD)
  }
})


whenUrlChanged(async _ => {
  const currentStream = await getCurrentStream()
  const currentVOD = getCurrentVOD()

  if (currentStream && currentStream !== window._TCO.currentStream || currentVOD !== window._TCO.currentVOD) {
    const isLoaded = await checkIfPlayerButtonLoaded()
    if (isLoaded) {
      debouncedInit(currentStream, currentVOD)
    }
  }
}, false)