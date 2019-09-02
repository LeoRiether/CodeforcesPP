const Bundler = require('parcel-bundler');
const Path = require('path');
const { promisify } = require('util');
let fs = require('fs');

// TODO: maybe we don't need this script at all!

let DEV = false; // TODO: change to process.environment

fs.readFileAsync = promisify(fs.readFile);
fs.writeFileAsync = promisify(fs.writeFile);

let userscriptString = 
`// ==UserScript==
// @name         Codeforces++
// @namespace    cfpp
// @version      1.0
// @description  Codeforces extension pack
// @author       LeoRiether
// @source       https://github.com/LeoRiether/CodeforcesPP
// @match        https://codeforces.com/*
// @grant        none
// @updateURL    https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.meta.js
// @downloadURL  https://github.com/LeoRiether/CodeforcesPP/releases/latest/download/script.user.js
// ==/UserScript==\n`;
// userscriptString = '';

const outDir = Path.join(__dirname, './dist');
const outFilename = 'script.user.js';
const outFile = Path.join(outDir, outFilename); 

let bundler = new Bundler(Path.join(__dirname, "./src/index.js"), {
    outDir:      outDir,
    outFile:     outFilename,
    minify:      true,
    global:      'cfpp',
    contentHash: false,
    watch:       DEV ? true : false,
});

// TODO: Maybe there's a way to pipe Parcel's output to a JS function, then to the output?
bundler.on('buildEnd', async () => {
    let data = await fs.readFileAsync(outFile);
    data = userscriptString + data;
    await fs.writeFileAsync(outFile, data);
    console.log("[*] UserScript Built!");
});

bundler.bundle();