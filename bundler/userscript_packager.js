const { Packager } = require('parcel-bundler'),
      fs = require('fs');

const writeFileAsync = (file, data) => new Promise((res, rej) => {
    fs.writeFile(file, data.toString(), err => {
        err ? rej(err) : res();
    });
});

const meta = fs.readFileSync('./meta.js').toString();

class JSPackager extends Packager {
    async start() {
        const version = require('../package.json').version;
        const M = meta.replace('{{VERSION}}', version);
        await Promise.all([
            writeFileAsync('./dist/script.meta.js', M),
            this.dest.write(M)
        ]);
    }

    async addAsset(asset) {
        await this.dest.write(asset.generated.js);
    }
}

module.exports = JSPackager;