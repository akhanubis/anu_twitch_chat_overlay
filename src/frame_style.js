const { addClass } = require('./class_utils')

const attachFrameStyle = iframe => {
  const style = document.createElement('style')
  style.id = 'tco-base-style'
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
    padding-bottom: 0 !important;
    margin-bottom: -5px;
    color: white;
  }

  body.anu-chat-overlay-inner.hovered .simplebar-content {
    color: inherit;
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

const STYLE_ATTRS = {
  POSITION: ['left', 'right', 'top', 'bottom'],
  FONT: ['font-weight', 'font-size', 'color', 'font-family', 'text-shadow'],
  BACKGROUND: ['background-color']
}

const settingsToStyle = (settings, attrNames) => {
  const attrs = settings.split('_'),
        out = {}
  for (let i = 0; i < attrNames.length; i++)
    out[attrNames[i]] = attrs[i]
  return out
} 

const styleToSettings = (style, attrNames) => attrNames.map(attr => style[attr]).join('_')

const applyStyle = (body, id, selector, style) => {
  const fullId = `tco-style-${ id }`,
        css = `${ selector } {${Object.entries(style).map(([property, value]) => `${ property }: ${ value };`).join('')}}`
  let existingStyleNode = body.querySelector(`style#${ fullId }`)
  if (!existingStyleNode) {
    existingStyleNode = document.createElement('style')
    existingStyleNode.id = fullId
    body.append(existingStyleNode)
  }
  existingStyleNode.innerHTML = css
  console.log("STYLE APLICADO", css)
}

const iframeBody = _ => document.querySelector('.anu-chat-overlay-container iframe').contentDocument.body

const applyBackground = backgroundStyle => applyStyle(iframeBody(), 'simplebarBackground', 'body.anu-chat-overlay-inner .simplebar-content', backgroundStyle)

const applyFont = fontStyle => applyStyle(iframeBody(), 'chatFontStyle', 'body.anu-chat-overlay-inner:not(.hovered) .chat-list__list-container .chat-line__message', fontStyle)

module.exports = {
  attachFrameStyle,
  settingsToStyle,
  styleToSettings,
  applyStyle,
  applyBackground,
  applyFont,
  STYLE_ATTRS
}