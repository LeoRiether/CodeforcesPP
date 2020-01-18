// bad code ahead

const Bundler = require('parcel-bundler');
const Path = require('path');
const Hjson = require('hjson');
const { promisify } = require('util');
let fs = require('fs');
const package = require('./package.json');

fs.readFileAsync = promisify(fs.readFile);
fs.writeFileAsync = promisify(fs.writeFile);

if (process.argv.indexOf('--production') != -1)
    process.env.NODE_ENV = 'production';

process.env.TARGET =
    process.argv.indexOf('--userscript') != -1 ?
    'userscript' :
    'extension';

// Read meta.js and replace {{VERSION}}
let metaPromise = fs.readFileAsync(Path.join(__dirname, './meta.js'));
let metaString;
metaPromise.then(data => {
    metaString = data.toString().replace("{{VERSION}}", package.version);
});

const outDir = Path.join(__dirname, './dist');
const outFilename = process.env.TARGET === 'userscript' ? 'script.user.js' : 'contentScript.js';
const outMetaFilename = 'script.meta.js';
const outFile = Path.join(outDir, outFilename);
const outMetaFile = Path.join(outDir, outMetaFilename);

const manifestIn = 'manifest.hjson';
const manifestOut = Path.join(outDir, 'manifest.json');

let bundler = new Bundler(Path.join(__dirname, package.main), {
    outDir:      outDir,
    outFile:     outFilename,
    minify:      process.env.TARGET === 'extension' && process.env.NODE_ENV === 'production',
    global:      'cfpp',
    contentHash: false,
    watch:       process.env.NODE_ENV != 'production',
    sourceMaps:  false,
    scopeHoist:  true,
});

async function writeMeta() {
    if (process.env.TARGET !== 'userscript') return;

    let data = await fs.readFileAsync(outFile);
    data = metaString + '\n' + data;
    await Promise.all([
        fs.writeFileAsync(outFile, data),
        fs.writeFileAsync(outMetaFile, metaString)
    ]);
}

async function writeManifest() {
    let data = await fs.readFileAsync(manifestIn);
    let manifest = Hjson.parse(data.toString());
    manifest.version = package.version;
    await fs.writeFileAsync(manifestOut, JSON.stringify(manifest, null, 4));
}

// TODO: Maybe there's a way to pipe Parcel's output to a JS function, then to the output?
bundler.on('buildEnd', async () => {
    await metaPromise; // wait for the metaString to be read

    await Promise.all([
        writeMeta(),
        writeManifest(),
    ])
    console.log("[*] UserScript Built!");
});

bundler.bundle();