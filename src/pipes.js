import fs from 'fs';
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

    const output = [];
    pipeline.on('readable', () => {
      let data;
      while (null !== (data = pipeline.read())) {
        output.push(String(data));
      }
    });

    pipeline.on('end', () => {
      cb(null, output);
    });
  }
}

module.exports = function (stream) {
  return new Pipeline(stream);
};

module.exports.fromFile = function (file) {
  return new Pipeline(fs.createReadStream(file));
};
