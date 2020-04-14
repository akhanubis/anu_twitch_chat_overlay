module.exports = text => {
  const loader = document.createElement('div')
  loader.className = 'loader'
  loader.innerHTML = `
    <div class="inner">
      <div class="loader-text">
        ${ text }
      </div>
      <div class="tw-loading-spinner tw-loading-spinner--delay" style="animation-delay: 300ms;"><div class="tw-loading-spinner__circle tw-loading-spinner__circle--inherit-color tw-loading-spinner__circle--large"></div></div>
    </div>
  `
  return loader
}