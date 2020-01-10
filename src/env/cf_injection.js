const env = require('./env');

const genID = (id => () => id++)(1); // magic

const eventTypes = {
    action: 1,
    result: 2
};

let resolveFnTable = {};

// Listen to result messages
window.addEventListener('message', event => {
    if (event.source != window || event.data.type != eventTypes.result)
        return;

    const resolve = resolveFnTable[event.data.id];
    if (typeof resolve === 'function') {
        resolve(event.data.result);
        delete resolveFnTable[event.data.id];
    }
});

// Post action messages
export const run = (fn, args) => new Promise(resolve => {
    const id = genID();

    resolveFnTable[id] = resolve;

    window.postMessage({
        type: eventTypes.action,
        id,
        fn,
        args
    }, '*');
});

// Inject action listener
// this runs directly in the page, not in the sanboxed browser extension environment
env.inject(function () {
    const eventTypes = {
        action: 1,
        result: 2
    };

    window.addEventListener('message', event => {
        if (event.source != window || event.data.type != eventTypes.action)
            return;

        const result = Codeforces[event.data.fn](...event.data.args);
        window.postMessage({
            type: eventTypes.result,
            id: event.data.id,
            result
        }, '*');
    });
});