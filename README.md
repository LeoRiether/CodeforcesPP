
# Codeforces++
### Codeforces extension pack [![CodeFactor](https://www.codefactor.io/repository/github/leoriether/codeforcespp/badge)](https://www.codefactor.io/repository/github/leoriether/codeforcespp) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/LeoRiether/CodeforcesPP) ![GitHub](https://img.shields.io/github/license/LeoRiether/CodeforcesPP)

# Installing
First you need a userscript manager, like [Tampermonkey](https://www.tampermonkey.net) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Then, download [dist/script.user.js](https://github.com/LeoRiether/CodeforcesPP/raw/master/dist/script.user.js);

# Features
+ Navbar dropdowns for easier navigation
+ "Google It" button on mashups/gym problems
+ Tutorial pop-up button
+ Custom, more minimalistic styling
+ Auto-update standings page
+ Keyboard shortcuts (see below)
+ Choose the default between common/friends-only standings
+ Hide "on test X" in verdicts

## Shortcuts
+ `Ctrl+S`: Open file picker to submit
+ `Ctrl+Shift+V`/`Ctrl+Alt+V`: Scroll to the problem viewport
+ `Ctrl+Space`: Finder (configurable shortcut)
+ `Ctrl+I`: Dark mode
+ `Ctrl+Shift+H`: Toggle "on test X" in verdicts

# Development
Run `yarn build` to build with Parcel or `yarn start` to build in watch mode

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs or create an issue

# Tests
`yarn test`
I probably won't write many tests, if any at all

# TODO
+ [ ] Docs
+ [ ] Mashup profiles
+ [ ] Load pages with ajax so the script doesn't have to load every time (Hard, I think, maybe `<link rel="prerender">`, but that doesn't seem to work)
+ [ ] Zen Mode
+ [ ] More shortcuts
+ [ ] Move navbar to the top
+ [ ] Finder actions
+ [ ] Style settings
+ [ ] Fix update_standings bugs