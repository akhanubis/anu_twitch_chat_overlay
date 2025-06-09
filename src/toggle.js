module.exports = _ => {
  const ENABLED_ICON_PATH = 'M 3 6 L 3 26 L 12.585938 26 L 16 29.414063 L 19.414063 26 L 29 26 L 29 6 Z M 5 8 L 27 8 L 27 24 L 18.585938 24 L 16 26.585938 L 13.414063 24 L 5 24 Z M 9 11 L 9 13 L 23 13 L 23 11 Z M 9 15 L 9 17 L 23 17 L 23 15 Z M 9 19 L 9 21 L 19 21 L 19 19 Z',
        DISABLED_ICON_PATH = 'M 3 5 L 3 23 L 8 23 L 8 28.078125 L 14.351563 23 L 29 23 L 29 5 Z M 5 7 L 27 7 L 27 21 L 13.648438 21 L 10 23.917969 L 10 21 L 5 21 Z',
        toggle = document.createElement('div')
  toggle.id = "anu-chat-overlay-toggle"
  toggle.className = 'Layout-sc-1xcs6mc-0'
  toggle.innerHTML = `
   <div class="Layout-sc-1xcs6mc-0" aria-label="Anu Chat Overlay" role="tooltip" data-microtip-position="top">
      <div class="InjectLayout-sc-1i43xsx-0 iDMNUO">
         <div class="Layout-sc-1xcs6mc-0 ScLayoutCssVars-sc-1pn65j5-0 jfyitl gaSyOh">
            <button class="ScCoreButton-sc-ocjdkq-0 bhSCzT ScButtonIcon-sc-9yap0r-0 exrGQc">
               <div class="ButtonIconFigure-sc-1emm8lf-0 lnTwMD">
                  <div class="ScIconLayout-sc-1q25cff-0 kjQOIz">
                     <div class="ScAspectRatio-sc-18km980-1 jgpfbi tw-aspect">
                        <div class="ScAspectSpacer-sc-18km980-0 dYMszt"></div>
                        <svg width="100%" height="100%" version="1.1" viewBox="0 0 32 32" x="0px" y="0px" class="ScIconSVG-sc-1q25cff-1 jpczqG">
                          <g>
                            <path class="active" fill-rule="evenodd" d="${ ENABLED_ICON_PATH }" clip-rule="evenodd"></path>
                            <path class="inactive" fill-rule="evenodd" d="${ DISABLED_ICON_PATH }" clip-rule="evenodd"></path>
                          </g>
                        </svg>
                     </div>
                  </div>
               </div>
            </button>
         </div>
      </div>
   </div>
  `
  return toggle
}