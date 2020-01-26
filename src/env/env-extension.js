// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

import { pluck } from '../helpers/Functional';

export const global = process.env.TARGET == 'extension' && window;

// Stands for Message-Passing Hell and helps us to send and receive messages
let mph = {
    resolvers: {},
    genID: (id => () => id++)(1),

    send(message) {
        return new Promise((resolve, reject) => {
            let id = this.genID();
            message.id = id;
            message.to = 'cs';
            this.resolvers[id] = resolve;
            console.log('Posting message', message);

            window.postMessage(message, '*');
            setTimeout(() => reject('Failed to get configuration: timeout'), 20000); // 20s timeout
        });
    },

    init() {
        window.addEventListener('message', e => {
            console.log("[mph] Got", e.data);
            if (e.origin !== window.origin || e.data.type !== 'bg result')
                return;

            this.resolvers[e.data.id](e.data.result);
            delete this.resolvers[e.data.id];
        });
    }
};

mph.init();

export const storage = {
    get: key => mph.send({ type: 'get storage', key })
                .then (pluck(key)),
    set: (key, value) => mph.send({ type: 'set storage', key, value })
};