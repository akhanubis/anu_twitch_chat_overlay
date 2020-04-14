const whenElementLoaded = (container, klass, whenFound) => {
  const checkMutations = mutations => {
    for (const m of mutations)
      for (const n of m.addedNodes)
        if (checkForElement(n))
          whenFound()
  }
  
  const checkForElement = node => {
    return (node.classList && Array.from(node.classList).includes(klass)) || (node.children && Array.from(node.children).some(c => checkForElement(c)))
  }
  
  new MutationObserver(checkMutations).observe(container, {
    childList: true,
    subtree: true
  })
  checkMutations([{ addedNodes: container.children }])
}

const whenClassToggled = (element, klass, whenFound) => {
  const checkMutations = mutations => {
    for (const m of mutations) {
      const wasInOld = ` ${ m.oldValue } `.includes(` ${ klass } `),
            isInNew = ` ${ m.target.className } `.includes(` ${ klass } `)
      if ((wasInOld && !isInNew) || (!wasInOld && isInNew)) {
        whenFound()
        break
      }
    }
  }
  
  new MutationObserver(checkMutations).observe(element, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class']
  })
  checkMutations([{ oldValue: "", target: { className: klass } }])
}

module.exports = {
  whenElementLoaded,
  whenClassToggled
}