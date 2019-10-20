/**
 * @file Updates the standings page automatically after some given interval
 */

let dom = require('./dom');

// FIXME: cf-predictor deltas dissapear after reloading standings
// FIXME: "open hacking phase open" countdown stops

function update() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', location.href);
    xhr.responseType = 'document';

    xhr.onload = function() {
        if (!xhr.response || xhr.responseURL.includes('/offline')) { 
            return console.log("Codeforces++ wasn't able to reload the standings. Please your internet connection");
        }
        
        dom.$('#pageContent').replaceWith(dom.$('#pageContent', xhr.response));  
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

/**
 * @param delay - Interval to the update function in seconds
 */
module.exports = function (delay) {
    if (delay > 0)
        setInterval(update, delay * 1000);
};