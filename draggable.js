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
  
    window._TCO.BoundingBoxToStyle(dragState.container, dragState.dragged, endX, endY, endX + dragState.dragged.clientWidth, endY + dragState.dragged.clientHeight)
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

window._TCO.BoundingBoxToStyle = (container, element, minX, minY, maxX, maxY) => {
  const containerWidth = container.clientWidth,
        containerHeight = container.clientHeight
  
  /* out of bounds */
  if (minX < 0 || maxX > containerWidth || minY < 0 || maxY > containerHeight)
    return

  element.style.left = `${ 100 * minX / containerWidth }%`
  element.style.right = `${ 100 * (1 - maxX / containerWidth) }%`
  element.style.top = `${ 100 * minY / containerHeight }%`
  element.style.bottom = `${ 100 * (1 - maxY / containerHeight) }%`
}