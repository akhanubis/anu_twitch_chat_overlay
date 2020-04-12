window._TCO.loader = text => `
  <div class="loader">
    <div class="inner">
      <div>
        ${ text }
      </div>
      <div class="tw-loading-spinner tw-loading-spinner--delay" style="animation-delay: 300ms;"><div class="tw-loading-spinner__circle tw-loading-spinner__circle--inherit-color tw-loading-spinner__circle--large"></div></div>
    </div>
  </div>
`