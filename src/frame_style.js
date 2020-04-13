const { addClass } = require('./class_utils')

const attachFrameStyle = iframe => {
  const style = document.createElement('style')
  style.innerHTML = `
  body.anu-chat-overlay-inner {
    background: none !important;
  }

  body.anu-chat-overlay-inner .stream-chat-header,
  body.anu-chat-overlay-inner .channel-leaderboard,
  body.anu-chat-overlay-inner .simplebar-track.horizontal,
  body.anu-chat-overlay-inner .tw-absolute.tw-full-width.tw-z-above {
    display: none !important;
  }

  body.anu-chat-overlay-inner * {
    visibility: hidden;
  }

  body.anu-chat-overlay-inner.hovered * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .chat-input {
    display: none !important;
  }

  body.anu-chat-overlay-inner.hovered .chat-input {
    display: block !important;
  }

  body.anu-chat-overlay-inner .simplebar-scroll-content {
    margin-bottom: -17px !important;
    margin-right: -17px !important;
    padding-right: 0 !important;
    overflow-x: hidden;
  }

  body.anu-chat-overlay-inner .simplebar-content {
    visibility: visible;
    background-color: rgba(0, 0, 0, 0.25);
    padding-bottom: 0 !important;
    margin-bottom: -5px;
  }

  body.anu-chat-overlay-inner .simplebar-content * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .chat-list__list-container > * {
    padding-left: 5px;
    padding-right: 5px;
  }

  body.anu-chat-overlay-inner.hovered .simplebar-content {
    background-color: unset;
  }

  body.anu-chat-overlay-inner .chat-list__list-container .scrollbar-hacky-hack {
    width: 4000px;
  }
`
  iframe.contentDocument.head.prepend(style)
  addClass(iframe.contentDocument.body, 'anu-chat-overlay-inner')
}

const positionToStyle = position => {
  const [left, right, top, bottom] = position.split('_')
  return {
    left,
    right,
    top,
    bottom
  }
}

const styleToPosition = style => ['left', 'right', 'top', 'bottom'].map(coord => style[coord], '').join('_')

const applyStyle = (element, style) => {
  for (const e of Object.entries(style))
    element.style[e[0]] = e[1]
}

module.exports = {
  attachFrameStyle,
  positionToStyle,
  styleToPosition,
  applyStyle
}