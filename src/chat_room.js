const { isRightColumnClosed, openAndCloseRightColumn } = require('./current_page')

const joinChatRoom = () => {
  // TODO find better way to join chat room, we should be able to
  // hook directly into Twitch's callback
  openAndCloseRightColumn()
}

const isInChatRoom = () => {
  // TODO find better way to check, we could already be in the chat room 
  // even though the native chat is closed
  return !isRightColumnClosed()
}

module.exports = {
  joinChatRoom,
  isInChatRoom,
}