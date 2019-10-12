# Codeforces++
### Codeforces extension pack

# Installing
First you need a userscript manager, like [Tampermonkey](https://www.tampermonkey.net) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Then, go to the latest [release](https://github.com/LeoRiether/CodeforcesPP/releases/), download `script.user.js` and add it as as userscript.

# Features
+ Navbar dropdowns for easier navigation
+ "Google It" button on mashups/gym problems
+ Tutorial pop-up button
+ Custom, more minimalistic styling
+ Auto-update standings page
+ Keyboard shortcuts (see below)
+ Choose the default between common/friends-only standings

## Shortcuts
+ Open file picker to submit: `Ctrl+S`
+ Scroll to problem viewport: `Ctrl+Shift+V`/`Ctrl+Alt+V`
+ Invert images: `Ctrl+I`

# Development
Run `yarn build` to build with Parcel or `yarn start` to build in watch mode

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs

# Tests
`yarn test`
I probably won't write many tests, if any at all

# TODO
+ [ ] Docs
+ [ ] CTRL+SHIFT+P SEARCH FUNCTION
  + [ ] THIS IS HIGH PRIORITY
+ [ ] Shortcuts
+ [ ] Mashup profiles! / Codeforces automation
+ [ ] Goal: decrease number of clicks to navigate the site (partially done with navbar dropdowns!)
+ [ ] [Codeforces Visualizer](https://cfviz.netlify.com/index.html) link in profile page (not sure)
+ [ ] Remove bloat from parcel's bundle
+ [ ] Load pages with ajax so the script doesn't have to load every time (Hard, I think)
  + [ ] `<link rel="prerender">` should solve this!
    + [ ] Doesn't seem to work...
+ [x] "Google this problem" button (for mashups)
  + [ ] Custom engines
+ [ ] Zen Mode
+ [ ] File drag & drop to submit