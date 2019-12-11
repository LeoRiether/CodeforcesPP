/**
 * @file Minimalistic event-bus
 */

let { safe } = require('./Functional');
let listeners = {};

module.exports = {
    listen(event, callback) {
        if (!listeners[event])
            listeners[event] = [];
        listeners[event].push(safe(callback));
    },

    async fire(event, data) {
        (listeners[event] || [])
            .forEach(cb => cb(data));
    }
};