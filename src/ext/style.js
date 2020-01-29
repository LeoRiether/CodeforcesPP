/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */

import dom from '../helpers/dom';
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

export function install() {
    if (process.env.TARGET == 'userscript') {
        injectedCustomStyle = addStyle(customCSS);
    }
}

export function uninstall() {
    injectedCustomStyle && injectedCustomStyle.remove();
}