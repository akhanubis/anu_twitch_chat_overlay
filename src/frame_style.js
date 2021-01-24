const { addClass } = require('./class_utils')

const attachBaseStyle = element => {
  const style = document.createElement('style')
  style.id = 'tco-base-style'
  addClass(style, 'atco-injected-style')
  style.innerHTML = `
  .anu-chat-overlay-inner:not(.hovered) {
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

  .anu-chat-overlay-inner:not(.atco-dettached):not(.hovered) .chat-input, /* live */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .chat-input /* live force vod */
  {
    display: none !important;
  }

  .anu-chat-overlay-inner .simplebar-scroll-content {
    margin-bottom: -17px !important;
    margin-right: -17px !important;
    padding-right: 0 !important;
    overflow-x: hidden;
  }

  .anu-chat-overlay-inner .simplebar-content,
  .anu-chat-overlay-inner.atco-dettached
   {
    visibility: visible;
    padding-bottom: 0 !important;
    margin-bottom: -5px;
  }

  .anu-chat-overlay-inner.hovered .simplebar-content,
  .anu-chat-overlay-inner.hovered.atco-dettached {
    color: inherit;
  }

  .anu-chat-overlay-inner .simplebar-content *,
  .anu-chat-overlay-inner.atco-dettached * {
    visibility: visible;
  }

  .anu-chat-overlay-container .anu-chat-overlay-inner.atco-dettached:not(.hovered) {
    background-color: transparent !important;
  }

  .anu-chat-overlay-inner.atco-dettached {
    background-color: var(--color-background-base) !important;
  }

  .anu-chat-overlay-inner .chat-list--default > * {
    padding-left: 0;
    padding-right: 0;
  }

  .anu-chat-overlay-inner.hovered .simplebar-content {
    background-color: unset;
  }

  .anu-chat-overlay-inner .chat-list--default .scrollbar-hacky-hack {
    width: 4000px;
  }

  .anu-chat-overlay-inner:not(.hovered) .chat-list--default .chat-line__message .tw-elevation-1 {
    box-shadow: none !important;
  }

  .anu-chat-overlay-inner:not(.hovered) .chat-list--default .chat-line__message .tw-elevation-1 .tw-c-background-base {
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

const applyBackground = backgroundStyle => applyStyle(iframeBody(), 'simplebarBackground', `
  .anu-chat-overlay-inner:not(.atco-dettached):not(.hovered) .simplebar-content, /* live */
  .anu-chat-overlay-inner:not(.atco-dettached):not(.hovered) .simplebar-content .tw-c-background-alt, /* live */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .simplebar-content, /* live force vod */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .simplebar-content .tw-c-background-alt, /* live force vod */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .video-chat__message-list-wrapper, /* vod */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .video-chat__message-list-wrapper .tw-c-background-alt /* vod */
  `, backgroundStyle)

const applyFont = fontStyle => {
  const fullStyle = { ...fontStyle, 'line-height': `calc(${ fontStyle['font-size'] } * 5 / 3)` }
  applyStyle(iframeBody(), 'chatFontStyle', `
  .anu-chat-overlay-inner:not(.atco-dettached):not(.hovered) .chat-list--default .chat-line__message, /* live */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .chat-list--default .chat-line__message, /* live force vod */
  .anu-chat-overlay-container .atco-dettached:not(.hovered) .video-chat__message-list-wrapper .vod-message /* vod */
  `, fullStyle)
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