'use strict';

const Transform = require('stream').Transform;

class FilterStream extends Transform {
    constructor(pattern) {
        super();
        this._pattern = pattern;
    }

    _transform(data, encoding, cb) {
        if (this._pattern.test(data)) {
            this.push(data);
        }
        cb();
    }
}

module.exports = FilterStream;
