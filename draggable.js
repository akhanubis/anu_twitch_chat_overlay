window._TCO.makeDraggable = (element, container, anchor) => {
  const dragStart = (dragState, e) => {
    if (e.target !== dragState.anchor && !dragState.anchor.contains(e.target))
      return
  
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
    window._TCO.addClass(document.body, 'dragging-chat')
  }
  
  const dragEnd = dragState => {
    if (!dragState.active)
      return
  
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
          endY = deltaY + dragState.initialOffsetY
  
    window._TCO.moveToFromCenter(dragState.dragged, dragState.container, endX, endY)
  }

  anchor = anchor || element
  
  const dragState = {
    dragged: element,
    container: container,
    anchor: anchor,
    active: false
  }
  container.addEventListener("touchstart", dragStart.bind(this, dragState), false)
  container.addEventListener("mousedown", dragStart.bind(this, dragState), false)
  container.addEventListener("touchmove", drag.bind(this, dragState), false)
  container.addEventListener("mousemove", drag.bind(this, dragState), false)
  container.addEventListener("touchend", dragEnd.bind(this, dragState), false)
  container.addEventListener("mouseup", dragEnd.bind(this, dragState), false)  
}

window._TCO.moveToFromCenter = (element, container, x, y) => {
  const containerWidth = container.clientWidth,
        containerHeight = container.clientHeight,
        elementWidth = element.clientWidth,
        elementHeight = element.clientHeight
  
  /* out of bounds */
  if (x < 0 || x + elementWidth > containerWidth || y < 0 || y + elementHeight > containerHeight)
    return

  if (x + 0.5 * elementWidth <= 0.5 * containerWidth) {
    element.style.left = `${ 100 * x / containerWidth }%`
    element.style.right = 'unset'
  }
  else {
    element.style.left = 'unset'
    element.style.right = `${ 100 * (1 - (x + elementWidth) / containerWidth) }%`
  }
  if (y + 0.5 * elementHeight <= 0.5 * containerHeight) {
    element.style.top = `${ 100 * y / containerHeight }%`
    element.style.bottom = 'unset'
  }
  else {
    element.style.top = 'unset'
    element.style.bottom = `${ 100 * (1 - (y + elementHeight) / containerHeight) }%`
  }
}