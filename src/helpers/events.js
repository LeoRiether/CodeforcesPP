/**
 * @file Minimalistic event-bus
 */

import { safe } from './Functional';
let listeners = {};

export function listen(event, callback) {
    if (!listeners[event])
        listeners[event] = [];
    listeners[event].push(safe(callback));
}

export async function fire(event, data) {
    (listeners[event] || [])
        .forEach(cb => cb(data));
}