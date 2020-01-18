const { Asset } = require('parcel-bundler'),
      Hjson = require('hjson');


class HjsonAsset extends Asset {
    constructor(...args) {
        super(...args);
        this.type = 'json';
    }

    async generate() {
        let obj = Hjson.parse(this.contents);
        obj.version = require('../package.json').version;
        return [
            {
                type: 'json',
                value: obj
            }
        ];
    }
}

module.exports = HjsonAsset;