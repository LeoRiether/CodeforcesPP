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
  const results = (listeners[event] || []).map(async cb => cb(data));
  return Promise.all(results);
}

/**
 * @file Experimental functional library, kinda like Ramda, but not as sound
 */
function curry(fn, arity = fn.length, ...args) {
  return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
}
/**
 * Returns a new function that, when called, will try to call `fn`.
 * If `fn` throws, `def` will be returned instead
 * @param {Function} fn The function to try executing
 * @param {any} def The default value to return if `fn` throws
 * @return {Function}
 */

function safe(fn, def) {
  return (...args) => {
    try {
      return fn(...args);
    } catch {
      return def;
    }
  };
}
/**
 * Curried version of Array.prototype.map
 */

const map = fn => arr => [].map.call(arr, fn);
/**
 * Flattens one level of a list
 * @param {[[a]]} list
 * @return {[a]}
 */

function flatten(list) {
  const len = xs => xs && typeof xs.length === 'number' ? xs.length : 1;

  const n = list.reduce((acc, xs) => acc + len(xs), 0);
  let res = new Array(n);
  let p = 0;

  for (let i = 0; i < list.length; i++) {
    if (list[i] && list[i].length >= 0) {
      for (let j = 0; j < list[i].length; j++) res[p++] = list[i][j];
    } else {
      res[p++] = list[i];
    }
  }

  return res;
}
function once(fn) {
  let result,
      ran = false;
  return function (...args) {
    if (!ran) {
      ran = true;
      result = fn(...args);
    }

    return result;
  };
}
const pluck = key => obj => obj[key];

test.createStream().pipe(tapDiff()).pipe(globalThis.process.stdout); // Tests a function that returns a Promise and calls t.end() when the promise is resolved

test('events.js works', t => {
  t.test('basic events', t => {
    t.plan(3);
    listen('event_id', data => t.equal(data, 123, "Events fire correctly 1"));
    const symbol_event = Symbol();
    listen(symbol_event, data => t.equal(data, 'creative data', "Events fire correctly 2"));
    fire('event_id', 123);
    fire(symbol_event, 'creative data');
    fire('event_id', 123);
  });
  t.test('events.fire', t => {
    t.plan(3);
    const id = Symbol();
    listen(id, () => 1);
    listen(id, () => Promise.resolve(2));
    listen(id, () => new Promise(resolve => {
      setTimeout(() => resolve(3), 20);
    }));
    const p = fire(id);
    t.equal(typeof p.then, 'function', 'returns a Promise');
    p.then(results => {
      t.ok(results instanceof Array && results.length == 3, 'is resolved with an array');
      t.deepEqual(results, [1, 2, 3], 'is resolved with an array of results from the listeners');
    });
  });
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
    const b = [1, [2], [[123, 456]]];
    const c = [[1], [], [2]];
    t.deepEqual(flatten(a), [1, 2, 3, 4, [5]], 'flattens exactly one level of depth');
    t.notDeepEqual(flatten(b), [1, 2, [3, 4]], 'flattens exactly one level of depth');
    t.equal(flatten(c).length, [1, 2].length, 'should handle empty elements correctly');
    t.end();
  });
  t.test('safe', t => {
    const fn = x => {
      if (x == 0) throw "catch me if you can!";
      return x + 1;
    };

    const safeFn = safe(fn, 123);
    t.doesNotThrow(() => safeFn(0), undefined, "fn throws but safe does not");
    t.equal(safeFn(0), 123, "fn throws but safe returns the given default value");
    t.doesNotThrow(() => safeFn(1), undefined, "fn does not throw and safe doesn't either");
    t.equal(safeFn(1), 2, "fn does not throw and safe returns the same value");
    t.end();
  });
  t.test('once', t => {
    let calls = 0;
    const countCalls = once(() => calls++);
    countCalls();
    countCalls();
    countCalls();
    t.equal(calls, 1, "function decorated with once is only called once");

    const inc = x => x + 1;

    const inc_once = once(inc);
    t.equal(inc_once(10), 11, "return value is always the result of the first call");
    t.equal(inc_once(9999), 11, "return value is always the result of the first call");
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
