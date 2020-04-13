window._TCO.header = _ => {
  const header = document.createElement('div')
  header.className = 'header stream-chat-header tw-align-items-center tw-border-b tw-c-background-base tw-flex-shrink-0 tw-full-width tw-justify-content-center tw-pd-l-1 tw-pd-r-1'
  header.innerHTML = `
    <div class="title tw-c-text-alt tw-font-size-6 tw-semibold tw-upcase">
      CHAT
    </div>
    <div class="drag-anchor" aria-describedby="anu-chat-overlay-drag-tooltip">
      <button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" aria-label="Move">
        <span class="tw-button-icon__icon">
          <div style="width: 2rem; height: 2rem;">
            <div class="tw-align-items-center tw-full-width tw-icon tw-icon--fill tw-inline-flex">
              <div class="tw-aspect tw-aspect--align-top">
                <div class="tw-aspect__spacer" style="padding-bottom: 100%;"></div>
                <svg class="tw-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 32 32" x="0px" y="0px"><g><path d="M 16 1.5859375 L 10.292969 7.2929688 L 11.707031 8.7070312 L 15 5.4140625 L 15 15 L 5.4140625 15 L 8.7070312 11.707031 L 7.2929688 10.292969 L 1.5859375 16 L 7.2929688 21.707031 L 8.7070312 20.292969 L 5.4140625 17 L 15 17 L 15 26.585938 L 11.707031 23.292969 L 10.292969 24.707031 L 16 30.414062 L 21.707031 24.707031 L 20.292969 23.292969 L 17 26.585938 L 17 17 L 26.585938 17 L 23.292969 20.292969 L 24.707031 21.707031 L 30.414062 16 L 24.707031 10.292969 L 23.292969 11.707031 L 26.585938 15 L 17 15 L 17 5.4140625 L 20.292969 8.7070312 L 21.707031 7.2929688 L 16 1.5859375 z"/></g></svg>
              </div>
            </div>
          </div>
        </span>
      </button>
      <div class="tw-tooltip tw-tooltip--align-right tw-tooltip--down" data-a-target="tw-tooltip-label" role="tooltip" id="anu-chat-overlay-drag-tooltip">Move</div>
    </div>
    <div class="settings" aria-describedby="anu-chat-overlay-settings-tooltip">
      <button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" aria-label="Settings">
        <span class="tw-button-icon__icon">
          <div style="width: 2rem; height: 2rem;">
            <div class="tw-align-items-center tw-full-width tw-icon tw-icon--fill tw-inline-flex">
              <div class="tw-aspect tw-aspect--align-top">
                <div class="tw-aspect__spacer" style="padding-bottom: 100%;"></div>
                <svg class="tw-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M10 8a2 2 0 100 4 2 2 0 000-4z"></path><path fill-rule="evenodd" d="M9 2h2a2.01 2.01 0 001.235 1.855l.53.22a2.01 2.01 0 002.185-.439l1.414 1.414a2.01 2.01 0 00-.439 2.185l.22.53A2.01 2.01 0 0018 9v2a2.01 2.01 0 00-1.855 1.235l-.22.53a2.01 2.01 0 00.44 2.185l-1.415 1.414a2.01 2.01 0 00-2.184-.439l-.531.22A2.01 2.01 0 0011 18H9a2.01 2.01 0 00-1.235-1.854l-.53-.22a2.009 2.009 0 00-2.185.438L3.636 14.95a2.009 2.009 0 00.438-2.184l-.22-.531A2.01 2.01 0 002 11V9c.809 0 1.545-.487 1.854-1.235l.22-.53a2.009 2.009 0 00-.438-2.185L5.05 3.636a2.01 2.01 0 002.185.438l.53-.22A2.01 2.01 0 009 2zm-4 8l1.464 3.536L10 15l3.535-1.464L15 10l-1.465-3.536L10 5 6.464 6.464 5 10z" clip-rule="evenodd"></path></g></svg>
              </div>
            </div>
          </div>
        </span>
      </button>
      <div class="tw-tooltip tw-tooltip--align-left tw-tooltip--down" data-a-target="tw-tooltip-label" role="tooltip" id="anu-chat-overlay-settings-tooltip">Settings</div>
    </div>
  `

  const settingsButton = header.querySelector('.settings')
  settingsButton.onclick = _ => {
    console.log("open settings")
  }
  return header
}