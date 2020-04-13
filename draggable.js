const dragStart = (dragState, e) => {
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

  if (e.target === dragState.anchor || dragState.anchor.contains(e.target)) {
    dragState.active = true
    window._TCO.addClass(document.body, 'dragging-chat')
  }
}

const dragEnd = dragState => {
  dragState.active = false
  window._TCO.removeClass(document.body, 'dragging-chat')
  window._TCO.setSettings('position', window._TCO.styleToPosition(dragState.dragged.style))
}

const drag = (dragState, e) => {
  if (!dragState.active)
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
  const deltaX = clientX - dragState.initialX,
        deltaY = clientY - dragState.initialY,
        endX = deltaX + dragState.initialOffsetX,
        endY = deltaY + dragState.initialOffsetY,
        containerWidth = dragState.container.clientWidth,
        containerHeight = dragState.container.clientHeight,
        draggedWidth = dragState.dragged.clientWidth,
        draggedHeight = dragState.dragged.clientHeight

  /* out of bounds */
  if (endX < 0 || endX + dragState.dragged.clientWidth > dragState.container.clientWidth || endY < 0 || endY + dragState.dragged.clientHeight > dragState.container.clientHeight)
    return

  if (endX + 0.5 * draggedWidth <= 0.5 * containerWidth) {
    dragState.dragged.style.left = `${ 100 * endX / containerWidth }%`
    dragState.dragged.style.right = 'unset'
  }
  else {
    dragState.dragged.style.left = 'unset'
    dragState.dragged.style.right = `${ 100 * (1 - (endX + draggedWidth) / containerWidth) }%`
  }
  if (endY + 0.5 * draggedHeight <= 0.5 * containerHeight) {
    dragState.dragged.style.top = `${ 100 * endY / containerHeight }%`
    dragState.dragged.style.bottom = 'unset'
  }
  else {
    dragState.dragged.style.top = 'unset'
    dragState.dragged.style.bottom = `${ 100 * (1 - (endY + draggedHeight) / containerHeight) }%`
  }
}

window._TCO.makeDraggable = (element, container) => {
  const anchor = element.querySelector('.drag-anchor'),
        innerFrame = element.querySelector('iframe')
  element.addEventListener('mouseover', _ => window._TCO.addClass(innerFrame.contentDocument.body, 'hovered'))
  element.addEventListener('mouseout', _ => window._TCO.removeClass(innerFrame.contentDocument.body, 'hovered'))

  const dragState = {
    dragged: element,
    container: container,
    anchor: anchor,
    active: false
  }
  container.addEventListener("touchstart", dragStart.bind(this, dragState), false)
  container.addEventListener("touchend", dragEnd.bind(this, dragState), false)
  container.addEventListener("touchmove", drag.bind(this, dragState), false)
  container.addEventListener("mousedown", dragStart.bind(this, dragState), false)
  container.addEventListener("mouseup", dragEnd.bind(this, dragState), false)
  container.addEventListener("mousemove", drag.bind(this, dragState), false)
}