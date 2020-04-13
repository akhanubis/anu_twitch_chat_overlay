const { styleToPosition } = require('./frame_style')

const setSettings = (k, v) => {
  if (window._TCO.currentSettings[k] === v)
    return

  window._TCO.currentSettings = {
    ...window._TCO.currentSettings,
    [k]: v
  }
  
  chrome.storage.sync.set({
    default: window._TCO.currentSettings,
    [window._TCO.currentStream]: window._TCO.currentSettings
  })
}

const getSettings = async _ => {
  const DEFAULT_SETTINGS = {
    position: styleToPosition({
      left: '0%',
      right: '25%',
      top: '25%',
      bottom: '25%'
    })
  }
  
  const storedSettings = await new Promise(r => chrome.storage.sync.get(['default', window._TCO.currentStream], r))
  return window._TCO.currentSettings = storedSettings[window._TCO.currentStream] || storedSettings.default || DEFAULT_SETTINGS
}

module.exports = {
  setSettings,
  getSettings
}