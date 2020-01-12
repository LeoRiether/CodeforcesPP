/**
 * @file Updates the standings page automatically after some given interval
 */

const dom = require('../helpers/dom');
const config = require('../env/config');

// FIXME: cf-predictor deltas dissapear after reloading standings

function update() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', location.href);
    xhr.responseType = 'document';

    xhr.onload = function() {
        if (!xhr.response || xhr.responseURL.includes('/offline')) {
            return console.log("Codeforces++ wasn't able to reload the standings. Please check your internet connection");
        }

        let pageContent = dom.$('#pageContent');
        dom.$('.standings', pageContent).replaceWith(dom.$('#pageContent .standings', xhr.response));

        const scripts = dom.$$('#pageContent script');
        for (const script of scripts) {
            // Force script to run
            const scriptContent = script.childNodes[0].nodeValue;
            pageContent.appendChild(<script type="text/javascript">{scriptContent}</script>);
            script.remove();
        }
    };

    xhr.onerror = function() {
        // Not sure what to do
        // Gracefully stop? Notify user? Try again?
    };

    xhr.send();
}

let intervalID = 0;
export function install() {
    if (intervalID)
        uninstall();

    const standingsItv = +config.get('standingsItv');
    if (standingsItv <= 0 || location.pathname.includes('/standings')) return;

    intervalID = setInterval(update, standingsItv * 1000);
}

export function uninstall() {
    clearInterval(intervalID);
    intervalID = 0;
}