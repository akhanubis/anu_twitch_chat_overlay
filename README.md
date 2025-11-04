# Anu Twitch Chat Overlay

A Chrome/Firefox extension that displays Twitch chat on top of the stream player, allowing you to read chat, send messages, claim points, and more without leaving fullscreen mode.

## Latest Updates

### Version 1.0.7 (Contributed by tzii)

#### 🆕 New Features
- **Per-Channel Settings**: Save different chat configurations for each Twitch channel!
  - Set unique positions, colors, fonts, and other settings per channel
  - Settings automatically load when switching between channels
  - Option to delete channel-specific settings and revert to default
  - Default settings apply to all channels unless overridden

#### 🐛 Bug Fixes
- **Fixed scrolling issue in Chromium-based browsers**: Resolved a problem where the settings menu was not scrollable in Chrome, Edge, and other Chromium browsers, preventing users from accessing all settings options

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "Anu Twitch Chat Overlay"
3. Click "Add to Chrome"

### Manual Installation
1. Download the latest release from the [releases page](https://github.com/akhanubis/anu_twitch_chat_overlay/releases)
2. Extract the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted folder

## Development

### How to build and test a new version locally:
 1. Clone the repository:
    ```bash
    git clone https://github.com/akhanubis/anu_twitch_chat_overlay.git
    ```
 2. Install dependencies:
    ```bash
    npm install
    ```
 3. Build the extension:
    ```bash
    npm run build:all
    ```
 4. Load the extension in Chrome:
    - Go to `chrome://extensions/`
    - Enable "Developer mode"
    - Click "Load unpacked"
    - Select the `dist/chrome` folder
 5. If you have Anu Twitch Chat Overlay already installed from the store, disable it to avoid conflicts

### How to load new changes while developing:
 6. Make your changes to the source code
 7. Rebuild the extension:
    ```bash
    npm run build:all
    ```
 8. Reload the extension:
    - Go to `chrome://extensions/`
    - Find "Anu Twitch Chat Overlay" in the list
    - Click the reload button (circular arrow icon)

## Features

- Chat overlay on top of Twitch streams
- Customizable chat position, size, colors, and fonts
- Send messages directly from the overlay
- Auto-claim channel points
- Per-channel settings (new in v1.0.7)
- Works in fullscreen mode
- Compatible with both live streams and VODs

## Support

Bugs? Suggestions? Feedback?
- Open an issue on [GitHub Issues](https://github.com/akhanubis/anu_twitch_chat_overlay/issues)
- Check existing issues before creating a new one

## Contributing

Contributions are welcome! Feel free to submit pull requests with bug fixes, new features, or improvements.
