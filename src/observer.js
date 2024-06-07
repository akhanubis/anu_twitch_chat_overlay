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

const whenSizeChanged = (element, whenFound) => {
  const checkMutations = mutations => {
    for (const m of mutations) {
      const oldSize = {
              w: ((m.oldValue || "").match(/(^|(; ))width: ([^;]+);/) || [, , , ""])[3],
              h: ((m.oldValue || "").match(/(^|(; ))height: ([^;]+);/) || [, , , ""])[3]
            },
            newSize = {
              w: m.target.style.width,
              h: m.target.style.height
            }
      if (oldSize.w !== newSize.w || oldSize.h !== newSize.h) {
        whenFound()
        break
      }
    }
  }
  
  new MutationObserver(checkMutations).observe(element, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['style']
  })
  checkMutations([{ oldValue: "", target: element }])
}

const whenUrlChanged = (onChange, triggerOnSetup = false) => {
  /* TODO: use listener instead of timeout */
  let oldUrl = window.location.href
  setInterval(_ => {
    const newUrl = window.location.href
    if (newUrl !== oldUrl) {
      oldUrl = newUrl
      onChange(newUrl)
    }
  }, 1000)
  if (triggerOnSetup)
    onChange(oldUrl)
}

const whenKeybindPressed = (onKeybind) => {
  document.addEventListener('keydown', function(event) {
    if (event.altKey && event.code === 'KeyC') {
        onKeybind();
    }
  });
}

module.exports = {
  whenElementLoaded,
  whenClassToggled,
  whenSizeChanged,
  whenUrlChanged,
  whenKeybindPressed
}