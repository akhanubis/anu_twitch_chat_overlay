module.exports = onLoad => {
  const iframe = document.createElement('iframe')
  iframe.style = 'display: none'
  iframe.addEventListener('load', onLoad)
  iframe.setAttribute('width', '100%') 
  iframe.setAttribute('height', '100%')
  iframe.src = `https://twitch.tv/popout/${ window._TCO.currentStream }/chat`
  return iframe
}