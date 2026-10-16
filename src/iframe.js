const { applyBackground, applyFont, applyToggles, settingsToStyle, STYLE_ATTRS } = require('./frame_style')
const { install7tvSupport } = require('./7tv')

module.exports = onLoad => {
  const iframe = document.createElement('iframe')
  iframe.style = 'display: none'
  iframe.addEventListener('load', async _ => {
    onLoad()
    applyBackground(settingsToStyle(window._TCO.currentSettings.background, STYLE_ATTRS.BACKGROUND))
    applyFont(settingsToStyle(window._TCO.currentSettings.font, STYLE_ATTRS.FONT))
    applyToggles(settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES))

    try {
      if (iframe.contentDocument) {
        const toggles = settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES)
        if (toggles.seventv === 'true') {
          await install7tvSupport(iframe.contentDocument)
        }
      }
    } catch (err) {
      console.warn('7TV install failed:', err)
    }
  })
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '100%')
  iframe.src = `https://twitch.tv/popout/${ window._TCO.currentStream }/chat`
  return iframe
}
