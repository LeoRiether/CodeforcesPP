# Codeforces++
### Codeforces extension pack

# Installing
First you need a userscript manager, like [Tampermonkey](https://www.tampermonkey.net) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Then, go to the latest [release](https://github.com/LeoRiether/CodeforcesPP/releases/), download `script.user.js` and add it as as userscript.

# Development
Run `yarn build` to build with Parcel

# Contributing
Think there's something missing from Codeforces++ or some feature could be better? I think so too, please send some PRs

# Tests
`yarn test`
I probably won't write many tests, if any at all

# TODO
+ [ ] Docs
+ [ ] @icon
+ [x] Settings button & pop-up
+ [x] Remove white thingies and replace them by actual borders
+ [ ] Mashup profiles! / Codeforces automation
+ [x] Navbar dropdowns
    + Groups => My Groups, All Groups
    + Contests => My Contests, All Contests
    + Add "Friends" tab?
+ [ ] Goal: decrease number of clicks to navigate the site (partially done with navbar dropdowns!)
+ [ ] Remove bloat from parcel's bundle
+ [ ] File drag & drop to submit
+ [ ] Load pages with ajax so the script doesn't have to load every time (Hard, I think)
+ [x] "Google this problem" button (for mashups)
  + [ ] Custom engines
+ [x] Problem-specific editorial pop-up
+ [ ] [Codeforces Visualizer](https://cfviz.netlify.com/index.html) link in profile page (not sure)