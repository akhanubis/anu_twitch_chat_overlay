const { settingsToStyle, STYLE_ATTRS } = require('./frame_style')

const claim = _ => {
  const button = document.querySelector('.claimable-bonus__icon')
  if (button)
    button.click()
}

module.exports = _ => {
  let timer
  window._TCO.autoClaimManager = {
    start: _ => {
      clearInterval(timer)
      timer = setInterval(claim, 1000)
    },
    stop: _ => clearInterval(timer)
  }
  const initialState = settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES).autoclaim
  if (initialState === 'true')
    window._TCO.autoClaimManager.start()
}