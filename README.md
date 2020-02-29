
# Codeforces++
### Codeforces extension pack [![DeepScan grade](https://deepscan.io/api/teams/7211/projects/9332/branches/120125/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=7211&pid=9332&bid=120125) [![CodeFactor](https://www.codefactor.io/repository/github/leoriether/codeforcespp/badge)](https://www.codefactor.io/repository/github/leoriether/codeforcespp) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/LeoRiether/CodeforcesPP) ![GitHub](https://img.shields.io/github/license/LeoRiether/CodeforcesPP)

# Installing
First you need a userscript manager, like [Tampermonkey](https://www.tampermonkey.net), [Violentmonkey](https://violentmonkey.github.io) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (the former is preferred). Then, download the latest release of [script.user.js](https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.user.js), a pop-up should appear prompting to install the userscript. If this doesn't happen, add the .js manually and you're set.

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
Run `yarn build` to build in production mode with Rollup or `yarn start` to build in watch mode

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs or create an issue

# Tests
`yarn test`
I probably won't write many tests, if any at all
