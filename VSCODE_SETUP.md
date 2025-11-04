# Anu Twitch Chat Overlay - VS Code Development Setup

This is a browser extension that overlays Twitch chat on the video player. This project supports both Chrome and Firefox browsers.

## Project Structure

- `src/` - Source code for the extension
  - `chrome/` - Chrome-specific manifest and files
  - `firefox/` - Firefox-specific manifest and files
  - `assets/` - Images and other assets
  - `.js` - JavaScript source files
- `dist/` - Built extension files (generated after build)
- `publish/` - Distribution packages (generated after packaging)

## VS Code Configuration

This project includes VS Code configuration files to help with development:

- `.vscode/settings.json` - Editor settings
- `.vscode/extensions.json` - Recommended extensions
- `.vscode/launch.json` - Debug configurations
- `.vscode/tasks.json` - Predefined tasks

## Getting Started

1. Install dependencies: `npm install`
2. Build the extension: `npm run build` or use the VS Code task
3. To build all packages: `npm run build:all` or use the VS Code task

For a complete development workflow, see the main README.md file.

## Loading in Browser

After building:

### Chrome:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select `dist/chrome` folder

### Firefox:
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on" and select a file from `dist/firefox` folder

## VS Code Tasks

Available tasks (Terminal → Run Task):
- `npm: install` - Install dependencies
- `npm: build` - Build the extension
- `npm: build:all` - Build and package for both Chrome and Firefox
- `npm: package:chrome` - Package for Chrome
- `npm: package:firefox` - Package for Firefox

## Development Workflow

1. Make changes to source files in `src/`
2. Run `npm run build` to compile
3. Reload the extension in your browser to see changes
4. For detailed instructions, refer to the main README.md