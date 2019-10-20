const Bundler = require('parcel-bundler');
const Path = require('path');
const { promisify } = require('util');
let fs = require('fs');
const package = require('./package.json');

fs.readFileAsync = promisify(fs.readFile);
fs.writeFileAsync = promisify(fs.writeFile);

if (process.argv.indexOf('--production') != -1)
    process.env.NODE_ENV = 'production';

// Read meta.js and replace {{VERSION}}
let metaPromise = fs.readFileAsync(Path.join(__dirname, './meta.js'));
let metaString;
metaPromise.then(data => {
    metaString = data.toString().replace("{{VERSION}}", package.version);
});

const outDir = Path.join(__dirname, './dist');
const outFilename = 'script.user.js';
const outMetaFilename = 'script.meta.js';
const outFile = Path.join(outDir, outFilename); 
const outMetaFile = Path.join(outDir, outMetaFilename);

let bundler = new Bundler(Path.join(__dirname, package.main), {
    outDir:      outDir,
    outFile:     outFilename,
    minify:      false,
    global:      'cfpp',
    contentHash: false,
    watch:       process.env.NODE_ENV != 'production',
    sourceMaps:  false,
});

// TODO: Maybe there's a way to pipe Parcel's output to a JS function, then to the output?
bundler.on('buildEnd', async () => {
    await metaPromise; // wait for the metaString to be read

    let data = await fs.readFileAsync(outFile);
    data = metaString + '\n' + data;
    await fs.writeFileAsync(outFile, data);
    await fs.writeFileAsync(outMetaFile, metaString);
    console.log("[*] UserScript Built!");
});

bundler.bundle();