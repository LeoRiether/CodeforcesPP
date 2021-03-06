/**
 * @file Minimalistic event-bus
 */

let listeners = {};

export function listen(event, callback) {
    if (!listeners[event])
        listeners[event] = [];
    listeners[event].push(callback);
}

export async function fire(event, data) {
    const results = (listeners[event] || [])
                        .map(async cb => cb(data));

    return Promise.all(results);
}