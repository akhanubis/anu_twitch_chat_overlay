const { styleToSettings, STYLE_ATTRS } = require('./frame_style')

const ISSUES_TRACKER_LINK = "https://github.com/akhanubis/anu_twitch_chat_overlay/issues"

const VERSION = "1.0.6"

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
    autoclaim: false,
    timestamp: true
  }, STYLE_ATTRS.TOGGLES)
}

const DEFAULT_GLOBAL_SETTINGS = {
  forceVod: 'false'
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

const setGlobalSettings = (k, v) => {
  if (window._TCO.currentGlobalSettings[k] === v)
    return

  window._TCO.currentGlobalSettings = {
    ...window._TCO.currentGlobalSettings,
    [k]: v
  }
  
  chrome.storage.sync.set({ '__global__': window._TCO.currentGlobalSettings })
}

const getSettings = async _ => {
  const storedSettings = (await new Promise(r => chrome.storage.sync.get(['default', window._TCO.currentStream], r))) || {}
  window._TCO.currentSettings = {}
  for (const s in DEFAULT_SETTINGS)
    window._TCO.currentSettings[s] = (storedSettings[window._TCO.currentStream] || {})[s] || (storedSettings.default || {})[s] || DEFAULT_SETTINGS[s]
  
  /* TEMP fix for old settings with toggle = "true" */
  const bool_toggles = window._TCO.currentSettings.toggles.split('_')
  if (bool_toggles.length < 3)
    window._TCO.currentSettings.toggles = `${ window._TCO.currentSettings.toggles }${ bool_toggles.length == 1 ? '_false' : '' }_true`
}

const getGlobalSettings = async _ => {
  const storedSettings = (await new Promise(r => chrome.storage.sync.get(['__global__'], r))) || {}
  window._TCO.currentGlobalSettings = {}
  for (const s in DEFAULT_GLOBAL_SETTINGS)
    window._TCO.currentGlobalSettings[s] = (storedSettings['__global__'] || {})[s] || DEFAULT_GLOBAL_SETTINGS[s]
}

const getChannelList = async _ => {
  const allSettings = await new Promise(r => chrome.storage.sync.get(null, r))
  const channelList = ['default']
  
  for (const key in allSettings) {
    if (key !== 'default' && key !== '__global__' && typeof allSettings[key] === 'object') {
      channelList.push(key)
    }
  }
  
  return channelList.sort()
}

const getChannelSettings = async (channel) => {
  if (channel === 'default') {
    return { ...DEFAULT_SETTINGS }
  }
  
  const storedSettings = await new Promise(r => chrome.storage.sync.get([channel], r))
  return { ...DEFAULT_SETTINGS, ...(storedSettings[channel] || {}) }
}

const saveChannelSettings = async (channel, settings) => {
  if (channel === 'default') {
    // Save to default and current channel
    await chrome.storage.sync.set({
      default: settings,
      [window._TCO.currentStream]: settings
    })
  } else {
    await chrome.storage.sync.set({ [channel]: settings })
  }
}

const deleteChannelSettings = async (channel) => {
  if (channel !== 'default') {
    await chrome.storage.sync.remove(channel)
  }
}

module.exports = {
  setSettings,
  setGlobalSettings,
  getSettings,
  getGlobalSettings,
  getChannelList,
  getChannelSettings,
  saveChannelSettings,
  deleteChannelSettings,
  DEFAULT_SETTINGS,
  DEFAULT_GLOBAL_SETTINGS,
  ISSUES_TRACKER_LINK,
  VERSION
}