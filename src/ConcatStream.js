import async from 'async';

import {
  toArray
} from './arrays';

import fs from 'fs';
import {
  Transform
} from 'stream';

import LineStream from 'byline';

function createTextStream(file) {
  return fs.createReadStream(file).pipe(new LineStream());
}

class CatStream extends Transform {
  constructor(files) {
    super();
    this._fstreams = toArray(files).map(createTextStream);
    this._buffer = [];
  }

  _transform(data, encoding, next) {
    this._buffer.push(data);
    next();
  }

  _consume(fstream, cb) {
    fstream.on('readable', () => {
      let chunk;
      while ((chunk = fstream.read()) !== null) {
        this._buffer.push(String(chunk));
      }
    });

    fstream.on('end', cb);
  }

  _flushBuffer() {
    this._buffer.forEach((data) => {
      this.push(data);
    });
  }

  _flush(next) {
    async.eachSeries(this._fstreams, (fstream, cb) => {
      this._consume(fstream, cb);
    }, (err) => {
      if (err) return next(err);

      this._flushBuffer();
      next();
    });
  }
}

module.exports = CatStream;
