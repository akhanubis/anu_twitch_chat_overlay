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
  window.TwitchChatOverlay.addClass(iframe.contentDocument.body, 'anu-chat-overlay-inner')
}