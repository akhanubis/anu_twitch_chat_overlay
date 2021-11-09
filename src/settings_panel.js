const MicroModal = require('micromodal').default
const SimpleBar = require('simplebar').default
const { peepoPainter } = require('./images')
const { applyBackground, applyFont, applyToggles, settingsToStyle, styleToSettings, STYLE_ATTRS, SETTINGS_TO_STYLE_FN } = require('./frame_style')
const { setSettings, DEFAULT_SETTINGS, ISSUES_TRACKER_LINK } = require('./settings')
const { whenSizeChanged } = require('./observer')
const { boundingBoxToStyle } = require('./bounding_box_utils')
const makeDraggable = require('./draggable')
const createColorPicker = require('./color_picker')
const { addClass, removeClass } = require('./class_utils')
const createAboutPanel = require('./about_panel')

const FONT_FAMILIES = {
  Default: 'Roobert',
  Monospace: 'monospace',
  'Sans-serif': 'sans-serif',
  'Serif': 'serif',
  Cursive: 'cursive',
  Fantasy: 'fantasy'
}

module.exports = _ => {
  const panel = document.createElement('div')
  panel.id = 'tco-settings-modal'
  panel.className = 'atco-container modal tco-modal tco-settings-modal micromodal-slide'
  panel.setAttribute('aria-hidden', true)
  panel.innerHTML = `
    <div class="modal__overlay" tabindex="-1">
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="tco-settings-modal-label">
        <header class="header stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-full-width">
          <div class="title tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">
            Overlay Settings
          </div>
          <img class="logo" src="${ peepoPainter }">
          <div class="Layout-sc-nxg1ff-0 about-us-icon">
            <div class="ScIconLayout-sc-1bgeryd-0 cOOGTE tw-icon">
              <div class="ScAspectRatio-sc-1sw3lwy-1 bneAWp tw-aspect">
                <div class="ScAspectSpacer-sc-1sw3lwy-0 gMCXS"></div>
                <svg width="100%" height="100%" version="1.1" viewBox="0 0 384 512" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 eOJUoR">
                  <path fill="currentColor" d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>
        <main class="modal__content chat-room tw-flex tw-flex-column tw-flex-grow-1 tw-flex-shrink-1 tw-full-width" id="tco-settings-modal-content">
          <div class="settings-header">
            <div>Settings are synced across your devices and stored on a per stream basis.</div>
            <div>Tip: Keep the chat window to the sides of the screen so you can preview your changes.</div>
          </div>
          <div class="settings-divider settings-main-divider"></div>
          <div class="settings-scroller">
            <div class="settings-row">
              <div class="settings-label">
                Placement
              </div>
              <div class="settings-input-container">
                <div class="settings-input position-input">
                  <div class="viewport-model">
                    <div class="chat-model">
                      <div class="inner"></div>
                    </div>
                  </div>
                </div>
                <div class="settings-tip">You can also drag and resize the chat window directly</div>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Background color
              </div>
              <div class="settings-input-container">
                <div class="background-color-picker"></div>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Auto claim channel points
              </div>
              <div class="settings-input-container autoclaim-toggle">
                <button data-b-value="true" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Enabled
                    </div>
                  </div>
                </button>
                <button data-b-value="false" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Disabled
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Font family
              </div>
              <div class="settings-input-container">
                <select class="font-family-picker tw-block tw-border-radius-medium tw-font-size-6 tw-textarea tw-textarea--no-resize">
                  ${Object.entries(FONT_FAMILIES).map(([label, value]) => `<option value="${ value }">${ label }</option>`)}
                </select>
                <div class="settings-tip">Looking for custom fonts? Ask for them with the <a target="_blank" href="${ ISSUES_TRACKER_LINK }">issues tracker</a></div>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Font size (in px)
              </div>
              <div class="settings-input-container">
                <input type="number" class="font-size-picker tw-block tw-border-radius-medium tw-font-size-6 tw-textarea tw-textarea--no-resize">
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Font color
              </div>
              <div class="settings-input-container">
                <div class="font-color-picker"></div>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Font outline
              </div>
              <div class="settings-input-container">
                <div class="font-outline-color-picker"></div>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Font weight
              </div>
              <div class="settings-input-container font-weight">
                <button data-b-value="normal" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Normal
                    </div>
                  </div>
                </button>
                <button data-b-value="bold" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Bold
                    </div>
                  </div>
                </button>
                <button data-b-value="bolder" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Bolder
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="settings-divider"></div>
            <div class="settings-row">
              <div class="settings-label">
                Hide usernames
              </div>
              <div class="settings-input-container username-toggle">
                <button data-b-value="false" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Enabled
                    </div>
                  </div>
                </button>
                <button data-b-value="true" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Disabled
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
        <div class="modal__footer chat-room">
          <div class="">
            <div class="tw-mg-l-05">
              <button class="default-settings-button tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                  <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                    Reset to default
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div class="right-buttons tw-justify-content-end tw-flex-row">
            <div class="tw-mg-l-05">
              <button class="cancel-settings-button tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                  <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                    Cancel
                  </div>
                </div>
              </button>
            </div>
            <div class="tw-mg-l-05">
              <button class="save-settings-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                  <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                    Apply to ${ window._TCO.currentStream }
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const backgroundColorPicker = createColorPicker(panel.querySelector('.background-color-picker'), color => applyBackground({ 'background-color': SETTINGS_TO_STYLE_FN['background-color'](color) })),
        onFontChange = _ => applyFont({
          'color': fontColorPicker.getColor(),
          'text-shadow': SETTINGS_TO_STYLE_FN['text-shadow'](fontOutlineColorPicker.getColor()),
          'font-weight': currentButton('.font-weight'),
          'font-family': fontFamilyPicker.value,
          'font-size': `${ fontSizePicker.value }px`
        }),
        onToggleChange = _ => applyToggles({
          username: currentButton('.username-toggle')
        }),
        onAutoclaimChange = _ => applyAutoclaim(currentButton('.autoclaim-toggle')),
        fontColorPicker = createColorPicker(panel.querySelector('.font-color-picker'), onFontChange),
        fontOutlineColorPicker = createColorPicker(panel.querySelector('.font-outline-color-picker'), onFontChange),
        fontFamilyPicker = panel.querySelector('.font-family-picker'),
        fontSizePicker = panel.querySelector('.font-size-picker'),
        currentButton = containerSelector => panel.querySelector(`${ containerSelector } button.tw-core-button--primary`).getAttribute('data-b-value')

  const viewportModel = panel.querySelector('.viewport-model'),
        chatModel = panel.querySelector('.chat-model')
    
  const applyPositionToOriginal = style => {
          const chatContainer = document.querySelector('.anu-chat-overlay-container')
          for (const coord of ['left', 'right', 'top', 'bottom'])
            chatContainer.style[coord] = style[coord]
        },
        applyAutoclaim = stringifiedValue => window._TCO.autoClaimManager[stringifiedValue === 'true' ? 'start' : 'stop']()

  whenSizeChanged(chatModel, _ => {
    const minX = Math.min(Math.max(chatModel.offsetLeft, 0), viewportModel.clientWidth),
          maxX = Math.min(Math.max(chatModel.offsetLeft + chatModel.clientWidth, 0), viewportModel.clientWidth),
          minY = Math.min(Math.max(chatModel.offsetTop, 0), viewportModel.clientHeight),
          maxY = Math.min(Math.max(chatModel.offsetTop + chatModel.clientHeight, 0), viewportModel.clientHeight)
    boundingBoxToStyle(viewportModel, chatModel, minX, minY, maxX, maxY)
    chatModel.style.width = ""
    chatModel.style.height = ""
    applyPositionToOriginal(chatModel.style)
  })

  makeDraggable(chatModel, viewportModel, chatModel.querySelector('.inner'), {
    onDrag: _ => applyPositionToOriginal(chatModel.style)
  })

  const weightButtons = panel.querySelectorAll('.font-weight button'),
        usernameButtons = panel.querySelectorAll('.username-toggle button'),
        autoclaimButtons = panel.querySelectorAll('.autoclaim-toggle button'),
        enableSelectedButton = (selected, buttons, onChange) => {
          const currentValue = selected.getAttribute('data-b-value')
          for (const b of buttons) {
            if (b.getAttribute('data-b-value') === currentValue)
              addClass(b, 'tw-core-button--primary')
            else
              removeClass(b, 'tw-core-button--primary')
          }
          if (onChange)
            onChange()
        }

  for (const b of weightButtons)
    b.onclick = _ => enableSelectedButton(b, weightButtons, onFontChange)
  for (const b of usernameButtons)
    b.onclick = _ => enableSelectedButton(b, usernameButtons, onToggleChange)
  for (const b of autoclaimButtons)
    b.onclick = _ => enableSelectedButton(b, autoclaimButtons, onAutoclaimChange)

  fontFamilyPicker.onchange = onFontChange

  fontSizePicker.onchange = onFontChange

  panel.querySelector('.save-settings-button').onclick = _ => {
    MicroModal.close('tco-settings-modal')
    setSettings('background', styleToSettings({ 'background-color': backgroundColorPicker.getColor() }, STYLE_ATTRS.BACKGROUND))
    setSettings('position', styleToSettings(chatModel.style, STYLE_ATTRS.POSITION))
    setSettings('toggles', styleToSettings({
      username: currentButton('.username-toggle'),
      autoclaim: currentButton('.autoclaim-toggle')
    }, STYLE_ATTRS.TOGGLES)),
    setSettings('font', styleToSettings({
      'color': fontColorPicker.getColor(),
      'text-shadow': fontOutlineColorPicker.getColor(),
      'font-weight': currentButton('.font-weight'),
      'font-family': fontFamilyPicker.value,
      'font-size': `${ fontSizePicker.value }px`
    }, STYLE_ATTRS.FONT))
  }

  const rollbackToSettings = settings => {
    applyPositionToOriginal(settingsToStyle(settings.position, STYLE_ATTRS.POSITION))
    applyBackground(settingsToStyle(settings.background, STYLE_ATTRS.BACKGROUND))
    applyFont(settingsToStyle(settings.font, STYLE_ATTRS.FONT))
    applyToggles(settingsToStyle(settings.toggles, STYLE_ATTRS.TOGGLES))
    applyAutoclaim(settingsToStyle(settings.toggles, STYLE_ATTRS.TOGGLES).autoclaim)
  }

  const initInputs = settings => {
    const fontSettings = settingsToStyle(settings.font, STYLE_ATTRS.FONT, { raw: true })
    enableSelectedButton(panel.querySelector(`.font-weight button[data-b-value="${ fontSettings['font-weight'] }"]`), weightButtons)
    enableSelectedButton(panel.querySelector(`.username-toggle button[data-b-value="${ settingsToStyle(settings.toggles, STYLE_ATTRS.TOGGLES).username }"]`), usernameButtons)
    enableSelectedButton(panel.querySelector(`.autoclaim-toggle button[data-b-value="${ settingsToStyle(settings.toggles, STYLE_ATTRS.TOGGLES).autoclaim }"]`), autoclaimButtons)
    fontFamilyPicker.value = fontSettings['font-family']
    fontSizePicker.value = parseFloat(fontSettings['font-size'])
    fontColorPicker.setColor(fontSettings['color'])
    fontOutlineColorPicker.setColor(fontSettings['text-shadow'])
    backgroundColorPicker.setColor(settingsToStyle(settings.background, STYLE_ATTRS.BACKGROUND)['background-color'])

    const chatContainer = document.querySelector('.anu-chat-overlay-container')
    for (const coord of ['left', 'right', 'top', 'bottom'])
      chatModel.style[coord] = chatContainer.style[coord]
  }

  panel.querySelector('.cancel-settings-button').onclick = _ => {
    MicroModal.close('tco-settings-modal')
    rollbackToSettings(window._TCO.currentSettings)
  }

  panel.querySelector('.default-settings-button').onclick = _ => {
    rollbackToSettings(DEFAULT_SETTINGS)
    initInputs(DEFAULT_SETTINGS)
  }

  panel.showPanel = _ => {
    initInputs(window._TCO.currentSettings)
    MicroModal.show('tco-settings-modal')
    panel.querySelector('.save-settings-button').focus()
  }

  document.querySelector('.video-player__overlay').append(panel)
  if (window.chrome && chrome.runtime && chrome.runtime.id) {
    const scroller = panel.querySelector('.settings-scroller')
    new SimpleBar(scroller, {
      autoHide: false
    })
    addClass(scroller, 'overflow-y-hidden')
  }

  const aboutPanel = createAboutPanel()
  panel.querySelector('.about-us-icon').onclick = e => {
    e.preventDefault()
    aboutPanel.showPanel()
  }

  return panel
}