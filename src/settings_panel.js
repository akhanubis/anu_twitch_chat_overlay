const { peepoPainter } = require('./images')

module.exports = _ => {
  const panel = document.createElement('div')
  panel.id = 'tco-settings-modal'
  panel.className = 'modal tco-modal tco-settings-modal micromodal-slide'
  panel.setAttribute('aria-hidden', true)
  panel.innerHTML = `
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="tco-settings-modal-label">
        <header class="header stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-full-width">
          <div class="title tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">
            Overlay Settings
          </div>
          <img class="logo" src="${ peepoPainter }">
        </header>
        <main class="modal__content chat-room tw-flex tw-flex-column tw-flex-grow-1 tw-flex-shrink-1 tw-full-width" id="tco-settings-modal-content">
          <p>
            Try hitting the <code>tab</code> key and notice how the focus stays within the modal itself. Also, <code>esc</code> to close modal.
          </p>
        </main>
        <div class="modal__footer chat-room tw-justify-content-end tw-flex tw-flex-row">
          <div class="tw-mg-l-05">
            <button data-micromodal-close class="tw-align-items-center tw-full-width tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
              <div data-micromodal-close class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                <div data-micromodal-close data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                  Cancel
                </div>
              </div>
            </button>
          </div>
          <div class="tw-mg-l-05">
            <button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
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
  return panel
}