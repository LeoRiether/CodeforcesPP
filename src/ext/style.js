/**
 * @file Provides styling for cfpp-created elements as well as a custom Codeforces styling
 */

import dom from '../helpers/dom';
import * as config from '../env/config';
import commonCSS from '../common.css';
import customCSS from '../custom.css';

async function injectStyle(css) {
    let style = <style className="cfpp-style">{css}</style>;
    (document.body || document.head || document.documentElement).appendChild(style);
    return style;
}

const addStyle = typeof GM_addStyle === 'function'
                 ? GM_addStyle
                 : injectStyle;

let injectedCustomStyle;

export async function custom() {
    injectedCustomStyle = await addStyle(customCSS);
}

export async function common() {
    if (process.env.TARGET != 'extension') {
        addStyle(commonCSS);
    }
}

// Applies only to custom css, which is configurable.
export function install() {
    if (config.get('style')) {
        custom();
    }
}

export function uninstall() {
    injectedCustomStyle && injectedCustomStyle.remove();
    injectedCustomStyle = undefined;
}