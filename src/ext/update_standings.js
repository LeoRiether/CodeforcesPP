/**
 * @file Updates the standings page automatically after some given interval
 */

let dom = require('../helpers/dom');
let config = require('../env/config');

// FIXME: cf-predictor deltas dissapear after reloading standings

function update() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', location.href);
    xhr.responseType = 'document';

    xhr.onload = function() {
        if (!xhr.response || xhr.responseURL.includes('/offline')) {
            return console.log("Codeforces++ wasn't able to reload the standings. Please your internet connection");
        }

        dom.$('#pageContent .standings').replaceWith(dom.$('#pageContent .standings', xhr.response));
        const scripts = dom.$$('#pageContent script');
        for (const script of scripts) {
            eval(script.innerHTML); // Might not work in some browsers
        }
    };

    xhr.onerror = function() {
        // Not sure what to do
        // Gracefully stop? Notify user? Try again?
    };

    xhr.send();
}

let intervalID = 0;
function install() {
    if (intervalID)
        uninstall();

    const standingsItv = +config.get('standingsItv');
    if (standingsItv <= 0 || !/\/standings/i.test(location.pathname)) return;

    intervalID = setInterval(update, standingsItv * 1000);
}

function uninstall() {
    clearInterval(intervalID);
    intervalID = 0;
}

module.exports = { install, uninstall };