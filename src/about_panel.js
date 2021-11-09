const MicroModal = require('micromodal').default
const { ISSUES_TRACKER_LINK, VERSION } = require('./settings')
const { peepoLove, peepoWeird } = require('./images')

module.exports = _ => {
  const panel = document.createElement('div')
  panel.id = 'tco-about-modal'
  panel.className = 'atco-container modal tco-modal tco-about-modal micromodal-slide'
  panel.setAttribute('aria-hidden', true)
  panel.innerHTML = `
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="tco-about-modal-label">
        <header class="header stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-full-width">
          <div class="title tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">
            About ATCO
          </div>
          <img class="logo" src="${ peepoWeird }">
        </header>
        <main class="modal__content chat-room tw-flex tw-flex-column tw-flex-grow-1 tw-flex-shrink-1 tw-full-width" id="tco-about-modal-content">
          <p>Made with <img class="inline-image" src="${ peepoLove }" alt="love"> during quarantine by <a href="https://github.com/akhanubis" target="_blank">akhanubis</a></p>
          <p>Any questioners? Any feedbackers in the chat? Head out to the <a href="${ ISSUES_TRACKER_LINK }">issues tracker</a>
        </main>
        <div class="modal__footer chat-room">
          <div class="version-label">Version ${ VERSION }</div>
          <div class="right-buttons tw-justify-content-end tw-flex-row">
            <div class="tw-mg-l-05">
              <button class="close-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
                  <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">
                    Close
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  panel.querySelector('.close-button').onclick = _ => MicroModal.close('tco-about-modal')
  panel.showPanel = _ => MicroModal.show('tco-about-modal')

  document.querySelector('.video-player__overlay').append(panel)
  return panel
}