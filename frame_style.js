window.TwitchChatOverlay = window.TwitchChatOverlay || {}

window.TwitchChatOverlay.attachFrameStyle = iframe => {
  const style = document.createElement('style')
  style.innerHTML = `
  body.anu-chat-overlay-inner {
    background: none !important;
  }

  body.anu-chat-overlay-inner .channel-leaderboard {
    display: none;
  }

  body.anu-chat-overlay-inner * {
    visibility: hidden;
    background: none;
  }

  body.anu-chat-overlay-inner:hover *,
  body.anu-chat-overlay-inner.drag-hovered * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .chat-list__list-container * {
    visibility: visible;
  }

  body.anu-chat-overlay-inner .chat-list__list-container > * {
    background-color: rgba(0, 0, 0, 0.25);
  }

  body.anu-chat-overlay-inner:hover .chat-list__list-container > *,
  body.anu-chat-overlay-inner.drag-hovered .chat-list__list-container > * {
    background-color: unset;
  }
`
  iframe.contentDocument.head.prepend(style)
  window.TwitchChatOverlay.addClass(iframe.contentDocument.body, 'anu-chat-overlay-inner')
}