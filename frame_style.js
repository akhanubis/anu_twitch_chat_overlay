window._TCO.attachFrameStyle = iframe => {
  const style = document.createElement('style')
  style.innerHTML = `
  body.anu-chat-overlay-inner {
    background: none !important;
  }

  body.anu-chat-overlay-inner .channel-leaderboard,
  body.anu-chat-overlay-inner .tw-absolute.tw-full-width.tw-z-above {
    display: none;
  }

  body.anu-chat-overlay-inner * {
    visibility: hidden;
  }

  body.anu-chat-overlay-inner:hover *,
  body.anu-chat-overlay-inner.drag-hovered * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .simplebar-content {
    visibility: visible;
    background-color: rgba(0, 0, 0, 0.25);
    padding-bottom: 0 !important;
    margin-bottom: -5px;
    margin-left: 10px;
    margin-right: 10px;
  }

  body.anu-chat-overlay-inner .simplebar-content * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .chat-list__list-container > * {
    padding-left: 0;
    padding-right: 0;
  }

  body.anu-chat-overlay-inner:hover .simplebar-content,
  body.anu-chat-overlay-inner.drag-hovered .simplebar-content {
    background-color: unset;
  }
`
  iframe.contentDocument.head.prepend(style)
  window._TCO.addClass(iframe.contentDocument.body, 'anu-chat-overlay-inner')
}

window._TCO.positionToStyle = position => {
  const [left, right, top, bottom] = position.split('_')
  return {
    left,
    right,
    top,
    bottom
  }
}

window._TCO.styleToPosition = style => ['left', 'right', 'top', 'bottom'].map(coord => style[coord], '').join('_')

window._TCO.applyStyle = (element, style) => {
  for (const e of Object.entries(style))
    element.style[e[0]] = e[1]
}