const openAndCloseNativeChatContainer = () => {
  chatCollapser = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]')
  chatCollapser.click()
  setTimeout(function() {
    chatCollapser.click()
  }, 500);
}

const joinChatRoom = () => {
  // TODO find better way to join chat room, we should be able to
  // hook directly into Twitch's callback
  openAndCloseNativeChatContainer()
}

const isInChatRoom = () => {
  // TODO find better way to check, we could already be in the chat room 
  // even though the native chat is closed
  rightColumnCollapsed = document.querySelector('.right-column--collapsed')
  return !rightColumnCollapsed
}

module.exports = {
  joinChatRoom,
  isInChatRoom,
}