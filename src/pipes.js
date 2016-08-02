import fs from 'fs';
import LineStream from 'byline';
import FilterStream from './FilterStream';
import StringStream from './StringStream';
import LimitStream from './LimitStream';
import CatStream from './ConcatStream';
import ThroughStream from './throughStream';
import bluebird from 'bluebird';

const request = require('request');

import zlib from 'zlib';

function toArray(stream, output) {
  let data;
  while (null !== (data = stream.read())) {
    output.push(String(data));
  }
}

function join(output) {
  return output.join('');
}

class Pipeline {
  constructor(stream) {
    this._sourceStream = stream;
    this._streamFilters = [];
    this._readAsLines = true;
  }

  _createPipeline(sourceStream) {
    let pipeline = sourceStream;
    if (this._isCompressed) {
      pipeline = pipeline.pipe(zlib.createGunzip());
    }

    if (this._readAsLines) {
      pipeline = pipeline.pipe(new LineStream());
    }

    this._streamFilters.forEach((filterStream) => {
      pipeline = pipeline.pipe(filterStream);
    });

    return pipeline;
  }

  _promisify(pipeline) {
    const buffer = [];

    return new bluebird((resolve, reject) => {
      pipeline
        .on('readable', (data) => {
          toArray(pipeline, buffer);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          if (this._resultHandler) {
            return resolve(this._resultHandler(buffer));
          }
          resolve(buffer);
        });
    });
  }

  grep(pattern) {
    this._streamFilters.push(new FilterStream(pattern));
    return this;
  }

  zcat() {
    this._isCompressed = true;
    return this;
  }

  cat() {
    this._streamFilters.push(new CatStream(arguments));
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

  // readAsLines() {
  //   this._readAsLines = true;
  //   return this;
  // }

  ignoreNewlines() {
    this._readAsLines = false;
    return this;
  }

  resultHandler(fn) {
    this._resultHandler = fn;
    return this;
  }

  run(cb) {
    return this._promisify(this._createPipeline(this._sourceStream)).asCallback(cb);
  }
}

module.exports = function (stream) {
  return new Pipeline(stream);
};

module.exports.fromFile = function (file) {
  return new Pipeline(fs.createReadStream(file));
};

module.exports.fromRequest = function (url) {
  const httpResponseStream = request
    .get(url)
    .pipe(new ThroughStream());

  return new Pipeline(httpResponseStream)
    .ignoreNewlines()
    .resultHandler(join);
};
