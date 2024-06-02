const forcedVOD = _ => {
  const queryParams = new URLSearchParams(window.location.search)
  const force_vod_param = queryParams.get('force_vod')
  return (force_vod_param || window._TCO.currentGlobalSettings.forceVod) === 'true'
}

const streamFromUrl = url => {
  if (url.match(/clips\.twitch\.tv/))
    return
  const streamName = ((url.match(/\.tv\/([a-zA-Z0-9_]+)/) || [])[1] || '').toLowerCase()
  if (streamName !== 'videos')
    return streamName
}

const getCurrentStream = _ => streamFromUrl(window.location.href)

const getCurrentVOD = _ => {
  const vod = (window.location.href.match(/\.tv\/videos\/([0-9]+)/) || [])[1]
  if (vod)
    return vod
  if (forcedVOD())
    return streamFromUrl(window.location.href)
  return ''
}

const getStreamFromVOD = _ => {
  if (forcedVOD() && !(window._TCO.currentVOD || '').match(/^[0-9]+$/))
    return streamFromUrl(window.location.href)
  return new Promise(r => {
    const interval = setInterval(_ => {
      const header = document.querySelector('a[data-test-selector="ChannelLink"]')
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
  getStreamFromVOD,
  forcedVOD
}