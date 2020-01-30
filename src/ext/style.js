/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */

import dom from '../helpers/dom';
import config from '../env/config';
import commonCSS from '../common.css';
import customCSS from '../custom.css';

function injectStyle(css) {
    let style = <style className="cfpp-style">{css}</style>;
    (document.body || document.head || document.documentElement).appendChild(style);
    return style;
}

const addStyle = typeof GM_addStyle === 'function'
                 ? GM_addStyle
                 : injectStyle;

let injectedCustomStyle;

export function custom() {
    if (process.env.TARGET === "extension") return;

    injectedCustomStyle = addStyle(customCSS);
}

export function common() {
    if (process.env.TARGET === "extension") return;

    addStyle(commonCSS);
}

// Applies only to custom css, which is configurable.
export function install() {
    if (config.get('style')) {
        custom();
    }
}

export function uninstall() {
    injectedCustomStyle && injectedCustomStyle.remove();
}