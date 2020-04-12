import importCss from "@atomico/rollup-plugin-import-css";
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import copy from 'rollup-plugin-copy';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

import HJSON from 'hjson';
import fs from 'fs';

let meta;

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
}

function copyMeta(to) {
    return {
        async buildEnd() {
            fs.writeFile(to, meta, Function());
        },

        buildStart() {
            meta = fs.readFileSync('./meta.js').toString();
            meta = meta.replace('{{VERSION}}', require('./package.json').version);
        }
    }
}

const plugins = TARGET => [
    babel({
        exclude: 'node_modules/**',
        babelrc: true,
    }),
    importCss({
        include: 'src/*.css',
        minify: true,
    }),
    injectProcessEnv({
        NODE_ENV: process.env.NODE_ENV || 'development',
        VERSION: require('./package.json').version,
        TARGET
    }),
    (TARGET == 'extension' && process.env.NODE_ENV == 'production' ? terser() : {}),
];

export default [
    // Userscript
    {
        input: 'src/index.js',
        output: {
            format: 'iife',
            file: 'dist/userscript/script.user.js',
            banner: () => meta,
        },
        plugins: [
            ...plugins('userscript'),
            copyMeta('dist/userscript/script.meta.js')
        ]
    },

    // Extension
    {
        input: 'src/index.js',
        output: {
            format: 'iife',
            file: 'dist/extension/index.js',
        },
        plugins: [
            ...plugins('extension'),
            copy({
                targets: [
                    { src: ['src/popup.html', 'src/custom.css', 'src/common.css',
                            'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'],
                      dest: 'dist/extension' },
                ]
            }),
            copy({
                targets: [
                    { src: [ 'assets/icons/**', 'assets/cf++ logo.svg' ],
                      dest: 'dist/extension/icons' },
                ],
                copyOnce: true
            }),
            copyManifest('manifest.hjson', 'dist/extension/manifest.json') // not ideal, when only the manifest changes, no build will be triggered
        ]
    },
    {
        input: 'src/contentScript.js',
        output: {
            format: 'esm',
            file: 'dist/extension/contentScript.js',
        },
        plugins: plugins('extension'),
    },
    {
        input: 'src/background.js',
        output: {
            format: 'esm',
            file: 'dist/extension/background.js',
        },
        plugins: plugins('extension'),
    },
    {
        input: 'src/popup.js',
        output: {
            format: 'esm',
            file: 'dist/extension/popup.js'
        },
        plugins: plugins('extension')
    }
];