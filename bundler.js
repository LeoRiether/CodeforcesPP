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
// @version      0.1
// @description  Codeforces extension pack
// @author       LeoRiether
// @match        https://codeforces.com/*
// @grant        none
// ==/UserScript==\n`;
userscriptString = '';

const outDir = Path.join(__dirname, './dist');
const outFilename = 'bundle.js';
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