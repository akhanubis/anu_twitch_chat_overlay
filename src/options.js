require('./tco')
const { getGlobalSettings, setGlobalSettings } = require('./settings')

const init = async _ => {
  await getGlobalSettings()
  setInterval(_ => document.querySelector('#DEBUG').innerHTML = JSON.stringify(window._TCO.currentGlobalSettings), 1000)
  const force_vod_checkbox = document.querySelector('#force_vod')
  force_vod_checkbox.addEventListener('change', e => {
    setGlobalSettings('forceVod', e.target.checked ? 'true' : 'false')
  })

  force_vod_checkbox.checked = window._TCO.currentGlobalSettings.forceVod === 'true'
}

document.addEventListener('DOMContentLoaded', init)