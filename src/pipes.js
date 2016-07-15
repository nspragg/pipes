'use strict';

const LineStream = require('byline').LineStream;
const FilterStream = require('./FilterStream');

class Pipeline {
    constructor(stream) {
        const lineStream = new LineStream();
        this._stream = stream.pipe(lineStream);
    }

    grep(pattern) {
        const filterStream = new FilterStream(pattern);
        this._stream = this._stream.pipe(filterStream);
        return this;
    }

    run(cb) {
        this._stream.on('readable', () => {
            const output = [];
            let data;
            while (null !== (data = this._stream.read())) {
                output.push(String(data))
            }
            cb(null, output);
        })
    }
}

module.exports = function(stream) {
    return new Pipeline(stream);
};
