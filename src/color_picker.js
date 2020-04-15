const iro = require('@jaames/iro').default
require('iro-transparency-plugin').default

module.exports = (element, onChange) => {
  const colorPicker = new iro.ColorPicker(element, {
    transparency: true,
    wheelLightness: false,
    layoutDirection: 'horizontal',
    width: 100,
    height: 100
  })

  colorPicker.on('color:change', color => onChange(color.rgbaString))

  colorPicker.setColor = color => colorPicker.color.rgbaString = color

  colorPicker.getColor = _ => colorPicker.color.rgbaString

  return colorPicker
}