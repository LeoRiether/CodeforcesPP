// This is actually a helper file!

import dom from '../../helpers/dom';

/**
 * Runs all <script> tags inside the element
 */
export function runScripts(element) {
    const scripts = [].slice.call(element.getElementsByTagName('script'));
    scripts.forEach(s => {
        const content = s.childNodes[0].nodeValue;
        element.appendChild(<script type="text/javascript">{content}</script>);
        s.remove();
    });
}

/**
 * Returns the <div id="pageContent" in the standings page for a given URL
 */
export const getStandingsPageContent = url =>
    fetch(url)
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'text/html'))
        .then(html => dom.$('#pageContent', html) || Promise.reject("You might be offline or Codeforces is down!"));