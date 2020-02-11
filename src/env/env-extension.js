// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

import { pluck } from '../helpers/Functional';
import * as events from '../helpers/events';

export const global = process.env.TARGET == 'extension' && window;

const log = process.env.NODE_ENV == 'development'
            ? console.log
            : function(){};

// Stands for Message-Passing Hell and helps us to send and receive messages
let mph = {
    resolvers: {},
    genID: (id => () => id++)(1),

    send(message) {
        this.init();
        return new Promise((resolve, reject) => {
            let id = this.genID();
            message.id = id;
            message.to = 'cs';
            this.resolvers[id] = resolve;

            window.postMessage(message, '*');
            setTimeout(() => reject('Failed to get configuration: timeout'), 20000); // 20s timeout
        });
    },

    initialized: false, // not using Functional.once here because it changes `this` to something else
    init() {
        if (this.initialized) return;
        this.initialized = true;

        window.addEventListener('message', e => {
            log("[mph] Got", e.data);
            if (e.origin !== window.origin || e.data.to != 'is')
                return;

            if (e.data.type == 'bg result') {
                this.resolvers[e.data.id](e.data.result);
                delete this.resolvers[e.data.id];
            }
            else if (e.data.type == 'config change') {
                events.fire('request config change', { id: e.data.id, value: e.data.value });
            }
        });
    }
};

export const storage = {
    get: key => mph.send({ type: 'get storage', key })
                .then (pluck(key)),
    set: (key, value) => mph.send({ type: 'set storage', key, value })
};