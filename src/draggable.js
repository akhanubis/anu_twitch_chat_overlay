const { addClass, removeClass } = require('./class_utils')
const { boundingBoxToStyle } = require('./bounding_box_utils')
const { setSettings } = require('./settings')
const { styleToPosition } = require('./frame_style')

const dragStart = (dragState, e) => {
  if (dragState.excludedElements.includes(e.target))
    return
  if (e.target !== dragState.anchor && !dragState.anchor.contains(e.target))
    return
  e.preventDefault()
  e.stopPropagation()

  let clientX, clientY
  if (e.type === 'touchstart') {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
  else {
    clientX = e.clientX
    clientY = e.clientY
  }
  
  dragState.initialX = clientX
  dragState.initialY = clientY
  dragState.initialOffsetX = dragState.dragged.offsetLeft
  dragState.initialOffsetY = dragState.dragged.offsetTop

  dragState.active = true
  addClass(document.body, 'dragging-chat')
}

const dragEnd = (dragState, e) => {
  if (!dragState.active)
    return
  e.preventDefault()
  e.stopPropagation()

  dragState.active = false
  removeClass(document.body, 'dragging-chat')
  setSettings('position', styleToPosition(dragState.dragged.style))
}

const drag = (dragState, e) => {
  if (!dragState.active)
    return
  e.preventDefault()
  e.stopPropagation()

  let clientX, clientY
  if (e.type === 'touchmove') {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
  else {
    clientX = e.clientX
    clientY = e.clientY
  }
  const deltaX = clientX - dragState.initialX,
        deltaY = clientY - dragState.initialY
  let endX = deltaX + dragState.initialOffsetX,
      endY = deltaY + dragState.initialOffsetY

  /* handle out of bounds */
  endX = Math.min(Math.max(endX, 0), dragState.container.clientWidth - dragState.dragged.clientWidth)
  endY = Math.min(Math.max(endY, 0), dragState.container.clientHeight - dragState.dragged.clientHeight)

  boundingBoxToStyle(dragState.container, dragState.dragged, endX, endY, endX + dragState.dragged.clientWidth, endY + dragState.dragged.clientHeight)
}

module.exports = (element, container, anchor, excludedElements) => {
  const dragState = {
          dragged: element,
          container: container,
          anchor: anchor,
          active: false,
          excludedElements: Array.from(excludedElements)
        }
  container.addEventListener("touchstart", dragStart.bind(this, dragState))
  container.addEventListener("mousedown", dragStart.bind(this, dragState))
  container.addEventListener("touchmove", drag.bind(this, dragState))
  container.addEventListener("mousemove", drag.bind(this, dragState))
  container.addEventListener("touchend", dragEnd.bind(this, dragState))
  container.addEventListener("mouseup", dragEnd.bind(this, dragState))

  whenOutOfBounds = e => {
    drag(dragState, e)
    dragEnd(dragState, e)
  }
  document.body.addEventListener("touchstart", whenOutOfBounds)
  document.body.addEventListener("mousedown", whenOutOfBounds)
  document.body.addEventListener("touchmove", whenOutOfBounds)
  document.body.addEventListener("mousemove", whenOutOfBounds)
  document.body.addEventListener("touchend", whenOutOfBounds)
  document.body.addEventListener("mouseup", whenOutOfBounds)
}