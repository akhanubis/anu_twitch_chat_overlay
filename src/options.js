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

  const auto_close_chat_checkbox = document.querySelector('#auto_close_right_column')
  auto_close_chat_checkbox.addEventListener('change', e => {
    setGlobalSettings('autoCloseRightColumn', e.target.checked ? 'true' : 'false')
  })
  auto_close_chat_checkbox.checked = window._TCO.currentGlobalSettings.autoCloseRightColumn === 'true'


  const auto_start_checkbox = document.querySelector('#auto_start')
  auto_start_checkbox.addEventListener('change', e => {
    setGlobalSettings('autoStart', e.target.checked ? 'true' : 'false')
  })
  auto_start_checkbox.checked = window._TCO.currentGlobalSettings.autoStart === 'true'
}

document.addEventListener('DOMContentLoaded', init)