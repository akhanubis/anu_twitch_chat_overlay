const forcedVOD = _ => {
  const queryParams = new URLSearchParams(window.location.search)
  return queryParams.get('force_vod')
}

const streamFromUrl = url => {
  const streamName = ((url.match(/\.tv\/([a-zA-Z0-9_]+)/) || [])[1] || '').toLowerCase()
  if (streamName !== 'videos')
    return streamName
}

const getCurrentStream = _ => streamFromUrl(window.location.href)

const getCurrentVOD = _ => forcedVOD() ? streamFromUrl(window.location.href) : ((window.location.href.match(/\.tv\/videos\/([0-9]+)/) || [])[1] || '')

const getStreamFromVOD = _ => {
  if (forcedVOD())
    return streamFromUrl(window.location.href)
  return new Promise(r => {
    const interval = setInterval(_ => {
      const header = document.querySelector('.channel-info-content a.tw-interactive:not(.tw-link)')
      if (header && header.href) {
        clearInterval(interval)
        r(streamFromUrl(header.href))
      }
    }, 500)
  })
}

const inVOD = _ => !!getCurrentVOD()

module.exports = {
  inVOD,
  getCurrentStream,
  getCurrentVOD,
  getStreamFromVOD
}