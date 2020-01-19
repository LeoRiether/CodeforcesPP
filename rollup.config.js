import importCss from "@atomico/rollup-plugin-import-css";
import injectProcessEnv from 'rollup-plugin-inject-process-env';
// import jsx from 'rollup-plugin-jsx';
import copy from 'rollup-plugin-copy';
import babel from 'rollup-plugin-babel';
// import commonjs from '@rollup/plugin-commonjs'; // TODO: someday make all `require`s `import`s
// import resolve from '@rollup/plugin-node-resolve';
// import compiler from '@ampproject/rollup-plugin-closure-compiler';

import HJSON from 'hjson';
import fs from 'fs';

function copyManifest(from, to) {
    return {
        async buildEnd() {
            let manifest = fs.readFileSync(from).toString();
            let obj = HJSON.parse(manifest);
            obj.version = require('./package.json').version;
            let out = JSON.stringify(obj, null, 4);
            fs.writeFile(to, out, Function());
        }
    }
};

function copyMeta(from, to) {
    return {
        async buildEnd() {
            let meta = fs.readFileSync(from).toString();
            meta = meta.replace('{{VERSION}}', require('./package.json').version);
            fs.writeFile(to, meta, Function());
        }
    }
}

const NODE_ENV = process.env.NODE_ENV || (process.argv.includes('--production') ? 'production' : 'development');

const plugins = TARGET => [
    babel({
        exclude: 'node_modules/**',
        babelrc: true,
    }),
    injectProcessEnv({ NODE_ENV, TARGET }),
    importCss(),
];

export default [
    // Userscript
    {
        input: 'src/index.js',
        output: {
            format: 'iife',
            file: 'dist/userscript/script.user.js',
        },
        plugins: [
            ...plugins('userscript'),
            copyMeta('meta.js', 'dist/userscript/script.meta.js')
        ]
    },

    // Extension
    {
        input: 'src/index.js',
        output: {
            format: 'esm',
            file: 'dist/extension/index.js'
        },
        plugins: [
            ...plugins('extension'),
            copy({
                targets: [
                    { src: 'src/contentScript.js', dest: 'dist/extension' },
                    { src: 'src/background.js',    dest: 'dist/extension' },
                    { src: 'src/background.html',  dest: 'dist/extension' },
                    { src: 'src/custom.css',       dest: 'dist/extension' },
                ]
            }),
            copyManifest('manifest.hjson', 'dist/extension/manifest.json') // not ideal, when only the manifest changes, no build will be triggered
        ]
    }
];