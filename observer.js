window._TCO.whenElementLoaded = (container, klass, whenFound) => {
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