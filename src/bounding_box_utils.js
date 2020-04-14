const boundingBoxToStyle = (container, element, minX, minY, maxX, maxY) => {
  const containerWidth = container.clientWidth,
        containerHeight = container.clientHeight
  
  element.style.left = `${ 100 * minX / containerWidth }%`
  element.style.right = `${ 100 * (1 - maxX / containerWidth) }%`
  element.style.top = `${ 100 * minY / containerHeight }%`
  element.style.bottom = `${ 100 * (1 - maxY / containerHeight) }%`
}

module.exports = {
  boundingBoxToStyle
}