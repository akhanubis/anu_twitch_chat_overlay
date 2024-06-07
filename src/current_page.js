const forcedVOD = _ => {
  const queryParams = new URLSearchParams(window.location.search)
  const force_vod_param = queryParams.get('force_vod')
  return (force_vod_param || window._TCO.currentGlobalSettings.forceVod) === 'true'
}

const getVODId = () => {
  return (window.location.href.match(/\.tv\/videos\/([0-9]+)/) || [])[1]
}

const isRealVOD = () => {
  return Boolean(getVODId())
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
  const vod_id = getVODId()
  if (vod_id)
    return vod_id
  if (forcedVOD())
    return streamFromUrl(window.location.href)
  return ''
}

const getStreamFromVOD = _ => {
  if (forcedVOD() && !(window._TCO.currentVOD || '').match(/^[0-9]+$/))
    return streamFromUrl(window.location.href)
  return new Promise(r => {
    const interval = setInterval(_ => {
      const channel_profile_pic_link = document.querySelector('.channel-info-content #live-channel-stream-information a')
      if (channel_profile_pic_link && channel_profile_pic_link.href) {
        clearInterval(interval)
        r(streamFromUrl(channel_profile_pic_link.href))
      }
    }, 500)
  })
}

const inVOD = _ => !!getCurrentVOD()

const isRightColumnClosed = () => {
  return Boolean(document.querySelector('.right-column--collapsed'))
}

// Hacky way to prevent double toggling when autoCloseRightColumn is true
let isTogglingRightColumn = false;

const toggleRightColumn = () => {
  rightColumnToggle = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]')
  rightColumnToggle.click()
}

const openAndCloseRightColumn = () => {
  isTogglingRightColumn = true;
  rightColumnToggle = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]')
  rightColumnToggle.click()
  setTimeout(function() {
    rightColumnToggle.click()
    isTogglingRightColumn = false;
  }, 500);
}

module.exports = {
  inVOD,
  isRealVOD,
  getCurrentStream,
  getCurrentVOD,
  getStreamFromVOD,
  forcedVOD,
  isRightColumnClosed,
  isTogglingRightColumn: () => isTogglingRightColumn,
  toggleRightColumn,
  openAndCloseRightColumn,
}