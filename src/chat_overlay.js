// TODO Reduce code duplication by abstracting some of the logic

require('./tco')
const { addClass, removeClass, hasClass } = require('./class_utils')
const { isInChatRoom, joinChatRoom } = require('./chat_room')
const createChatContainer = require('./chat_container')
const createIframe = require('./iframe')
const { attachBaseStyle, STYLE_ATTRS, applyBackground, applyFont, applyToggles, settingsToStyle, styleToSettings } = require('./frame_style')
const { whenClassToggled } = require('./observer')
const { setSettings } = require('./settings')
const makeDraggable = require('./draggable')
const makeResizable = require('./resizable')
const { isVOD, isRightColumnClosed, toggleRightColumn, isTogglingRightColumn } = require('./current_page')


const enable = _ => addClass(document.body, 'anu-chat-overlay-active')
const disable = _ => removeClass(document.body, 'anu-chat-overlay-active')

let appendTo,
    chatContainer,
    chatElement,
    initialParent

const createIFrameChatOverlay = () => {
    const appendToParent = document.querySelector('.video-player__overlay')
    chatContainer = createChatContainer()
    appendTo = document.createElement('div')
    iframe = createIframe(_ => {
        const mouseEventsContainer = document.querySelector('.video-player__overlay')
        makeResizable(chatContainer, mouseEventsContainer, iframe)
        makeDraggable(chatContainer, mouseEventsContainer, chatContainer.querySelector('.header'), {
            onDragEnd: _ => setSettings('position', styleToSettings(chatContainer.style, STYLE_ATTRS.POSITION)),
            excludedElements: chatContainer.querySelectorAll('.settings, .settings *')
        })

        attachBaseStyle(iframe.contentDocument.body)
        iframe.style = ''
        removeClass(chatContainer, 'loading')
        const html = document.querySelector('html'),
            iframeHtml = iframe.contentDocument.querySelector('html'),
            darkThemeClass = 'tw-root--theme-dark'
        whenClassToggled(html, darkThemeClass, _ => {
            if (hasClass(html, darkThemeClass))
                addClass(iframeHtml, darkThemeClass)
            else
                removeClass(iframeHtml, darkThemeClass)
        })
    })

    chatContainer.addEventListener('mouseenter', _ => {
        const chatList = iframe.contentDocument.body.querySelector('.chat-list--default')
        if (chatList)
            chatList.scrollTop = chatList.scrollHeight
    })
    chatContainer.addEventListener('mouseover', _ => addClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.addEventListener('mouseout', _ => removeClass(iframe.contentDocument.body, 'hovered'))
    chatContainer.append(iframe)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)
}

const attachTo = (element, newParent) => {
    element.parentNode.removeChild(element)
    newParent.append(element)
}

const createNativeChatOverlay = () => {
    const appendToParent = document.querySelector('.video-player__overlay')
    chatElement = document.querySelector('.chat-room__content, .video-chat__message-list-wrapper').parentNode
    initialParent = chatElement.parentNode
    addClass(chatElement, 'atco-dettached')
    addClass(chatElement, 'chat-room')
    chatElement.addEventListener('mouseenter', _ => {
        const chatList = chatElement.querySelector('.chat-list--default')
        if (chatList)
            chatList.scrollTop = chatList.scrollHeight
    })
    chatElement.addEventListener('mouseover', _ => addClass(chatElement, 'hovered'))
    chatElement.addEventListener('mouseout', _ => removeClass(chatElement, 'hovered'))

    attachBaseStyle(chatElement)
    appendTo = document.createElement('div')

    chatContainer = createChatContainer()

    if (!isVOD() && !isInChatRoom())
        joinChatRoom()

    removeClass(chatContainer, 'loading')

    attachTo(chatElement, chatContainer)
    appendToParent.append(appendTo)
    appendTo.append(chatContainer)

    applyBackground(settingsToStyle(window._TCO.currentSettings.background, STYLE_ATTRS.BACKGROUND))
    applyFont(settingsToStyle(window._TCO.currentSettings.font, STYLE_ATTRS.FONT))
    applyToggles(settingsToStyle(window._TCO.currentSettings.toggles, STYLE_ATTRS.TOGGLES))

    const mouseEventsContainer = document.querySelector('.video-player__overlay')
    makeResizable(chatContainer, mouseEventsContainer)
    makeDraggable(chatContainer, mouseEventsContainer, chatContainer.querySelector('.header'), {
        onDragEnd: _ => setSettings('position', styleToSettings(chatContainer.style, STYLE_ATTRS.POSITION)),
        excludedElements: chatContainer.querySelectorAll('.settings, .settings *')
    })
}

const toggleIFrameChatOverlay = (toEnable) => {
    if (!chatContainer)
        createIFrameChatOverlay()
    if (toEnable) {
        enable()
        if (!isTogglingRightColumn() && window._TCO.currentGlobalSettings.autoCloseRightColumn === 'true' && !isRightColumnClosed()) {
            toggleRightColumn()
        }
    } else {
        disable()
    }
}

const toggleNativeChatOverlay = (toEnable) => {
    if (!chatContainer)
        createNativeChatOverlay()
    if (toEnable) {
        enable();
        if (!isTogglingRightColumn() && window._TCO.currentGlobalSettings.autoCloseRightColumn === 'true' && !isRightColumnClosed()) {
            toggleRightColumn()
        }
    } else {
        disable()
    }
    attachTo(chatElement, toEnable ? chatContainer : initialParent)
}

const cleanUp = _ => {
    if (chatElement) {
        attachTo(chatElement, initialParent)
        chatElement = undefined
    }
    for (const p of document.querySelectorAll('.video-player__overlay .tco-modal, .atco-injected-style'))
        p.remove()
    for (const p of document.querySelectorAll('#anu-chat-overlay-toggle'))
        p.remove()
    if (appendTo) {
        appendTo.remove()
        console.info('Anu Twitch Chat Overlay cleaned up')
    }
}

const createChatOverlay = (useIFrameOverlay) => {
    if (useIFrameOverlay) {
        createIFrameChatOverlay()
    } else {
        createNativeChatOverlay()
    }
}

const toggleChatOverlay = (useIFrameOverlay, toEnable) => {
    if (useIFrameOverlay) {
        toggleIFrameChatOverlay(toEnable)
    } else {
        toggleNativeChatOverlay(toEnable)
    }
}

module.exports = {
    createChatOverlay,
    toggleChatOverlay,
    cleanUp,
}