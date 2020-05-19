import test from 'tape';
import tapDiff from 'tap-diff';
import puppeteer from 'puppeteer';

import * as events from '../src/helpers/events';
import {
	curry,
	pluck,
	map,
	flatten,
	safe,
	once
} from '../src/helpers/Functional';

import path from 'path';

test.createStream()
    .pipe(tapDiff())
    .pipe(globalThis.process.stdout);

// Tests a function that returns a Promise and calls t.end() when the promise is resolved
const testAsync = (description, fn, testFn=test) => {
    testFn(description, t => {
        fn(t)
        .then(() => t.end())
        .catch(err => t.end(err));
    });
};

test('events.js works', t => {
    t.plan(3);
    events.listen('event_id', data =>
        t.equal(data, 123, "Events fire correctly 1"));
    events.listen('creative event name', data =>
        t.equal(data, 'creative data', "Events fire correctly 2"));

    events.fire('event_id', 123);
    events.fire('creative event name', 'creative data');
    events.fire('event_id', 123);
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
        t.deepEqual(map (inc) (a), [2, 3, 4, 5]);
        t.deepEqual(map (inc) (b), ["11", "21", "31", "41"]);
        t.end();
    });

    t.test('pluck', t => {
        const sym = Symbol();
        const managers = [
            { name: 'Bob', human: true, [sym]: 1 },
            { name: 'Alice', human: true, [sym]: 2 },
            { name: 'Tampermonkey', human: false, [sym]: 3 },
            { name: 'Violentmonkey', human: false, [sym]: 4 },
        ];

        t.deepEqual(
            managers.map(pluck('name')),
            ['Bob', 'Alice', 'Tampermonkey', 'Violentmonkey'],
            'basic plucking'
        );

        t.deepEqual(
            managers.map(pluck(sym)),
            [1, 2, 3, 4],
            'symbol plucking'
        );

        t.end();
    });

    t.test('flatten', t => {
        const a = [[1, 2], [3], [4, [5]]];
		const b = [1, [2], [[123, 456]]];
        t.deepEqual(flatten(a), [1, 2, 3, 4, [5]], 'flattens exactly one level of depth');
		t.notDeepEqual(flatten(b), [1, 2, [3, 4]], 'flattens exactly one level of depth');
        t.end();
    });

	t.test('safe', t => {
		const fn = x => {
			if (x == 0)
				throw "catch me if you can!";
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
		countCalls(); countCalls(); countCalls();
		t.equal(calls, 1, "function decorated with once is only called once");

		const inc = x => x+1;
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
        headless: false, // extensions are allowed only in headfull mode
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ]
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
