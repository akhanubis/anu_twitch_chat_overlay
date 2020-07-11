module.exports = (text, image) => {
  const loader = document.createElement('div')
  loader.className = 'loader'
  loader.innerHTML = `
    <div class="inner">
      <div class="loader-text">
        ${ text }
      </div>
      <div class="loader-image">
        <img src="${ image }">
      </div>
    </div>
  `
  return loader
}