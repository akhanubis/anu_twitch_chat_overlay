const createHeader = require('./header')
const createLoader = require('./loader')
const { settingsToStyle, STYLE_ATTRS } = require('./frame_style')

module.exports = _ => {
  const container = document.createElement('div')
  container.className = 'anu-chat-overlay-container loading'
  container.innerHTML = `
    <div class="resize-handler resize-left"></div>
    <div class="resize-handler resize-right"></div>
    <div class="resize-handler resize-top"></div>
    <div class="resize-handler resize-bottom"></div>
    <div class="resize-handler resize-left resize-bottom"></div>
    <div class="resize-handler resize-left resize-top"></div>
    <div class="resize-handler resize-right resize-bottom"></div>
    <div class="resize-handler resize-right resize-top"></div>
  `
  container.append(createHeader(), createLoader('Loading chat'))
  
  const initialStyle = settingsToStyle(window._TCO.currentSettings.position, STYLE_ATTRS.POSITION)
  for (const coord of ['left', 'right', 'top', 'bottom'])
    container.style[coord] = initialStyle[coord]
  return container
}