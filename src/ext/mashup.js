/**
 * @file Makes an "add all" button to the mashup creation page that adds many problems at the same time to a mashup
 */

import dom from '../helpers/dom';
import * as config from '../env/config';
import env from '../env/env';

/**
 * Inserts the "Add all" button
 */
const installAddAll = (form) => {
    async function addAll() {
        let input = dom.$('.ac_input', form);
        let button = dom.$('._MashupContestEditFrame_addProblemLink');

        const add = problem => new Promise(res => {
            input.value = problem;
            button.click();

            (function tryRes() {
                if (input.value == '') return res();
                setTimeout(tryRes, 100);
            })();
        });

        const problems = input.value.split(/\s/).filter(p => p != "");
        for (let problem of problems) {
            await add(problem);
        }
    }

    const spanStyle =
        `border-radius: 50%; background: #959595; 
         color: white; margin-left: 0.5em;
         display: inline-block; text-align: center; width: 1em;
         cursor: pointer;`

    let button = (<div style="text-align: center;">
        <input type="submit" onClick={addAll} value="Add all" />
        <span
            style={spanStyle}
            onClick={() => env.global.Codeforces.showMessage(
                `Input multiple problem codes separated by whitespace (like "123A 123B")
                 and press "Add all" to add all of them at once`)}>
            ?
        </span>
    </div>);

    form.insertAdjacentElement('afterend', button);
};

/**
 * Sets up tag spoilers in mashup pages and adds the "Toggle tag spoilers"
 * button
 */
const installMashupTagSpoilers = (form) => {
    const frame = dom.$('._MashupContestEditFrame_frame');
    const updateDOM = () => {
        if (config.get('mashupSpoilers'))
            frame.classList.add('spoilered-mashup');
        else
            frame.classList.remove('spoilered-mashup');
    };

    const toggleSpoilers = () => {
        config.toggle('mashupSpoilers');
        updateDOM();
    };

    let button = (<div style="text-align: center; margin-bottom: 1rem;">
        <input type="submit" onClick={toggleSpoilers}
            value="Toggle tag spoilers" />
    </div>);

    form.insertAdjacentElement('afterend', button);
    updateDOM();
};

export const install = env.ready(function() {
    const form = dom.$('._MashupContestEditFrame_addProblem');
    if (!form) return;

    installAddAll(form);
    installMashupTagSpoilers(form);
});
