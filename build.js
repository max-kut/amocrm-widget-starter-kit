import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import {rollup} from 'rollup';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import dotenv from 'dotenv';
import installer from '@amopro/widget-installer';
const {makeZipArchive} = installer;


const __dirname = path.resolve();

dotenv.config();
const PRODUCTION = process.env.APP_ENV === 'production';

const DIST_PATH = path.resolve(__dirname, './dist');

function makeWidgetDir() {
    fse.removeSync(DIST_PATH);
    fse.copySync(path.resolve(__dirname, './static'), DIST_PATH);

    // update path version
    {
        const manifestPath = path.resolve(__dirname, './dist/manifest.json');
        let manifest = fse.readJsonSync(manifestPath);

        manifest.widget.version = (ver => {
            let [major, minor, patch] = ver.split('.');
            const versionPath = path.resolve(__dirname, './.version');

            let newPatch = 1;
            try {
                newPatch = fs.readFileSync(versionPath);
            } catch (e) {
                // nothing
            }
            patch = +newPatch + 1;
            fs.writeFileSync(versionPath, String(patch));

            return [major, minor, patch].join('.');
        })(manifest.widget.version);

        // manifest.dp.webhook_url = String(manifest.dp.webhook_url)
        //     .replace('${APP_URL}', process.env.APP_URL.replace(/\/*$/, ''));

        fse.writeFileSync(manifestPath, JSON.stringify(manifest, null, '    '));
    }
}

async function build() {
    console.log('Building widget...');
    // see below for details on the options
    const inputOptions = {
        input: path.resolve(__dirname, './src/script.js'),
        plugins: [
            alias({
                entries: {
                    '~': path.resolve(__dirname, './src')
                }
            }),
            resolve({
                browser: true,
                dedupe: [],
                extensions: ['.js', '.json']
            }),
            replace({
                preventAssignment: true,
                'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
            }),
            commonjs({
                include: ['jquery', 'node_modules/**'],
                sourceMap: !PRODUCTION,
            }),
            babel({
                babelHelpers: 'bundled',
                babelrc: false,
                exclude: 'node_modules/**', // only transpile our source code
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: false,
                        }
                    ],
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                ]
            }),

            PRODUCTION && terser()
        ]
    };
    // create a bundle
    const bundle = await rollup(inputOptions);

    // or write the bundle to disk
    await bundle.write({
        file: path.resolve(__dirname, './dist/script.js'),
        format: 'iife',
        sourcemap: false
    });
}

const makeZip = async () => {
    const zipPath = path.resolve(__dirname, './widget.zip');
    fse.removeSync(zipPath);
    await makeZipArchive(DIST_PATH, zipPath);
}

makeWidgetDir();
try {
    build().then(makeZip).then(() => {
        console.log('Done!');
    }).catch(e => {
        console.error(e);
    });
} catch (e) {
    console.error(e);
}
