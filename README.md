
# Codeforces++
### Codeforces extension pack [![DeepScan grade](https://deepscan.io/api/teams/7211/projects/9332/branches/120125/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=7211&pid=9332&bid=120125) [![CodeFactor](https://www.codefactor.io/repository/github/leoriether/codeforcespp/badge)](https://www.codefactor.io/repository/github/leoriether/codeforcespp) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/LeoRiether/CodeforcesPP) ![GitHub](https://img.shields.io/github/license/LeoRiether/CodeforcesPP)

# Features
+ "Show Tags" button
+ Navbar dropdowns for easier navigation
+ "Google It" button on mashups/gym problems
+ Tutorial pop-up button
+ Custom styling
+ Auto-update standings page
+ Keyboard shortcuts (see below)
+ Choose the default between common/friends-only standings
+ Hide "on test X" in verdicts
+ Start gym virtual contest from the problems page
+ The Finder, to search for any page in Codeforces
+ Add many problems at once to a mashup
+ A **dark theme**

## Shortcuts
Fully configurable, here are the default values:
+ `Ctrl+S`: Open file picker to submit
+ `Ctrl+Alt+C`: Scroll to page content
+ `Ctrl+Space`: Finder
+ `Ctrl+I`: Dark mode
+ `Ctrl+Shift+H`: Toggle "on test X" in verdicts

# Installing
Codeforces++ is available both as a browser extension and as a userscript, you can install whichever best fits your needs.

## Extension
This version offers the most functionality and can be installed via [Chrome Web Store](https://chrome.google.com/webstore/detail/codeforces%2B%2B/ehbcfilpfnlahficlpimomapmbccieoi/) or [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/codeforces/)

Some features the extension has, but the userscript can't provide:
+ All tabs sync settings¹ (turn on dark theme in one tab, all the other ones follow)
+ Settings sync across multiple devices

¹ This is particularly useful if you like to hide the test number in WA messages. In the userscript, you might hide them in one tab, but the others won't sync, thus showing"WA on test 107" mistakenly (unless you toggle all tabs manually)

## Userscript
If you don't like having dozens of active extensions in your browser, and would rather download a userscript manager to have dozens of active userscripts instead, this version's for you. To install it, you'll need a userscript manager. We recommend like [Violentmonkey](https://violentmonkey.github.io), as it is open-source and works really well, but [Tampermonkey](https://www.tampermonkey.net) and [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) should be fine too. Then, download the latest release of [script.user.js](https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.user.js), a pop-up should appear prompting to install the userscript. If this doesn't happen, add the .js manually and you're set.

# Development
Run `yarn build` to build in production mode with Rollup or `yarn start` to build in watch mode. We're currently using node v12.13.0 and yarn v1.17.3.

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs or create an issue

# Tests
Tests? Where we're going, we don't need tests.
