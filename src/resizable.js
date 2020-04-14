const { addClass, removeClass, hasClass } = require('./class_utils')
const { boundingBoxToStyle } = require('./bounding_box_utils')
const { setSettings } = require('./settings')
const { styleToSettings, STYLE_ATTRS } = require('./frame_style')

const resizeStart = (resizeState, e) => {
  if (!hasClass(e.target, 'resize-handler'))
    return
  e.preventDefault()
  e.stopPropagation()

  if (hasClass(e.target, 'resize-left'))
    resizeState.left = true
  else if (hasClass(e.target, 'resize-right'))
    resizeState.right = true

  if (hasClass(e.target, 'resize-top'))
    resizeState.up = true
  else if (hasClass(e.target, 'resize-bottom'))
    resizeState.down = true
  
  resizeState.active = true

  let clientX, clientY
  if (e.type === 'touchstart') {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
  else {
    clientX = e.clientX
    clientY = e.clientY
  }
  
  resizeState.initialX = clientX
  resizeState.initialY = clientY
  resizeState.initialWidth = resizeState.resized.clientWidth
  resizeState.initialHeight = resizeState.resized.clientHeight
  resizeState.initialOffsetX = resizeState.resized.offsetLeft
  resizeState.initialOffsetY = resizeState.resized.offsetTop

  addClass(document.body, 'resizing-chat')
}

const resizeEnd = (resizeState, e) => {
  if (!resizeState.active)
    return
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  resizeState.active = false
  resizeState.left = false
  resizeState.right = false
  resizeState.up = false
  resizeState.down = false

  removeClass(document.body, 'resizing-chat')
  setSettings('position', styleToSettings(resizeState.resized.style, STYLE_ATTRS.POSITION))
}

const resize = (resizeState, e) => {
  if (!resizeState.active)
    return
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  let clientX, clientY
  if (e.type === 'touchmove') {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
  else {
    clientX = e.clientX
    clientY = e.clientY
  }
  const deltaX = clientX - resizeState.initialX,
        deltaY = clientY - resizeState.initialY
  let minX = resizeState.initialOffsetX + (resizeState.left ? deltaX : 0),
      minY = resizeState.initialOffsetY + (resizeState.up ? deltaY : 0),
      maxX = resizeState.initialOffsetX + resizeState.initialWidth + (resizeState.right ? deltaX : 0),
      maxY = resizeState.initialOffsetY + resizeState.initialHeight + (resizeState.down ? deltaY : 0)

  /* handle out of bounds */
  minX = Math.min(Math.max(minX, 0), resizeState.container.clientWidth)
  maxX = Math.min(Math.max(maxX, 0), resizeState.container.clientWidth)
  minY = Math.min(Math.max(minY, 0), resizeState.container.clientHeight)
  maxY = Math.min(Math.max(maxY, 0), resizeState.container.clientHeight)

  boundingBoxToStyle(resizeState.container, resizeState.resized, minX, minY, maxX, maxY)
}

module.exports = (element, container) => {
  const resizeState = {
          resized: element,
          container: container,
          active: false
        }
        container.addEventListener("touchstart", resizeStart.bind(this, resizeState))
        container.addEventListener("mousedown", resizeStart.bind(this, resizeState))
        container.addEventListener("touchmove", resize.bind(this, resizeState))
        container.addEventListener("mousemove", resize.bind(this, resizeState))
        container.addEventListener("touchend", resizeEnd.bind(this, resizeState))
        container.addEventListener("mouseup", resizeEnd.bind(this, resizeState))

        whenOutOfBounds = e => {
          resize(resizeState, e)
          resizeEnd(resizeState, e)
        }
        document.body.addEventListener("touchstart", whenOutOfBounds)
        document.body.addEventListener("mousedown", whenOutOfBounds)
        document.body.addEventListener("touchmove", whenOutOfBounds)
        document.body.addEventListener("mousemove", whenOutOfBounds)
        document.body.addEventListener("touchend", whenOutOfBounds)
        document.body.addEventListener("mouseup", whenOutOfBounds)
}