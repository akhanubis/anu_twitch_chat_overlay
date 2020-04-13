window._TCO.makeResizable = (element, container, excludedElements) => {
  const resizeStart = (resizeState, e) => {
    if (!resizeState.resized.contains(e.target) || resizeState.excludedElements.includes(e.target))
      return
  
    if (e.offsetX >= element.clientWidth - 4)
      resizeState.direction = 'right'
    else if (e.offsetX <= 4)
      resizeState.direction = 'left'
    else
      return
    
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

    window._TCO.addClass(document.body, 'resizing-chat')
  }
  
  const resizeEnd = resizeState => {
    if (!resizeState.active)
      return
  
    resizeState.active = false
    resizeState.horizontal = false
    resizeState.vertical = false
    window._TCO.removeClass(document.body, 'resizing-chat')
    window._TCO.setSettings('position', window._TCO.styleToPosition(resizeState.resized.style))
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
  
    if (['right', 'left'].includes(resizeState.direction))
      window._TCO.BoundingBoxToStyle(resizeState.container, resizeState.resized, resizeState.initialOffsetX + (resizeState.direction === 'left' ? deltaX : 0), resizeState.initialOffsetY, resizeState.initialOffsetX + resizeState.initialWidth + (resizeState.direction === 'right' ? deltaX : 0), resizeState.initialOffsetY + resizeState.initialHeight)
    else
      /* TODO: vertical */
      return
  }

  const resizeState = {
    resized: element,
    container: container,
    active: false,
    horizontal: false,
    vertical: false,
    excludedElements: excludedElements
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