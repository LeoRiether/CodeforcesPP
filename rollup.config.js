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
    injectProcessEnv({ NODE_ENV: process.env.NODE_ENV || 'development', TARGET }),
    importCss(),
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
            format: 'esm',
            file: 'dist/extension/index.js',
        },
        plugins: [
            ...plugins('extension'),
            (process.env.NODE_ENV == 'production' ? terser() : {}),
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