window.TwitchChatOverlay = window.TwitchChatOverlay || {}

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
  
  dragState.initialX = clientX - dragState.xOffset
  dragState.initialY = clientY - dragState.yOffset

  if (e.target === dragState.anchor || dragState.anchor.contains(e.target)) {
    dragState.active = true
    window.TwitchChatOverlay.addClass(document.body, 'dragging-chat')
  }
}

const dragEnd = dragState => {
  dragState.active = false
  window.TwitchChatOverlay.removeClass(document.body, 'dragging-chat')
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
  currentX = clientX - dragState.initialX
  currentY = clientY - dragState.initialY

  dragState.xOffset = currentX
  dragState.yOffset = currentY

  dragState.dragged.style.transform = `translate3d(${ currentX }px, ${ currentY }px, 0)`
}

window.TwitchChatOverlay.makeDraggable = (element, container) => {
  const anchor = document.createElement('div')
  anchor.className = 'drag-anchor'
  anchor.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M 16 1.5859375 L 10.292969 7.2929688 L 11.707031 8.7070312 L 15 5.4140625 L 15 15 L 5.4140625 15 L 8.7070312 11.707031 L 7.2929688 10.292969 L 1.5859375 16 L 7.2929688 21.707031 L 8.7070312 20.292969 L 5.4140625 17 L 15 17 L 15 26.585938 L 11.707031 23.292969 L 10.292969 24.707031 L 16 30.414062 L 21.707031 24.707031 L 20.292969 23.292969 L 17 26.585938 L 17 17 L 26.585938 17 L 23.292969 20.292969 L 24.707031 21.707031 L 30.414062 16 L 24.707031 10.292969 L 23.292969 11.707031 L 26.585938 15 L 17 15 L 17 5.4140625 L 20.292969 8.7070312 L 21.707031 7.2929688 L 16 1.5859375 z"/>
  </svg>
`
  element.prepend(anchor)

  const innerFrame = element.querySelector('iframe')
  anchor.addEventListener('mouseover', _ => window.TwitchChatOverlay.addClass(innerFrame.contentDocument.body, 'drag-hovered'))
  anchor.addEventListener('mouseout', _ => window.TwitchChatOverlay.removeClass(innerFrame.contentDocument.body, 'drag-hovered'))

  const dragState = {
    dragged: element,
    anchor: anchor,
    active: false,
    xOffset: 0,
    yOffset: 0
  }
  container.addEventListener("touchstart", dragStart.bind(this, dragState), false)
  container.addEventListener("touchend", dragEnd.bind(this, dragState), false)
  container.addEventListener("touchmove", drag.bind(this, dragState), false)
  container.addEventListener("mousedown", dragStart.bind(this, dragState), false)
  container.addEventListener("mouseup", dragEnd.bind(this, dragState), false)
  container.addEventListener("mousemove", drag.bind(this, dragState), false)
}

window.TwitchChatOverlay.unmakeDraggable = (element, container) => {
  element.removeChild(element.querySelector('.drag-anchor'))
  element.style.transform = ""
  container.removeEventListener("touchstart", dragStart)
  container.removeEventListener("touchend", dragEnd)
  container.removeEventListener("touchmove", drag)
  container.removeEventListener("mousedown", dragStart)
  container.removeEventListener("mouseup", dragEnd)
  container.removeEventListener("mousemove", drag)
}