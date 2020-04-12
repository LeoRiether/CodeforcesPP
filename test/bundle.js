'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var test = _interopDefault(require('tape'));
var tapDiff = _interopDefault(require('tap-diff'));
var puppeteer = _interopDefault(require('puppeteer'));
var path = _interopDefault(require('path'));

/**
 * @file Minimalistic event-bus
 */
let listeners = {};
function listen(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
}
async function fire(event, data) {
  (listeners[event] || []).forEach(async cb => cb(data));
}

/**
 * @file Experimental functional library, kinda like Ramda, but not as sound
 */
function curry(fn, arity = fn.length, ...args) {
  return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
}
/**
 * Curried version of Array.prototype.map
 */

const map = fn => arr => [].map.call(arr, fn);
const flatten = list => list.reduce((acc, a) => acc.concat([].slice.call(a)), []);
const pluck = key => obj => obj[key];

test.createStream().pipe(tapDiff()).pipe(globalThis.process.stdout); // Tests a function that returns a Promise and calls t.end() when the promise is resolved

test('events.js works', t => {
  t.plan(3);
  listen('event_id', data => t.equal(data, 123, "Events fire correctly 1"));
  listen('creative event name', data => t.equal(data, 'creative data', "Events fire correctly 2"));
  fire('event_id', 123);
  fire('creative event name', 'creative data');
  fire('event_id', 123);
});
test('Functional works', t => {
  t.test('curry', t => {
    const sum = curry((x, y, z) => x + y + z);
    t.equal(sum(1, 2, 3), sum(1, 2)(3));
    t.equal(sum(1, 2)(3), sum(1)(2)(3));
    t.end();
  });
  t.test('map', t => {
    const a = [1, 2, 3, 4];
    const b = ["1", "2", "3", "4"];

    const inc = x => x + 1;

    t.deepEqual(map(inc)(a), [2, 3, 4, 5]);
    t.deepEqual(map(inc)(b), ["11", "21", "31", "41"]);
    t.end();
  });
  t.test('pluck', t => {
    const sym = Symbol();
    const managers = [{
      name: 'Bob',
      human: true,
      [sym]: 1
    }, {
      name: 'Alice',
      human: true,
      [sym]: 2
    }, {
      name: 'Tampermonkey',
      human: false,
      [sym]: 3
    }, {
      name: 'Violentmonkey',
      human: false,
      [sym]: 4
    }];
    t.deepEqual(managers.map(pluck('name')), ['Bob', 'Alice', 'Tampermonkey', 'Violentmonkey'], 'basic plucking');
    t.deepEqual(managers.map(pluck(sym)), [1, 2, 3, 4], 'symbol plucking');
    t.end();
  });
  t.test('flatten', t => {
    const a = [[1, 2], [3], [4, [5]]];
    t.deepEqual(flatten(a), [1, 2, 3, 4, [5]], 'flattens exactly one level of depth');
    t.end();
  });
  t.end();
});
let browser;
test('Puppeteer tests', async t => {
  const extensionPath = path.join(__dirname, '../dist/extension/');
  browser = await puppeteer.launch({
    headless: false,
    // extensions are allowed only in headfull mode
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  const CodeforcesURL = 'https://codeforces.com/';
  t.test('Codeforces loads', async t => {
    t.plan(2);
    t.timeoutAfter(20000); // Is this really ok?

    const page = await browser.newPage();
    page.once('load', () => t.pass('Page loaded'));
    page.on('pageerror', err => t.comment(`console error: ${err}`));
    let result = await page.goto(CodeforcesURL);
    t.equal(result.status(), 200, 'Status is 200');
  });
  t.end();
});
test.onFinish(() => browser && browser.close());
