window._TCO.setSettings = (k, v) => {
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

window._TCO.getSettings = async _ => {
  const DEFAULT_SETTINGS = {
    position: window._TCO.styleToPosition({
      left: '-10px',
      right: 'unset',
      top: '100px',
      bottom: 'unset'
    })
  }
  const storedSettings = await new Promise(r => chrome.storage.sync.get(['default', window._TCO.currentStream], r))
  return window._TCO.currentSettings = storedSettings[window._TCO.currentStream] || storedSettings.default || DEFAULT_SETTINGS
}