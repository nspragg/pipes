'use strict';

import LineStream from 'byline';
import FilterStream from './FilterStream';
import StringStream from './StringStream';
import LimitStream from './LimitStream';
import zlib from 'zlib';

class Pipeline {
  constructor(stream) {
    this._sourceStream = stream;
    this._streamFilters = [];
  }

  _createPipeline(sourceStream) {
    let pipeline = sourceStream;
    if (this._isCompressed) {
      pipeline = pipeline.pipe(zlib.createGunzip());
    }

    pipeline = pipeline.pipe(new LineStream());

    this._streamFilters.forEach((filterStream) => {
      pipeline = pipeline.pipe(filterStream);
    });

    return pipeline;
  }

  grep(pattern) {
    this._streamFilters.push(new FilterStream(pattern));
    return this;
  }

  zcat() {
    this._isCompressed = true;
    return this;
  }

  strings() {
    this._streamFilters.push(new StringStream());
    return this;
  }

  head(n) {
    this._streamFilters.push(new LimitStream(n));
    return this;
  }

  run(cb) {
    const pipeline = this._createPipeline(this._sourceStream);

    pipeline.on('readable', () => {
      const output = [];
      let data;
      while (null !== (data = pipeline.read())) {
        output.push(String(data))
      }
      cb(null, output);
    })
  }
}

module.exports = function (stream) {
  return new Pipeline(stream);
};
