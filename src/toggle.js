
module.exports = _ => {
  const ENABLED_ICON_PATH = 'M 3 6 L 3 26 L 12.585938 26 L 16 29.414063 L 19.414063 26 L 29 26 L 29 6 Z M 5 8 L 27 8 L 27 24 L 18.585938 24 L 16 26.585938 L 13.414063 24 L 5 24 Z M 9 11 L 9 13 L 23 13 L 23 11 Z M 9 15 L 9 17 L 23 17 L 23 15 Z M 9 19 L 9 21 L 19 21 L 19 19 Z',
        DISABLED_ICON_PATH = 'M 3 5 L 3 23 L 8 23 L 8 28.078125 L 14.351563 23 L 29 23 L 29 5 Z M 5 7 L 27 7 L 27 21 L 13.648438 21 L 10 23.917969 L 10 21 L 5 21 Z',
        toggle = document.createElement('div')
  toggle.id = "anu-chat-overlay-toggle"
  toggle.className = 'Layout-sc-nxg1ff-0 ScAttachedTooltipWrapper-sc-v8mg6d-0 ggANPd'
  toggle.setAttribute('aria-describedby', 'anu-chat-overlay-toggle-tooltip')
  toggle.innerHTML = `
    <button class="ScCoreButton-sc-1qn4ixc-0 inkhfW ScButtonIcon-sc-o7ndmn-0 iIdEOY" aria-label="Anu Chat Overlay">
      <div class="ScButtonIconFigure-sc-o7ndmn-1 gakSVk">
        <div class="ScIconLayout-sc-1bgeryd-0 kbOjdP tw-icon">
          <div class="ScAspectRatio-sc-1sw3lwy-1 dNNaBC tw-aspect">
            <div class="ScAspectSpacer-sc-1sw3lwy-0 gkBhyN"></div>
            <svg width="100%" height="100%" version="1.1" viewBox="0 0 32 32" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU">
              <g>
                <path class="active" fill-rule="evenodd" d="${ ENABLED_ICON_PATH }" clip-rule="evenodd"></path>
                <path class="inactive" fill-rule="evenodd" d="${ DISABLED_ICON_PATH }" clip-rule="evenodd"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </button>
    <div class="ScAttachedTooltip-sc-v8mg6d-1 czcJg tw-tooltip" data-a-target="tw-tooltip-label" role="tooltip" id="anu-chat-overlay-toggle-tooltip" direction="top">Anu Chat Overlay</div>
  `
  return toggle
}