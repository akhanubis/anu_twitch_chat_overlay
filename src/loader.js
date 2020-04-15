module.exports = text => {
  const loader = document.createElement('div')
  loader.className = 'loader'
  loader.innerHTML = `
    <div class="inner">
      <div class="loader-text">
        ${ text }
      </div>
      <div class="loader-image">
        <img src="https://cdn.betterttv.net/emote/5e37903f61ff6b51e652837c/2x">
      </div>
    </div>
  `
  return loader
}