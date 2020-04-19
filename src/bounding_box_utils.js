const boundingBoxToStyle = (container, element, minX, minY, maxX, maxY) => {
  const containerWidth = container.clientWidth,
        containerHeight = container.clientHeight
  
  element.style.left = `${ Math.min(95, Math.max(0, 100 * minX / containerWidth)) }%`
  element.style.right = `${ Math.min(95, Math.max(0, 100 * (1 - maxX / containerWidth))) }%`
  element.style.top = `${ Math.min(95, Math.max(0, 100 * minY / containerHeight)) }%`
  element.style.bottom = `${ Math.min(95, Math.max(0, 100 * (1 - maxY / containerHeight))) }%`
}

module.exports = {
  boundingBoxToStyle
}