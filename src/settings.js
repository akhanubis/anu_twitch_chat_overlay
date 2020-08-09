const { styleToSettings, STYLE_ATTRS } = require('./frame_style')

const ISSUES_TRACKER_LINK = "https://github.com/akhanubis/twitch_chat_overlay_issues/issues"

const VERSION = "0.2.6"

const DEFAULT_SETTINGS = {
  position: styleToSettings({
    left: '75%',
    right: '0%',
    top: '10%',
    bottom: '10%'
  }, STYLE_ATTRS.POSITION),
  background: styleToSettings({
    'background-color': 'rgba(0, 0, 0, 0.25) !important'
  }, STYLE_ATTRS.BACKGROUND),
  font: styleToSettings({
    'font-weight': 'normal',
    'font-size': '12px',
    color: 'rgba(255, 255, 255, 1)',
    'font-family': 'Roobert',
    'text-shadow': 'rgba(0, 0, 0, 1)'
  }, STYLE_ATTRS.FONT),
  toggles: styleToSettings({
    username: true,
    autoclaim: false
  }, STYLE_ATTRS.TOGGLES)
}

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
  const storedSettings = (await new Promise(r => chrome.storage.sync.get(['default', window._TCO.currentStream], r))) || {}
  window._TCO.currentSettings = {}
  for (const s in DEFAULT_SETTINGS)
    window._TCO.currentSettings[s] = (storedSettings[window._TCO.currentStream] || {})[s] || (storedSettings.default || {})[s] || DEFAULT_SETTINGS[s]
  /* TEMP fix for old settings with toggle = "true" */
  if (['true', 'false'].includes(window._TCO.currentSettings.toggles))
    window._TCO.currentSettings.toggles = `${ window._TCO.currentSettings.toggles }_false`
}

module.exports = {
  setSettings,
  getSettings,
  DEFAULT_SETTINGS,
  ISSUES_TRACKER_LINK,
  VERSION
}