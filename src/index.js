/**
 * @file Calls the appropriate modules according to the current page
 */

console.log("Codeforces++ is running!");

let dom = require('./dom');

let config = require('./config');
config.load();
config.createUI();

if (config.get('style'))
    require('./style');

// Execute features according to the current page
if (config.get('showTags') && dom.$('.tag-box')) {
    require('./show_tags')();
} else if (config.get('showTags') && dom.$('.problems')) {
    require('./problemset')();
}

require('./navbar')();

let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i;
if (config.get('searchBtn') && location.pathname.match(searchableRegex))
    require('./search_button')();

// Exported to a global cfpp variable
module.exports = {
    debug: {
        resetConfig: config.reset
    },
};
