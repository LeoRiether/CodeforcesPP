const { Packager } = require('parcel-bundler');

class HjsonPackager extends Packager {
    async addAsset(asset) {
        console.log(asset.generated);
        let out = JSON.stringify(asset.generated.json, null, 4);
        await this.dest.write(out);
    }
}

module.exports = HjsonPackager;