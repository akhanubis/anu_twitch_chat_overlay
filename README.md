# anu_twitch_chat_overlay

How to build and test a new version locally:
 1. Clone repo.
 2. `npm install`
 3. `npm run build:all`
 4. `Chrome => Extensions => Manage extensions => Load unpacked` and load `anu_twitch_chat_overlay/dist/chrome` folder.
 5. If you have Anu Twitch Chat Overlay already installed, toggle it off to avoid clashing with the local version.
 
How to load new changes while developing
 
 6. Make any changes.
 7. `npm run build:all`
 8. `Chrome => Extensions => Manage extensions => Anu Twitch Chat Overlay` and click the reload icon.

Bugs? Suggestions? Feedback? Go to https://github.com/akhanubis/anu_twitch_chat_overlay/issues
