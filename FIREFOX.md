# Firefox temporary add-on instructions for Anu Twitch Chat Overlay

This repository contains the Anu Twitch Chat Overlay extension. To use the branch feature/7tv-support with built-in 7TV emote support on Firefox you can load the extension as a temporary add-on (no bundling required).

Steps to load locally in Firefox (temporary):

1. Clone the repo and checkout the branch:

   git fetch origin
   git checkout feature/7tv-support

2. Open Firefox and go to about:debugging#/runtime/this-firefox (or about:debugging -> This Firefox).

3. Click "Load Temporary Add-on" and select the file src/manifest.json in the repository you just checked out.

4. The extension will load. Visit twitch.tv, open a stream, open the Anu overlay and enable "Enable 7TV emotes" in the settings modal.

Notes & caveats
- This uses manifest_version 2 for Firefox temporary loading convenience. If you prefer a packaged distribution, run the normal build and produce a XPI.
- The temporary add-on will be unloaded when Firefox restarts. For a permanent install you must sign and package the extension for Firefox Add-ons.
- If you want a packaged dist/firefox build (XPI) I can generate one but I need to run the build pipeline locally or via CI — tell me whether you want me to create and attach a XPI file to the branch.
