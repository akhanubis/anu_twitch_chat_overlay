const { applyBackground, applyFont, applyToggles, settingsToStyle, STYLE_ATTRS } = require('./frame_style')

module.exports = onLoad => {
  const iframe = document.createElement('iframe')
  iframe.style = 'display: none'
  iframe.addEventListener('load', _ => {
    onLoad()
    applyBackground(settingsToStyle(window._TCO.currentSettings.background, STYLE_ATTRS.BACKGROUND))
    applyFont(settingsToStyle(window._TCO.currentSettings.font, STYLE_ATTRS.FONT))
    applyToggles(settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES))
  })
  iframe.setAttribute('width', '100%') 
  iframe.setAttribute('height', '100%')
  iframe.src = `https://twitch.tv/popout/${ window._TCO.currentStream }/chat`
  return iframe
}