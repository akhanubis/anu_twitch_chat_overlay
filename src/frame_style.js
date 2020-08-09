const { addClass } = require('./class_utils')

const attachBaseStyle = element => {
  const style = document.createElement('style')
  style.id = 'tco-base-style'
  addClass(style, 'atco-injected-style')
  style.innerHTML = `
  .anu-chat-overlay-inner {
    background: none !important;
  }

  .anu-chat-overlay-inner .stream-chat-header,
  .anu-chat-overlay-inner .channel-leaderboard,
  .anu-chat-overlay-inner .simplebar-track.horizontal,
  .anu-chat-overlay-inner .tw-absolute.tw-full-width.tw-z-above {
    display: none !important;
  }

  .anu-chat-overlay-inner * {
    visibility: hidden;
  }

  .anu-chat-overlay-inner.hovered * {
    visibility: visible;
  }

  .anu-chat-overlay-inner .chat-input {
    display: none !important;
  }

  .anu-chat-overlay-inner.hovered .chat-input {
    display: block !important;
  }

  .anu-chat-overlay-inner .simplebar-scroll-content {
    margin-bottom: -17px !important;
    margin-right: -17px !important;
    padding-right: 0 !important;
    overflow-x: hidden;
  }

  .anu-chat-overlay-inner .simplebar-content {
    visibility: visible;
    padding-bottom: 0 !important;
    margin-bottom: -5px;
    color: white;
  }

  .anu-chat-overlay-inner.hovered .simplebar-content {
    color: inherit;
  }

  .anu-chat-overlay-inner .simplebar-content * {
    visibility: visible;
  }

  .anu-chat-overlay-inner .chat-list > * {
    padding-left: 0;
    padding-right: 0;
  }

  .anu-chat-overlay-inner.hovered .simplebar-content {
    background-color: unset;
  }

  .anu-chat-overlay-inner .chat-list .scrollbar-hacky-hack {
    width: 4000px;
  }

  .anu-chat-overlay-inner:not(.hovered) .chat-list .chat-line__message .tw-elevation-1 {
    box-shadow: none !important;
  }

  .anu-chat-overlay-inner:not(.hovered) .chat-list .chat-line__message .tw-elevation-1 .tw-c-background-base {
    background-color: rgba(0, 0, 0, 0) !important;
  }
`
  element.append(style)
  addClass(element, 'anu-chat-overlay-inner')
}

const STYLE_ATTRS = {
  POSITION: ['left', 'right', 'top', 'bottom'],
  FONT: ['color', 'text-shadow', 'font-weight', 'font-family', 'font-size'],
  BACKGROUND: ['background-color'],
  TOGGLES: ['username', 'autoclaim']
}

const SETTINGS_TO_STYLE_FN = {
  'text-shadow': v => `-1px -1px 0 ${ v }, 1px -1px 0 ${ v }, 1px 1px 0 ${ v }, -1px 1px 0 ${ v }`,
  'background-color': v => `${ v } !important`
}

const STYLE_TO_SETTINGS_FN = {
  'text-shadow': v => v.match(/(rgba\([^)]+\))/)[1],
  'background-color': v => v.replace(' !important', '')
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
    addClass(existingStyleNode, 'atco-injected-style')
    body.append(existingStyleNode)
  }
  existingStyleNode.innerHTML = css
}

const iframeBody = _ => document.querySelector('.anu-chat-overlay-container .atco-dettached') || document.querySelector('.anu-chat-overlay-container iframe').contentDocument.body

const applyBackground = backgroundStyle => applyStyle(iframeBody(), 'simplebarBackground', 'body.anu-chat-overlay-inner .simplebar-content, body.anu-chat-overlay-inner .simplebar-content .tw-c-background-alt, .anu-chat-overlay-container .atco-dettached .video-chat__message-list-wrapper', backgroundStyle)

const applyFont = fontStyle => {
  const fullStyle = { ...fontStyle, 'line-height': `calc(${ fontStyle['font-size'] } * 5 / 3)` }
  applyStyle(iframeBody(), 'chatFontStyle', 'body.anu-chat-overlay-inner:not(.hovered) .chat-list .chat-line__message, .anu-chat-overlay-container .atco-dettached .video-chat__message-list-wrapper .vod-message', fullStyle)
}

const applyToggles = toggles => {
  for (const t in TOGGLES_SELECTORS)
    applyStyle(iframeBody(), `toggleStyle-${ t }`, TOGGLES_SELECTORS[t], toggles[t] === 'true' ? {} : { display: 'none' })
}

module.exports = {
  attachBaseStyle,
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