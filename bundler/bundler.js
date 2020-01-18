const Bundler = require('parcel-bundler');

// Look mom, no configuration!

const production = process.env.NODE_ENV === 'production' || process.argv.indexOf('--production') !== -1;
process.env.NODE_ENV = production ? 'production' : 'development';

console.log(`Running in ${process.env.NODE_ENV} mode\n`);

const options = {
    minify: production,
    watch: !production,
    outDir: './dist',
    contentHash: false,
    sourceMaps:  false,
    scopeHoist:  true,
};

// Register bundlers
let userscriptBundler = new Bundler('./src/index.js', {
    ...options,
    outDir: './dist/userscript',
    minify: false,
    outFile: 'script.user.js'
});
userscriptBundler.addPackager('js', require.resolve('./userscript_packager.js'));0
userscriptBundler.on('buildStart', () => process.env.TARGET = 'userscript'); // hacky

let extensionBundler = new Bundler(
    [
        './src/index.js', './src/contentScript.js',
        './src/background.js', './src/background.html',
    ],
    {
        ...options,
        outDir: './dist/extension',
    }
);
extensionBundler.on('buildStart', () => process.env.TARGET = 'extension'); // hackish

// Works, but not always
// I hate it
let manifestBundler = new Bundler('./manifest.hjson', {
    ...options,
    outDir: './dist/extension'
});
manifestBundler.addAssetType('hjson', require.resolve('./hjson_asset'));
manifestBundler.addPackager('json', require.resolve('./hjson_packager'));

//! Works, but only sometimes
// parcel-bundler is turning out to be kinda horrible
// // Bundle
// // thanks https://github.com/parcel-bundler/parcel/issues/2838#issuecomment-482771863
// let bundlers = [ extensionBundler, userscriptBundler ];
// bundlers.forEach(async (bundler) => {
//     await new Promise(resolve => {
//         bundler.on('bundled', resolve)
//         bundler.bundle()
//     });
// });

let bundler = process.argv.indexOf('--userscript') !== -1 ? userscriptBundler : extensionBundler;
bundler.bundle();