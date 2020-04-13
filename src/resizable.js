const { addClass, removeClass, hasClass } = require('./class_utils')
const { boundingBoxToStyle } = require('./bounding_box_utils')
const { setSettings } = require('./settings')
const { styleToPosition } = require('./frame_style')

const resizeStart = (resizeState, e) => {
  if (!hasClass(e.target, 'resize-handler'))
    return

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

const resizeEnd = resizeState => {
  if (!resizeState.active)
    return

  resizeState.active = false
  resizeState.left = false
  resizeState.right = false
  resizeState.up = false
  resizeState.down = false

  removeClass(document.body, 'resizing-chat')
  setSettings('position', styleToPosition(resizeState.resized.style))
}

const resize = (resizeState, e) => {
  if (!resizeState.active)
    return

  e.preventDefault()
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

  boundingBoxToStyle(
    resizeState.container,
    resizeState.resized,
    resizeState.initialOffsetX + (resizeState.left ? deltaX : 0),
    resizeState.initialOffsetY + (resizeState.up ? deltaY : 0),
    resizeState.initialOffsetX + resizeState.initialWidth + (resizeState.right ? deltaX : 0),
    resizeState.initialOffsetY + resizeState.initialHeight + (resizeState.down ? deltaY : 0)
  )
}

module.exports = (element, container) => {
  const resizeState = {
    resized: element,
    container: container,
    active: false
  }
  container.addEventListener("touchstart", resizeStart.bind(this, resizeState), false)
  container.addEventListener("touchend", resizeEnd.bind(this, resizeState), false)
  container.addEventListener("touchmove", resize.bind(this, resizeState), false)
  container.addEventListener("mousedown", resizeStart.bind(this, resizeState), false)
  container.addEventListener("mouseup", resizeEnd.bind(this, resizeState), false)
  container.addEventListener("mousemove", resize.bind(this, resizeState), false)
  container.querySelector('*').addEventListener("touchend", resizeEnd.bind(this, resizeState), false)
  container.querySelector('*').addEventListener("mouseup", resizeEnd.bind(this, resizeState), false)
}