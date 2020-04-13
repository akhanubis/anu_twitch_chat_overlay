const makeDraggable = require('./draggable')
const makeResizable = require('./resizable')
const createHeader = require('./header')
const createLoader = require('./loader')
const { applyStyle, positionToStyle } = require('./frame_style')

module.exports = settings => {
  const container = document.createElement('div'),
        mouseEventsContainer = document.querySelector('.video-player__overlay')
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
  applyStyle(container, {
    ...positionToStyle(settings.position)
  })
  makeResizable(container, mouseEventsContainer)
  makeDraggable(container, mouseEventsContainer, container.querySelector('.header'), container.querySelectorAll('.settings, .settings *'))
  return container
}