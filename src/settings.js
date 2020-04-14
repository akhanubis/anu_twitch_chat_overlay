const { styleToSettings, STYLE_ATTRS } = require('./frame_style')

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
    position: styleToSettings({
      left: '0%',
      right: '75%',
      top: '25%',
      bottom: '25%'
    }, STYLE_ATTRS.POSITION),
    background: styleToSettings({
      'background-color': 'rgba(0, 0, 0, 0.25)'
    }, STYLE_ATTRS.BACKGROUND),
    font: styleToSettings({
      'font-weight': 'inherit',
      'font-size': 'inherit',
      color: 'inherit',
      'font-family': 'inherit',
      'text-shadow': '-1px -1px 0 #000000, 1px -1px 0 #000000, 1px 1px 0 #000000, -1px 1px 0 #000000'
    }, STYLE_ATTRS.FONT)
  }
  
  const storedSettings = await new Promise(r => chrome.storage.sync.get(['default', window._TCO.currentStream], r))
  window._TCO.currentSettings = {}
  for (const s in DEFAULT_SETTINGS)
    window._TCO.currentSettings[s] = (storedSettings[window._TCO.currentStream] || {})[s] || (storedSettings.default || {})[s] || DEFAULT_SETTINGS[s]
  console.log('Twitch Chat Overlay last settings', window._TCO.currentSettings)
}

module.exports = {
  setSettings,
  getSettings
}