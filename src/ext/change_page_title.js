import env from '../env/env';
import dom from '../helpers/dom';

export const install = env.ready(function() {
    if (/\/problem\//i.test(location.href)) {
        let problemTitle = dom.$('.title');
        if (problemTitle && problemTitle.textContent)
            document.title = problemTitle.textContent;
    }
});