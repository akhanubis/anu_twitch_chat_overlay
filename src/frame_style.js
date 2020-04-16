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
  FONT: ['color', 'text-shadow', 'font-weight', 'font-family', 'font-size'],
  BACKGROUND: ['background-color'],
  TOGGLES: ['username']
}

const SETTINGS_TO_STYLE_FN = {
  'text-shadow': v => `-1px -1px 0 ${ v }, 1px -1px 0 ${ v }, 1px 1px 0 ${ v }, -1px 1px 0 ${ v }`
}

const STYLE_TO_SETTINGS_FN = {
  'text-shadow': v => v.match(/(rgba\([^)]+\))/)[1]
}

const TOGGLES_SELECTORS = {
  username: '.chat-line__message > *:nth-child(-n+3)'
}

const settingsToStyle = (settings, attrNames, { raw } = { raw: false }) => {
  const attrs = settings.split('_'),
        out = {},
        rawFn = v => v
  for (let i = 0; i < attrNames.length; i++) {
    const fn = raw ? rawFn : (SETTINGS_TO_STYLE_FN[attrNames[i]] || rawFn)
    out[attrNames[i]] = fn(attrs[i])
  }
  
  return out
}

const styleToSettings = (style, attrNames) => attrNames.map(attr => (STYLE_TO_SETTINGS_FN[attr] || (v => v))(style[attr])).join('_')

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

const applyFont = fontStyle => {
  const fullStyle = { ...fontStyle, 'line-height': `calc(${ fontStyle['font-size'] } * 5 / 3)` }
  applyStyle(iframeBody(), 'chatFontStyle', 'body.anu-chat-overlay-inner:not(.hovered) .chat-list__list-container .chat-line__message', fullStyle)
}

const applyToggles = toggles => {
  for (const t in toggles)
    applyStyle(iframeBody(), `toggleStyle-${ t }`, TOGGLES_SELECTORS[t], toggles[t] ? {} : { display: 'none' })
}

module.exports = {
  attachFrameStyle,
  settingsToStyle,
  styleToSettings,
  applyStyle,
  applyBackground,
  applyFont,
  applyToggles,
  STYLE_ATTRS,
  SETTINGS_TO_STYLE_FN,
  STYLE_TO_SETTINGS_FN
}