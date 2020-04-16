const MicroModal = require('micromodal').default
const iro = require('@jaames/iro').default
require('iro-transparency-plugin').default
const { peepoPainter } = require('./images')
const { applyBackground, applyFont, settingsToStyle, styleToSettings, STYLE_ATTRS, SETTINGS_TO_STYLE_FN } = require('./frame_style')
const { setSettings } = require('./settings')
const { whenSizeChanged } = require('./observer')
const { boundingBoxToStyle } = require('./bounding_box_utils')
const makeDraggable = require('./draggable')
const createColorPicker = require('./color_picker')
const { addClass, removeClass } = require('./class_utils')

module.exports = _ => {
  const panel = document.createElement('div')
  panel.id = 'tco-settings-modal'
  panel.className = 'modal tco-modal tco-settings-modal micromodal-slide'
  panel.setAttribute('aria-hidden', true)
  panel.innerHTML = `
    <div class="modal__overlay" tabindex="-1">
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="tco-settings-modal-label">
        <header class="header stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-full-width">
          <div class="title tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">
            Overlay Settings
          </div>
          <img class="logo" src="${ peepoPainter }">
        </header>
        <main class="modal__content chat-room tw-flex tw-flex-column tw-flex-grow-1 tw-flex-shrink-1 tw-full-width" id="tco-settings-modal-content">
          <div class="settings-header">
            Tip: Keep the chat window to the sides of the screen so you can preview your changes
          </div>
          <div class="settings-divider"></div>
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
                <button data-weight="normal" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Normal
                    </div>
                  </div>
                </button>
                <button data-weight="bold" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Bold
                    </div>
                  </div>
                </button>
                <button data-weight="bolder" class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                  <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                    <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                      Bolder
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
        <div class="modal__footer chat-room tw-justify-content-end tw-flex tw-flex-row">
          <div class="tw-mg-l-05">
            <button class="cancel-settings-button tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
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
                  Apply
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  const backgroundColorPicker = createColorPicker(panel.querySelector('.background-color-picker'), color => applyBackground({ 'background-color': color })),
        onFontChange = _ => applyFont({
          'color': fontColorPicker.getColor(),
          'text-shadow': SETTINGS_TO_STYLE_FN['text-shadow'](fontOutlineColorPicker.getColor()),
          'font-weight': panel.querySelector('.font-weight button.tw-core-button--primary').getAttribute('data-weight')
        }),
        fontColorPicker = createColorPicker(panel.querySelector('.font-color-picker'), onFontChange),
        fontOutlineColorPicker = createColorPicker(panel.querySelector('.font-outline-color-picker'), onFontChange)

  const viewportModel = panel.querySelector('.viewport-model'),
        chatModel = panel.querySelector('.chat-model')
    
  applyPositionToOriginal = style => {
    const chatContainer = document.querySelector('.anu-chat-overlay-container')
    for (const coord of ['left', 'right', 'top', 'bottom'])
      chatContainer.style[coord] = style[coord]
  }

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
        enableSelectedFontWeight = currentWeight => {
          for (const b of weightButtons) {
            if (b.getAttribute('data-weight') === currentWeight)
              addClass(b, 'tw-core-button--primary')
            else
              removeClass(b, 'tw-core-button--primary')
          }
        }

  for (const b of weightButtons)
    b.onclick = _ => {
      enableSelectedFontWeight(b.getAttribute('data-weight'))
      onFontChange()
    }

  panel.querySelector('.save-settings-button').onclick = _ => {
    MicroModal.close('tco-settings-modal')
    setSettings('background', styleToSettings({ 'background-color': backgroundColorPicker.color.rgbaString }, STYLE_ATTRS.BACKGROUND))
    // setSettings('font', styleToSettings({ 'color': fontColorPicker.color.rgbaString }, STYLE_ATTRS.FONT))
    setSettings('position', styleToSettings(chatModel.style, STYLE_ATTRS.POSITION))
  }

  panel.querySelector('.cancel-settings-button').onclick = _ => {
    MicroModal.close('tco-settings-modal')
    const currentSettings = window._TCO.currentSettings
    applyPositionToOriginal(settingsToStyle(currentSettings.position, STYLE_ATTRS.POSITION))
    applyBackground({ 'background-color': currentSettings.background })
    // applyFont(settingsToStyle(currentSettings.font, STYLE_ATTRS.FONT))
  }

  panel.showPanel = _ => {
    const currentSettings = window._TCO.currentSettings,
          currentFontSettings = settingsToStyle(currentSettings.font, STYLE_ATTRS.FONT, { raw: true })
    enableSelectedFontWeight(currentFontSettings['font-weight'])
    fontColorPicker.setColor(currentFontSettings['color'])
    fontOutlineColorPicker.setColor(currentFontSettings['text-shadow'])
    backgroundColorPicker.setColor(settingsToStyle(currentSettings.background, STYLE_ATTRS.BACKGROUND)['background-color'])

    const chatContainer = document.querySelector('.anu-chat-overlay-container')
    for (const coord of ['left', 'right', 'top', 'bottom'])
      chatModel.style[coord] = chatContainer.style[coord]

    MicroModal.show('tco-settings-modal')
    panel.querySelector('.save-settings-button').focus()
  }

  document.body.append(panel)
  return panel
}