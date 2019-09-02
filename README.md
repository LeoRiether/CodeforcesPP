# Codeforces++
### Codeforces extension pack

# Installing
Put this into a userscript manager like Tampermonkey and Greasemonkey
```
// ==UserScript==
// @name         Codeforces++
// @namespace    cfpp
// @version      1.0
// @description  Codeforces extension pack
// @author       LeoRiether
// @source       https://github.com/LeoRiether/CodeforcesPP
// @match        https://codeforces.com/*
// @grant        none
// @updateURL    https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/meta.js
// @downloadURL  https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/bundle.js
// ==/UserScript==
```

# Development
Run `yarn build` to build with Parcel

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs

# Tests
`yarn test`
I probably won't write many tests, if any at all

# TODO
+ [ ] Settings button & popup
+ [x] Remove white thingies and replace them by actual borders
+ [ ] Mashup profiles! / Codeforces automation
+ [ ] Navbar dropdowns
    + Groups => My Groups, All Groups
    + Contests => My Contests, All Contests
    + Add "Friends" tab?
+ [ ] Goal: decrease number of clicks to navigate the site
+ [ ] Remove bloat from parcel's bundle
+ [ ] File dropdown to submit
+ [ ] Load pages with ajax so the script doesn't have to load every time (Hard, I think)